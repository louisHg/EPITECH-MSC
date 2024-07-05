package com.selenium.demo;

import io.github.bonigarcia.wdm.config.DriverManagerType;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.io.File;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

import static io.github.bonigarcia.wdm.config.DriverManagerType.FIREFOX;

@Service
public class SeleniumTest {

    private static final Logger log = LoggerFactory.getLogger(SeleniumTest.class);

    WebDriver driver;
    JavascriptExecutor js;

    @Value("${user.login}")
    private String user;
    @Value("${user.password}")
    private String password;


    // @Scheduled(cron = "*/15 * * * * *")
    public void run() throws InterruptedException {
        log.info("################# Start Selenium Test ####################");

        initNavigation();
        runScenario();
        waitForWindow(5);
        takeScreenShot();
        closeNavigation();
        log.info("################# End Selenium Test ####################");
    }

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





    public void runScenario() {
        log.info("---------------- Start Scenario ----------------");

        driver.get("https://cra.astrea-management.com/connexion");

        driver.manage().window().setSize(new Dimension(1450, 830));

        driver.findElement(By.name("utilisateur")).sendKeys(user);

        driver.findElement(By.name("motdepasse")).sendKeys(password);

        driver.findElement(By.cssSelector(".btn.green.pull-right")).click();

        waitForWindow(1);

        driver.findElement(By.id("afficherRapportActiviteModifiable")).click();

        waitForWindow(1);

        driver.findElement(By.xpath("//i[contains(text(), 'Novembre')]")).click();

        waitForWindow(3);
        js.executeScript("window.scrollTo(0, document.body.scrollHeight)");

        try {
            driver.findElement(By.cssSelector(".fa-trash-o")).click();
            log.info("------------ clear button Ok ------------- ");
            waitForWindow(2);
            driver.findElement(By.xpath("//a[@data-apply='confirmation']")).click();
            log.info("------------ clear button confirmation Ok ------------- ");

        } catch (NoSuchElementException e) {
            log.info("------------ No clear button ------------- ");
        }
        waitForWindow(1);

        Set<LocalDate> joursAgence = joursAgence();
        Set<LocalDate> joursEcole = joursEcole();

        driver.findElement(By.xpath("//span[contains(text(), 'CS DIGITAL - PROJETS INTERNES')]")).click();
        log.info("---------------- joursAgence ----------------");
        js.executeScript("window.scrollBy(0, -100)");

        waitForWindow(2);

        for (LocalDate day : joursAgence) {
            System.out.println(day);
            int dayOfMonth = day.getDayOfMonth();
            WebElement tdElement = driver.findElement(By.xpath("//td[@data-date='" + day + "' and contains(text(), '" + dayOfMonth + "')]"));
            try {
                tdElement.click();
            } catch (NoSuchElementException e) {
                log.info("----- Error -----");
            } catch (ElementNotInteractableException e) {
                log.info("----- Error2 -----");
            }
            waitForWindow(0.5F);

        }

        //driver.findElement(By.xpath("//span[contains(text(), 'Alternance')]")).click();
        driver.findElement(By.xpath("//button[@data-name-type='ALTERNANCE']")).click();
        waitForWindow(2);

        log.info("---------------- joursTT ----------------");

        for (LocalDate dayEcole : joursEcole) {
            System.out.println(dayEcole);
            int dayOfMonthTT = dayEcole.getDayOfMonth();
            WebElement tdElementTT = driver.findElement(By.xpath("//td[@data-date='" + dayEcole + "' and contains(text(), '" + dayOfMonthTT + "')]"));
            try {
                tdElementTT.click();
            } catch (NoSuchElementException e) {
                log.info("----- Error -----");
            } catch (ElementNotInteractableException e) {
                log.info("----- Error2 -----");
            }
            waitForWindow(0.5F);
        }
        driver.findElement(By.id("enregistrer")).click();

        log.info("---------------- End Scenario ----------------");

    }


    public Set<LocalDate> joursAgence() {
        // Obtenir la date actuelle
        LocalDate currentDate = LocalDate.now();

        // Utiliser un TreeSet pour garantir l'ordre naturel et éliminer les doublons
        Set<LocalDate> joursDuMois = new TreeSet<>();

        // Trouver le premier lundi, mardi et jeudi du mois
        LocalDate firstMonday = currentDate.with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY));
        LocalDate firstTuesday = currentDate.with(TemporalAdjusters.firstInMonth(DayOfWeek.TUESDAY));
        LocalDate firstThursday = currentDate.with(TemporalAdjusters.firstInMonth(DayOfWeek.WEDNESDAY));

        // Ajouter le premier lundi, mardi et jeudi à la liste
        joursDuMois.add(firstMonday);
        joursDuMois.add(firstTuesday);
        joursDuMois.add(firstThursday);

        // Obtenir les prochains lundis, mardis et jeudis en ajoutant 7 jours à chaque fois
        LocalDate nextMonday = firstMonday;
        LocalDate nextTuesday = firstTuesday;
        LocalDate nextThursday = firstThursday;

        while (nextMonday.getMonth() == currentDate.getMonth() || nextTuesday.getMonth() == currentDate.getMonth() || nextThursday.getMonth() == currentDate.getMonth()) {
            if (nextMonday.getMonth() == currentDate.getMonth()) {
                joursDuMois.add(nextMonday);
                nextMonday = nextMonday.plusWeeks(1);
            }

            if (nextTuesday.getMonth() == currentDate.getMonth()) {
                joursDuMois.add(nextTuesday);
                nextTuesday = nextTuesday.plusWeeks(1);
            }

            if (nextThursday.getMonth() == currentDate.getMonth()) {
                joursDuMois.add(nextThursday);
                nextThursday = nextThursday.plusWeeks(1);
            }
        }

        return joursDuMois;
    }


    public Set<LocalDate> joursEcole() {
        LocalDate currentDate = LocalDate.now();

        // Utiliser un TreeSet pour garantir l'ordre naturel et éliminer les doublons
        Set<LocalDate> mercredisVendredisDuMois = new TreeSet<>();

        // Trouver le premier jeudi et vendredi du mois
        LocalDate firstWednesday = currentDate.with(TemporalAdjusters.firstInMonth(DayOfWeek.THURSDAY));
        LocalDate firstFriday = currentDate.with(TemporalAdjusters.firstInMonth(DayOfWeek.FRIDAY));

        // Ajouter le premier mercredi et vendredi à la liste
        mercredisVendredisDuMois.add(firstWednesday);
        mercredisVendredisDuMois.add(firstFriday);

        // Obtenir les prochains mercredis et vendredis en ajoutant 7 jours à chaque fois
        LocalDate nextWednesday = firstWednesday;
        LocalDate nextFriday = firstFriday;

        while (nextWednesday.getMonth() == currentDate.getMonth() || nextFriday.getMonth() == currentDate.getMonth()) {
            if (nextWednesday.getMonth() == currentDate.getMonth()) {
                mercredisVendredisDuMois.add(nextWednesday);
                nextWednesday = nextWednesday.plusWeeks(1);
            }

            if (nextFriday.getMonth() == currentDate.getMonth()) {
                mercredisVendredisDuMois.add(nextFriday);
                nextFriday = nextFriday.plusWeeks(1);
            }
        }

        return mercredisVendredisDuMois;
    }


    public void takeScreenShot() {
        File screenshotFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        String screenshotPath = "C:/screenShot/screen-" + DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss_nnnnnn").format(LocalDateTime.now()) + ".png";
        try {
            FileUtils.copyFile(screenshotFile, new File(screenshotPath));
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.info("------------- screenshot :" + screenshotPath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




}
