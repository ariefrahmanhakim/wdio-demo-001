@root-tag-1-api
Feature: The Reqres api

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
  Scenario Outline: WDIO-3>>As a user, I can GET list user
    Given User get data json template getListUser
    And User update value of header :
      | Accept | */* |
    And User update value of param :
      | page | <pages> |
    When User send GETPARAM request
    Then User verify response 200 code

    Examples:
      | pages |
      |     1 |
      |     2 |
      |     3 |

  @WDIO-4 @api
  Scenario: WDIO-4>>As a user, I can GET list user
    Given User get data json template getSingleUser
    And User update value of endpoint using last 2
    And User update value of header :
      | Accept | */* |
    When User send GET request
    Then User verify response 200 code

  @WDIO-5 @api
  Scenario: WDIO-5>>As a user, I can GET list user
    Given User get data json template getSingleUser
    And User update value of endpoint using last {staticData-reqres.user_id}
    And User update value of header :
      | Accept | */* |
    When User send GET request
    Then User verify response 200 code

  @WDIO-6 @api
  Scenario: WDIO-6>>As a user, I can GET list user
    Given User get data json template getSingleUser
    And User update value of endpoint using full /api/users/23
    And User update value of header :
      | Accept | */* |
    When User send GET request
    Then User verify response 404 code

  @WDIO-7 @api
  Scenario: WDIO-7>>As a user, I can GET list user
    Given User get data json template getSingleUserGeneralEndpoint
    And User update value of endpoint using between {translation-reqres.users_text}/2
    And User update value of header :
      | Accept | */* |
    When User send GET request
    Then User verify response 200 code

  @WDIO-8 @api
  Scenario: WDIO-8>>As a user, I can POST create user
    Given User get data json template postCreateUser
    When User send POST request
    Then User verify response 201 code

  @WDIO-9 @api
  Scenario: WDIO-9>>As a user, I can POST create user
    Given User get data json template postCreateUser
    And User update value of body :
      | name | tester-1 |
    When User send POST request
    Then User verify response 201 code
