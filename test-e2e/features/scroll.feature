Feature: scroll

  Background:
    When I open '$scrollPage' url

  Scenario: scroll to element wait to be in viewport
    When I scroll to 'Scroll Element'
    Then I wait until 'Scroll Element' to be in viewport

  Scenario: scroll to element wait
    Then I expect 'Scroll Element' not to be in viewport
