Feature: dynamic page objects

  Background:
    When I open '$actionsPage' url
    And I define '#button' as 'Custom Dynamic Button' element
    And I define 'button' as 'Custom Buttons' collection

  Scenario: click custom button
    When I click 'Custom Dynamic Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: click custom button from collection
    When I hover over '#Hover Me! in Custom Buttons'
    Then I expect text of 'Action' to be equal 'hover'
