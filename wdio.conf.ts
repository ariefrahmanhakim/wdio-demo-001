import allureReporter from '@wdio/allure-reporter';
import * as os from "os";
import fs from 'fs';
import path from 'path';

const headless = process.env.HEADLESS === 'true'; // Read headless mode from environment variable
const selectedBrowser = process.env.BROWSER || 'chrome'; // Default to 'chrome' if BROWSER is not set
const logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' = process.env.LOG as 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' || 'silent'; // Get from environment or default to 'silent'
const generateAllureReport = process.env.GENERATE_ALLURE_REPORT === 'true'; // Flag to control whether Allure report should be generated or not
const resultsFilePath = path.resolve(__dirname, 'allure-results/scenario-results.json');

let globalResults = { total: 0, passed: 0, failed: 0 };
let startTime = Date.now();

export const config: WebdriverIO.Config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './src/test/resource/**/*.feature'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],

    // ============
    // Capabilities
    // ============
    maxInstances: parseInt(process.env.MAX_INSTANCES || '10', 10),
    capabilities: [
        {
            browserName: 'chrome',
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                args: headless
                    ? ['--headless', '--disable-gpu', '--start-maximized']
                    : ['--disable-gpu', '--start-maximized'],
            },
        },
        {
            browserName: 'firefox',
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
                args: headless
                    ? ['-headless', '--width=1920', '--height=1080']
                    : ['--width=1920', '--height=1080']
            },
        },
        {
            browserName: 'safari',
            acceptInsecureCerts: true,
        },
        {
            browserName: 'MicrosoftEdge',
            acceptInsecureCerts: true,
            'ms:edgeOptions': {
                args: headless
                    ? ['--headless', '--disable-gpu', '--start-maximized']
                    : ['--disable-gpu', '--start-maximized'],
            },
        },
    ]
        .filter(
            (capability) =>
                capability.browserName === selectedBrowser // Match the selected browser
                && (!headless || capability.browserName !== 'safari') // Exclude Safari for headless mode
        ),

    // ===================
    // Test Configurations
    // ===================
    logLevel: logLevel,
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'cucumber',
    reporters: generateAllureReport
        ? [
            [
                'allure',
                {
                    outputDir: './allure-results',
                    disableWebdriverStepsReporting: true,
                    disableWebdriverScreenshotsReporting: false,
                    useCucumberStepReporter: true,
                    reportedEnvironmentVars: {
                        os_platform: os.platform(),
                        os_release: os.release(),
                        os_version: os.version(),
                        node_version: process.version,
                    },
                },
            ],
        ]
        : [], // Ensure an empty array if no Allure is used


    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        // <string[]> (file/dir) require files before executing features
        require: ['./src/test/script/**/*.ts'],
        // <boolean> show full backtrace for errors
        backtrace: false,
        // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        requireModule: [],
        // <boolean> invoke formatters without executing steps
        dryRun: false,
        // <boolean> abort the run on first failure
        failFast: false,
        // <string[]> Only execute the scenarios with name matching the expression (repeatable).
        name: [],
        // <boolean> hide step definition snippets for pending steps
        snippets: true,
        // <boolean> hide source uris
        source: true,
        // <boolean> fail if there are any undefined or pending steps
        strict: false,
        // <string> (expression) only execute the features or scenarios with tags matching the expression
        tagExpression: process.env.tags || '',
        // <number> timeout for step definitions
        timeout: 60000,
        // <boolean> Enable this config to treat undefined definitions as warnings.
        ignoreUndefinedDefinitions: false,

        format: ['pretty'],

        tagsInTitle: true
    },

    // =====
    // Hooks
    // =====
    before: () => {
        if (fs.existsSync(resultsFilePath)) {
            fs.unlinkSync(resultsFilePath);
        }
        globalResults = { total: 0, passed: 0, failed: 0 };
        fs.writeFileSync(resultsFilePath, JSON.stringify(globalResults));
    },

    afterStep: async function (step, scenario, result) {
        if (!result.passed) {
            await browser.takeScreenshot();
        }
    },

    afterScenario: function (world: any, result: any) {
        const scenarioName = world.pickle.name;
        const status = result.passed ? 'PASSED' : 'FAILED';
        console.log(`Scenario "${scenarioName}" ${status}`);

        // To handle scenario outline on Allure Report
        allureReporter.addArgument('timestamp', Date.now().toString());

        // Counting result processes
        let currentResults = JSON.parse(fs.readFileSync(resultsFilePath, 'utf-8'));
        currentResults.total += 1;
        if (result.passed) {
            currentResults.passed += 1;
        } else {
            currentResults.failed += 1;
        }

        // Write updated results to the file
        fs.writeFileSync(resultsFilePath, JSON.stringify(currentResults));
    },

    onComplete: (exitCode: number, config: any, capabilities: any, results: any): void => {
        // Read the final accumulated results
        let finalResults = JSON.parse(fs.readFileSync(resultsFilePath, 'utf-8'));

        // Calculate the total duration of the tests
        const totalDuration = (Date.now() - startTime) / 1000; // In seconds

        // Calculate the percentage of passed tests
        const percentPassed = finalResults.total === 0
            ? 0
            : (finalResults.passed / finalResults.total) * 100;

        // Log the final results
        console.log(`
    ==================== Final Results ====================
    ✅ Passed Scenarios  : ${finalResults.passed}
    ❌ Failed Scenarios  : ${finalResults.failed}
    🔢 Total Scenarios   : ${finalResults.total}
    📊 Success Rate      : ${percentPassed.toFixed(0)}%
    ⏱️ Duration          : ${totalDuration.toFixed(2)} seconds
    ========================================================
        `);
    }

}
