@root-tag-1-api
Feature: The Internet Guinea Pig Website

  @WDIO-1 @api
  Scenario: WDIO-1>>As a user, I can GET list user
    Given User get data json template getListUser
    When User send GET request
    Then User verify response 200 code

  @WDIO-2 @api
  Scenario: WDIO-2>>As a user, I can GET list user
    Given User get data json template getListUser
    When User send GET request
    Then User verify response 400 code  

  @WDIO-3 @api
  Scenario: WDIO-1>>As a user, I can GET list user
    Given User get data json template getListUser
    When User send GET request
    Then User verify response 200 code  