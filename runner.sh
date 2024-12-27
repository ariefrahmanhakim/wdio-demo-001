#!/bin/bash

# Input browser with chrome | firefox | safari | edge #
browser=chrome

# Input tags with tag on feature file #
## Use * for AND, , for OR, # for NOT
tags=@root-tag-1,@root-tag-2

# Input environment with local | staging | production #
environment=local

# Input environment with en | id | ru #
translation=en

# Input headless with true or false #
headless=true

# Input log level with trace | debug | info | warn | error | silent #
## trace or debug for Development or Testing
## info for Normal Usage
## warn or error for Production/CI/CD Runs
logLevel=silent

# Input generate Allure Report with True or False
generateAllureReport=true

# Input automatically open Allure Report with True or False
autoOpenReport=false

# Input multiple instance with True or False
multipleInstance=true



#############################################################################
####################### Please Don't Change #################################
#############################################################################

## Transform the tags for WebDriverIO to match the required format
tagsRun=$(echo "$tags" | sed 's/\*/ and /g' | sed 's/,/ or /g' | sed 's/#/ not /g')

## Set Environment Properties
export ENV=$environment

## Set Translation
export TRANS=$translation

## Set Instance Single or Multiple
if [ "$multipleInstance" == "true" ]; then
  export MAX_INSTANCES=10
else
  export MAX_INSTANCES=1
fi

# Remove allure results
if [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux-gnu"* ]]; then
    rm -rf ./allure-results/*
    rm -rf ./allure-report/*
else
    # For Windows
    if command -v del &> /dev/null; then
        del /s /q .\\allure-results\\*
        del /s /q .\\allure-report\\*
    fi
fi

# Execute the WebDriverIO test runner with the tag expression
GENERATE_ALLURE_REPORT=$generateAllureReport BROWSER=$browser HEADLESS=$headless LOG="$logLevel" npx wdio run ./wdio.conf.ts --cucumberOpts.tagExpression="$tagsRun"

# Generate the Allure report
if [ "$generateAllureReport" == "true" ]; then
    echo "Generating Allure report..."
    # Generate the Allure report
    allure generate --single-file ./allure-results --clean -o ./allure-report

    # Prepare the file:// URL to the Allure report
    if [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux-gnu"* ]]; then
        # Unix-like systems
        report_url="file://$(pwd)/allure-report/index.html"
    else
        # Windows
        report_url="file://$(pwd -W)/allure-report/index.html"
    fi

    echo "Report URL: $report_url"

if [ "$autoOpenReport" == "true" ]; then
        # Open the Allure report file in the default browser
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$report_url"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$report_url"
        elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            start "$report_url"
        else
            echo "Unknown OS, please manually open the report at $report_url"
        fi
    fi 
fi
