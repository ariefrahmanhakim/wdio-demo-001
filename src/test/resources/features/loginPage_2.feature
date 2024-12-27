@root-tag-2
Feature: The Internet Guinea Pig Website

  @tag-3 @web
  Scenario: As a user, I can log into the secure area
    Given User go to demo_web apps
    When demoApp/loginPage User fill username with data tomsmith
    And demoApp/loginpage User fill password with data SuperSecretPassword!
    And demoApp/loginpage User click submit
    Then demoApp Verify contains text data You logged into a secure area! will be displayed
    And demoApp Verify contains text data Your username is invalid! will not displayed

  @tag-4 @web
  Scenario: As a user, I can't log into the secure area
    Given User go to demo_web apps
    When demoApp/loginPage User fill username with data foobar
    And demoApp/loginpage User fill password with data berfoo
    And demoApp/loginpage User click submit
    Then demoApp Verify contains text data You logged into a secure area! will not displayed
    And demoApp Verify contains text data Your username is invalid! will be displayed

  @tag-5 @web
  Scenario Outline: As a user, I can't log into the secure area
    Given User go to demo_web apps
    When demoApp/loginPage User fill username with staticData <username>
    And demoApp/loginpage User fill password with properties <password>
    And demoApp/loginpage User click submit
    Then demoApp Verify contains text translation <verifyText> will be displayed

    Examples:
      | username       | password       | verifyText               |
      | username       | password_login | toast_login_success_text |
      | username_wrong | password_login | toast_login_failed_text  |
