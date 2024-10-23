Feature: dynamic page objects

  Background:
    When I open '$actionsPage' url
    And I define '#button' as 'Custom Dynamic Button' locator

  Scenario: click custom button
    When I click 'Custom Dynamic Button'
    Then I expect text of 'Action' to be equal 'click'