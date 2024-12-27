@root-tag-1
Feature: The Internet Guinea Pig Website

  @tag-1 @web @english
  Scenario: As a user, I can log into the secure area
    Given User go to demo_web apps
    When demoApp/loginPage User fill username with staticData username
    And demoApp/loginpage User fill password with properties password_login
    And demoApp/loginpage User click submit
    Then demoApp Verify contains text translation toast_login_success_text will be displayed
    And demoApp Verify contains text translation toast_login_failed_text will not displayed

  # @tag-1-1 @web @indonesia
  # Scenario: As a user, I can log into the secure area
  #   Given User go to demo_web apps
  #   When demoApp/loginPage User fill username with staticData username
  #   And demoApp/loginpage User fill password with properties password_login
  #   And demoApp/loginpage User click submit
  #   Then demoApp Verify contains text translation toast_login_success_text will not displayed

  @tag-2 @web @english
  Scenario: As a user, I can't log into the secure area
    Given User go to demo_web apps
    When demoApp/loginPage User fill username with data foobar
    And demoApp/loginpage User fill password with data berfoo
    And demoApp/loginpage User click submit
    Then demoApp Verify contains text data You logged into a secure area! will not displayed
    And demoApp Verify contains text data Your username is invalid! will be displayed

  # @tag-2-1 @web @indonesia
  # Scenario: As a user, I can't log into the secure area
  #   Given User go to demo_web apps
  #   When demoApp/loginPage User fill username with data foobar
  #   And demoApp/loginpage User fill password with data berfoo
  #   And demoApp/loginpage User click submit
  #   Then demoApp Verify contains text translation toast_login_failed_text will not displayed