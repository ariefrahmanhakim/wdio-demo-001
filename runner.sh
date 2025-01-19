#!/bin/bash

# Input browser with chrome | firefox | safari | MicrosoftEdge #
browser=chrome

# Input tags with tag on feature file #
tags=@root-tag-1-api

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
multipleInstance=false

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
if [ "$multipleInstance" = "true" ]; then
  export MAX_INSTANCES=10
else
  export MAX_INSTANCES=1
fi

# Detect OS
os_type=$(uname -s)

case "$os_type" in
"Darwin")
  OS_TYPE="macOS"
  ;;
"Linux")
  OS_TYPE="Linux"
  ;;
*MINGW* | "CYGWIN" | "MINGW" | "MSYS")
  OS_TYPE="Windows"
  ;;
"WSL")
  OS_TYPE="Windows (WSL)"
  ;;
*)
  OS_TYPE="Unknown"
  ;;
esac

echo "Your Operating System: $(uname -s) -> $OS_TYPE"

# Remove allure results
case "$OS_TYPE" in
"Linux" | "macOS")
  rm -rf ./allure-results/* ./allure-report/*
  ;;
"Windows" | "Windows (WSL)")
  powershell.exe -Command "Remove-Item -Recurse -Force .\\allure-results\\*"
  powershell.exe -Command "Remove-Item -Recurse -Force .\\allure-report\\*"
  ;;
*)
  echo "Unknown OS, cannot continue."
  exit 1
  ;;
esac

# Execute the WebDriverIO test runner with the tag expression
GENERATE_ALLURE_REPORT=$generateAllureReport BROWSER=$browser HEADLESS=$headless LOG="$logLevel" npx wdio run ./wdio.conf.ts --cucumberOpts.tagExpression="$tagsRun"

# Generate the Allure report
if [ "$generateAllureReport" = "true" ]; then
  echo "Generating Allure report..."
  allure generate --single-file ./allure-results --clean -o ./allure-report

  # Build dynamic file URL for Allure report
  case "$OS_TYPE" in
  "Linux" | "macOS")
    report_url="file://$(pwd)/allure-report/index.html"
    ;;
  "Windows (WSL)")
    report_url="file://$(wslpath -w $(pwd))/allure-report/index.html"
    ;;
  "Windows")
    if [[ "$SHELL" == *"bash"* ]]; then
      report_url="file:///$(pwd | sed 's|^/c/|C:/|g' | sed 's|/|\\|g')\\allure-report\\index.html"
    else
      report_url="file:///$(echo $(pwd) | sed 's|/|\\|g' | sed 's|^C:|C:|')\\allure-report\\index.html"
    fi
    ;;
  *)
    echo "Unknown OS, cannot determine report URL"
    exit 1
    ;;
  esac

  echo "Report URL: $report_url"

  # Automatically open the report if enabled
  if [ "$autoOpenReport" = "true" ]; then
    case "$OS_TYPE" in
    "Linux")
      xdg-open "$report_url"
      ;;
    "macOS")
      open "$report_url"
      ;;
    "Windows (WSL)")
      explorer.exe "$(wslpath -w $(pwd))\\allure-report\\index.html"
      ;;
    "Windows")
      start "$report_url"
      ;;
    *)
      echo "Cannot open the report automatically. Please open it manually at $report_url"
      ;;
    esac
  fi
fi
