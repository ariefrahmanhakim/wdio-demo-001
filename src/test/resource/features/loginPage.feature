@tag1
Feature: The Internet Guinea Pig Website

  @tag2
  Scenario Outline: As a user, I can log into the secure area
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying <message>
    Examples:
      | username | password             | message                        |
      | tomsmith | SuperSecretPassword! | You logged into a secure area! |
      | foobar   | barfoo               | Your username is invalid!      |

  @tag3
  Scenario: As a user, I can log into the secure area
    Given I am on the login page
    When I login with tomsmith and SuperSecretPassword!
    Then I should see a flash message saying You logged into a secure area!

  @tag4
  Scenario: As a user, I can log into the secure area
    Given I am on the login page
    When I login with foobar and barfoo
    Then I should see a flash message saying Your username is invalid!    

  @tag5
  Scenario: As a user, I can log into the secure area
    Given I am on the login page
    When I login with tomsmith and SuperSecretPassword!
    Then I should see a flash message saying You logged into a secure area!  