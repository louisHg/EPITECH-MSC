package com.selenium.demo;

import com.selenium.demo.entite.IndeedJob;
import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.DriverManagerType;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Scanner;

@Service
public class ScrapDataClass {

    private static final Logger log = LoggerFactory.getLogger(ScrapDataClass.class);

    WebDriver driver;
    JavascriptExecutor js;

    //@Scheduled(cron = "*/15 * * * * *")
    public void run() throws InterruptedException, IOException {
        log.info("################# Start Selenium Test ####################");

        initNavigation();
        runScenario();
        waitForWindow(5);
        closeNavigation();
        log.info("################# End Selenium Test ####################");
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
            driver.quit();
        }
    }

    public void runScenario() throws IOException {
        log.info("---------------- Start Scenario ----------------");

        // Setting size
        driver.navigate().to("https://www.indeed.com/");
        driver.manage().window().setSize(new Dimension(1450, 830));

        // Create a Scanner object to prompt for user input and send it on search bar of indeed
//        String jobSearch = jobSearch();
//        String jobLocation = jobLocation();
        waitForWindow(1);
        String jobSearch = "développeur";
        String jobSearchLocation = "Paris";
        String fileName = jobSearch + jobSearchLocation;
        driver.findElement(By.id("text-input-what")).sendKeys(jobSearch);
        waitForWindow(3);
        driver.findElement(By.id("text-input-where")).sendKeys(jobSearchLocation);
        driver.findElement(By.xpath("//button[contains(text(), 'Rechercher')]")).click();

        int pgSize = 100;

        FileWriter csvWriter = new FileWriter(fileName.replace(" ","")+".csv");
        try {
            csvWriter.append("Job Title");
            csvWriter.append(",");
            csvWriter.append("Job CompanyName");
            csvWriter.append(",");
            csvWriter.append("Job Location");
            csvWriter.append(",");
            csvWriter.append("Job Descriptions");
            csvWriter.append(",");
            csvWriter.append("\n");
        } catch (IOException e) {
            closeNavigation();
            throw new RuntimeException(e);
        }

        for (int j = 0; j < pgSize;) {
            if(j != 0){
                String linkSecondPage = "https://fr.indeed.com/jobs?q=d%C3%A9veloppeur&l=Paris&start="+j+"&pp=gQAPAAABi-HknDgAAAACF6rP2wAwAQEBCH7X2bGBTuWHKeyRrouu1iUrpkbo3OuaRVmfsuD5qBrutwV5jaGXtLXB5nwIAAA";
                driver.navigate().to(linkSecondPage);
            }

            for (int i = 0; i < 10; i++) {
                IndeedJob iJob = new IndeedJob();
                //To get job title
                List<WebElement> jobTitle = driver.findElements(By.xpath("//span[contains(@id, 'jobTitle')]"));
                System.out.println("Job Title : " + jobTitle.get(i).getText());
                iJob.setJobTitle(jobTitle.get(i).getText().replace(",", " ").replace("\n", " "));
                //To get Company name
                List<WebElement> jobCompName = driver.findElements(By.xpath("//span[@data-testid='company-name']"));
                System.out.println("Job Company Name : " + jobCompName.get(i).getText());
                iJob.setJobCompName(jobCompName.get(i).getText().replace(",", " ").replace("\n", " "));
                //To get Company location
                List<WebElement> jobLocation = driver.findElements(By.xpath("//div[@data-testid='text-location']"));
                System.out.println("Job Location : " + jobLocation.get(i).getText());
                iJob.setJobLocation(jobLocation.get(i).getText().replace(",", " ").replace("\n", " "));
                //To get jobs descrition
                List<WebElement> jobDescriptions = driver.findElements(By.xpath("//ul[@style='list-style-type:circle;margin-top: 0px;margin-bottom: 0px;padding-left:20px;']"));
                System.out.println("Job Descriptions : " + jobDescriptions.get(i).getText());
                iJob.setJobDescriptions(jobDescriptions.get(i).getText().replace(",", " ").replace("\n", " "));

                try {
                    csvWriter.append(iJob.getJobTitle());
                    csvWriter.append(",");
                    csvWriter.append(iJob.getJobCompName());
                    csvWriter.append(",");
                    csvWriter.append(iJob.getJobLocation());
                    csvWriter.append(",");
                    csvWriter.append(iJob.getJobDescriptions());
                    csvWriter.append("\n");
                } catch (IOException e) {
                    closeNavigation();
                    throw new RuntimeException(e);
                }
            }
            j = j + 10;
        }

        log.info("---------------- End Scenario ----------------");
    }


    private static String jobSearch() {
        Scanner myObj = new Scanner(System.in);
        System.out.println("What jobs are you looking for ? ");
        return myObj.nextLine();
    }

    private static String jobLocation() {
        Scanner myObj = new Scanner(System.in);
        System.out.println("Where is your jobs ? ");
        return myObj.nextLine();
    }

    // Use to launch chrome navigator and make action
    public void initNavigation() {
        log.info("---------------- Start CHROME ----------------");

        WebDriverManager.getInstance(DriverManagerType.CHROME).setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        //options.addArguments("--headless=new");
        driver = new ChromeDriver(options);
        js = (JavascriptExecutor) driver;

        log.info("---------------- Start CHROME OK ----------------");

    }



}
