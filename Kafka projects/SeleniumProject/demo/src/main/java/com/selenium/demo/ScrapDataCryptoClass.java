package com.selenium.demo;

import com.selenium.demo.entite.CryptoData;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.remote.Browser;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScrapDataCryptoClass {

    private static final Logger log = LoggerFactory.getLogger(ScrapDataClass.class);

    private long startTime;

    RemoteWebDriver driver;

    @Scheduled(cron = "*/10 * * * * *")
    public void run() throws InterruptedException, IOException {
        log.info("################# Start Selenium Test ####################");
        startTime = System.currentTimeMillis();
        initNavigation();
        runScenario();
        closeNavigation();
    }

    public void waitForWindow(float timeoutSeconds) {
        try {
            Thread.sleep((long) (timeoutSeconds * 1000));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void closeNavigation() {
        if (driver != null) {
            long elapsedTime = (System.currentTimeMillis() - startTime) / 1000;
            log.info("################# End Selenium Test. Elapsed Time: {} seconds ####################", elapsedTime);
            driver.quit();
        }
    }

    private void scrollToBottom() {
        // Create a JavascriptExecutor from the WebDriver
        JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;

        // Use the executeScript method to execute JavaScript code
        // The window.scrollTo() function is used to scroll to the bottom of the page
        jsExecutor.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        waitForWindow(3);
    }

    private void scrollToBottomByPixels(int pixels) {
        // Create a JavascriptExecutor from the WebDriver
        JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;

        // Use the executeScript method to execute JavaScript code
        // Scroll down by the specified number of pixels
        jsExecutor.executeScript("window.scrollBy(0, arguments[0])", pixels);
    }

    private void stollingYourCryptoData() {
        int pixelsToScroll = 1000;
        int scrollIterations = 9;

        for (int j = 0; j < scrollIterations; j++) {
            scrollToBottomByPixels(pixelsToScroll);
        }

//        List<WebElement> cryptoNameElements = driver.findElements(By.xpath("//div[contains(@class, 'hide-ranking-number')]"));
//        List<WebElement> assetShortNameElements = driver.findElements(By.xpath("//div[contains(@class, 'dDrhas')]"));
//        List<WebElement> currentPriceElements = driver.findElements(By.xpath("//div[contains(@class, 'gDrtaY')]"));
//        List<WebElement> marketCapElements = driver.findElements(By.xpath("//span[contains(@class, 'bCdPBp')]"));
//        List<WebElement> euroTradedElements = driver.findElements(By.xpath("//p[contains(@class, 'jZrMxO font_weight_500')]"));
//        List<WebElement> coinTradedElements = driver.findElements(By.xpath("//p[contains(@class, 'ihZPK')]"));
//        List<WebElement> coinInCirculationElements = driver.findElements(By.xpath("//p[contains(@class, 'WfVLk')]"));
//
//        int numberOfElements = Math.min(cryptoNameElements.size(), 100);
//
//        List<CryptoData> cryptoDataList = IntStream.range(0, numberOfElements)
//                .mapToObj(i -> {
//                    CryptoData cryptoData = new CryptoData();
//                    cryptoData.setCryptoName(cryptoNameElements.get(i).getText());
//                    cryptoData.setCryptoAssetShortName(assetShortNameElements.get(i).getText());
//                    cryptoData.setCurrentPrice(currentPriceElements.get(i).getText().split("€")[1]);
//                    cryptoData.setCryptoMarketCapitalization(marketCapElements.get(i).getText().split("€")[1]);
//                    cryptoData.setCryptoEuroTradedThisDay(euroTradedElements.get(i).getText().split("€")[1]);
//                    cryptoData.setCryptoCoinTradedThisDay(coinTradedElements.get(i + 1).getText());
//                    cryptoData.setCryptoCoinInCirculation(coinInCirculationElements.get(i).getText());
//                    return cryptoData;
//                })
//                .collect(Collectors.toList());

        String cryptoScrap = driver.findElements(By.xpath("//table[contains(@class, 'cmc-table')]//tbody")).get(0).getText();

        List<CryptoData> cryptoDataList = mapData(cryptoScrap);

        System.out.println(cryptoDataList.size());
        cryptoDataList.forEach(System.out::println);
    }

    private static List<CryptoData> mapData(String rawData) {
        List<CryptoData> cryptoDataList = new ArrayList<>();

        // Split the raw data into lines
        String[] lines = rawData.split("\\r?\\n");

        // Process each block of data (assuming each block has 9 lines)
        for (int i = 0; i < lines.length - 9; i += 9) {
            CryptoData cryptoData = new CryptoData();

            cryptoData.setCryptoName(lines[i + 1]);
            cryptoData.setCryptoAssetShortName(lines[i + 2]);
            cryptoData.setCurrentPrice(lines[i + 3]);
            cryptoData.setCryptoMarketCapitalization(lines[i + 6]);
            cryptoData.setCryptoEuroTradedThisDay(lines[i + 7]);
            cryptoData.setCryptoCoinTradedThisDay(lines[i + 8]);
            cryptoData.setCryptoCoinInCirculation(lines[i + 9]);

            cryptoDataList.add(cryptoData);
        }


        return cryptoDataList;
    }


    public void runScenario() throws IOException {
        log.info("---------------- Start Scenario ----------------");

        driver.navigate().to("https://coinmarketcap.com/fr/");
        driver.manage().window().setSize(new Dimension(1450, 830));

        stollingYourCryptoData();

        log.info("---------------- End Scenario ----------------");
    }

    // Use to launch chrome navigator and make action (POST method)
//     public void initNavigation() {
//         log.info("---------------- Start CHROME ----------------");
//
//         WebDriverManager.getInstance(DriverManagerType.CHROME).setup();
//         ChromeOptions options = new ChromeOptions();
//         options.addArguments("--remote-allow-origins=*");
//         options.addArguments("--no-sandbox");
//         options.addArguments("--disable-dev-shm-usage");
//         options.addArguments("--headless");
//
//         driver = new ChromeDriver(options);
//         js = (JavascriptExecutor) driver;
//     }

    // To facilitate the dockerization we use selenium grid
    public void initNavigation() throws MalformedURLException {
        log.info("---------------- Start CHROME ----------------");

        WebDriverManager.chromedriver().setup();

        DesiredCapabilities cap = new DesiredCapabilities();
        cap.setBrowserName(Browser.CHROME.browserName());

        driver = new RemoteWebDriver(new URL("http://selenium-hub:4444"), cap);
        // Locally : localhost:4444
    }

}
