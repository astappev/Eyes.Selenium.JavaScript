import test from 'ava';
import webdriver from 'selenium-webdriver';
import {Eyes, ConsoleLogHandler, TestResultsFormatter} from '../index';

let driver = null, eyes = null, resultsFormatter = null;

test.before(() => {
    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .build();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    resultsFormatter = new TestResultsFormatter();
});

test('JS Selenium SDK Test - github - 106', t => {
    return eyes.open(driver, "JavaScript SDK", t.title, {width: 800, height: 560}).then(function (driver) {
        driver.get('https://github.com');

        eyes.checkWindow("github");
        eyes.checkRegionByElement(driver.findElement(webdriver.By.className('btn-primary')), 'signup section');

        return eyes.close();
    }).catch(function (err) {
        t.fail(err.message);
        return err.results;
    }).then(function (results) {
        resultsFormatter.addResults(results);
        console.log(resultsFormatter.asHierarchicTAׁPString());
    });
});

test.after.always(() => {
    return driver.quit().then(function () {
        return eyes.abortIfNotClosed();
    });
});