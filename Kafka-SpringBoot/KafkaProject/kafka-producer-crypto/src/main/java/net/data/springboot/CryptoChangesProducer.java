package net.data.springboot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.DriverManagerType;
import net.data.springboot.object.CryptoData;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.Browser;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CryptoChangesProducer {

    @Value("${spring.kafka.topic.name}")

    private String topicName;

    private long startTime;
    RemoteWebDriver driver;

    JavascriptExecutor js;

    private static final Logger LOGGER = LoggerFactory.getLogger(CryptoChangesProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;

    public CryptoChangesProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String messageEvent) throws InterruptedException {
        LOGGER.info(String.format("event data -> %s", messageEvent));

        kafkaTemplate.send(topicName, messageEvent);
    }

    // Each 10 seconds
    // @Scheduled(cron = "*/10 * * * * *")
    // Each 5 minutes
     //@Scheduled(cron = "0 */2 * * * *")
    @Scheduled(cron = "*/10 * * * * *")
    public void run() throws InterruptedException, IOException {
        LOGGER.info("################# Start Selenium Test ####################");
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
            LOGGER.info("################# End Selenium Test. Elapsed Time: {} seconds ####################", elapsedTime);
            driver.quit();
        }
    }

    private void scrollToBottomByPixels(int pixels) {
        // Create a JavascriptExecutor from the WebDriver
        JavascriptExecutor jsExecutor = driver;

        // Use the executeScript method to execute JavaScript code
        // Scroll down by the specified number of pixels
        jsExecutor.executeScript("window.scrollBy(0, arguments[0])", pixels);
    }

    private void stollingYourCryptoData() throws InterruptedException, JsonProcessingException {
        int pixelsToScroll = 1000;
        int scrollIterations = 9;

        for (int j = 0; j < scrollIterations; j++) {
            scrollToBottomByPixels(pixelsToScroll);
        }

        String cryptoScrap = driver.findElements(By.xpath("//table[contains(@class, 'cmc-table')]//tbody")).get(0).getText();
        List<WebElement> coinLogoElements = driver.findElements(By.className("coin-logo"));
        // List to store the src values
        List<String> srcValues = new ArrayList<>();

        for (int i = 9; i < coinLogoElements.size(); i++) {
            WebElement coinLogoElement = coinLogoElements.get(i);
            String srcValue = coinLogoElement.getAttribute("src");
            srcValues.add(srcValue);
        }

        List<CryptoData> cryptoDataList = mapData(cryptoScrap, srcValues);

        System.out.println(cryptoDataList.size());
        cryptoDataList.forEach(System.out::println);

        // Convert List<CryptoData> to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = objectMapper.writeValueAsString(cryptoDataList);

        sendMessage(jsonString);
    }

    private static List<CryptoData> mapData(String rawData, List<String> srcValues) {
        List<CryptoData> cryptoDataList = new ArrayList<>();

        // Split the raw data into lines
        String[] lines = rawData.split("\\r?\\n");
        int increment = 0;
        // Process each block of data (assuming each block has 9 lines)

        for (int i = 0; i < lines.length - 9; i += 9) {
            CryptoData cryptoData = new CryptoData();

            cryptoData.setCryptoName(lines[i + 1]);
            cryptoData.setCryptoAssetShortName(lines[i + 2]);

            // Parse currency value as double
            double currentPrice = parseCurrencyValueToDouble(lines[i + 3]);
            cryptoData.setCurrentPrice(currentPrice);

            // Remove the euro symbol and commas, then parse as double
            Long cryptoMarketCapitalization = parseCurrencyValueToLong(lines[i + 6]);
            cryptoData.setCryptoMarketCapitalization(cryptoMarketCapitalization);

            // Extract numeric part before the first space, then parse as double
            Long cryptoEuroTradedThisDay = parseCurrencyValueToLongWithCryptoName(lines[i + 7]);
            cryptoData.setCryptoEuroTradedThisDay(cryptoEuroTradedThisDay);

            // Extract numeric part before the first space, then parse as double
            Long cryptoCoinTradedThisDay = parseCurrencyValueToLongWithCryptoName(lines[i + 8]);
            cryptoData.setCryptoCoinTradedThisDay(cryptoCoinTradedThisDay);

            cryptoData.setSourceImgCoin(srcValues.get(increment));

            cryptoDataList.add(cryptoData);
            increment = increment + 1;
        }

        return cryptoDataList;
    }

    private static double parseCurrencyValueToDouble(String value) {
        String cleanedValue = value.replace("€", "").replace(",", "").replaceAll("\\.{2,}", "0");
        return Double.parseDouble(cleanedValue);
    }

    private static boolean isInteger(String s){
        try{
            Integer.parseInt(s);
            return true;
        }
        catch (NumberFormatException e){
            return false;
        }
    }

    private static Long parseCurrencyValueToLongWithCryptoName(String value) {
        // Remove currency symbol, replace commas, and replace alternate decimal separators
        String valuePick = value.split(" ")[0].substring(0,1);
        String cleanedValue = "";
        if (isInteger(valuePick)){
            cleanedValue = value.split(" ")[0].replace(",", "");
        } else{
            cleanedValue = value.split(" ")[1].replace(",", "");
        }
        return Long.parseLong(cleanedValue);
    }

    private static Long parseCurrencyValueToLong(String value) {
        // Remove currency symbol, replace commas, and replace alternate decimal separators
        String cleanedValue = value.replace("€", "").replace(",", "");
        return Long.parseLong(cleanedValue);
    }

    public void runScenario() throws IOException, InterruptedException {
        LOGGER.info("---------------- Start Scenario ----------------");

        driver.navigate().to("https://coinmarketcap.com/fr/");
        driver.manage().window().setSize(new Dimension(1450, 830));

        stollingYourCryptoData();

        LOGGER.info("---------------- End Scenario ----------------");
    }

    // To facilitate the dockerization we use selenium grid
    public void initNavigation() throws MalformedURLException {
        LOGGER.info("---------------- Start CHROME ----------------");

        WebDriverManager.chromedriver().setup();

        DesiredCapabilities cap = new DesiredCapabilities();
        cap.setBrowserName(Browser.CHROME.browserName());

        driver = new RemoteWebDriver(new URL("http://selenium-hub:4444"), cap);
    }

    // Use to launch chrome navigator and make action (POST method)
    // public void initNavigation() {
    //     LOGGER.info("---------------- Start CHROME ----------------");

    //     WebDriverManager.getInstance(DriverManagerType.CHROME).setup();
    //     ChromeOptions options = new ChromeOptions();
    //     options.addArguments("--remote-allow-origins=*");
    //     options.addArguments("--no-sandbox");
    //     options.addArguments("--disable-dev-shm-usage");
    //     options.addArguments("--headless");

    //     driver = new ChromeDriver(options);
    //     js = driver;
    // }

}
