Feature: multiBrowser

  Background:
    When I open '$actionsPage' url

  Scenario: new context
    Then I expect current url to contain 'actions.html'
    When I open new browser context as 'browser2'
    And I switch to 'browser2' browser context
    And I open '$valuesPage' url
    And I switch to 'default' browser context
    Then I expect current url to contain 'actions.html'
    When I switch to 'browser2' browser context
    Then I expect current url to contain 'values.html'
    When I close 'browser2' browser context
    Then I expect current url to contain 'actions.html'

  Scenario: new browser
    Then I expect current url to contain 'actions.html'
    When I launch new driver as 'browser2'
    And I switch to 'browser2' driver
    And I open '$valuesPage' url
    And I switch to 'default' driver
    Then I expect current url to contain 'actions.html'
    When I switch to 'browser2' driver
    Then I expect current url to contain 'values.html'
    When I close 'browser2' driver
    Then I expect current url to contain 'actions.html'

  Scenario: new browser with provided config
    Then I expect current url to contain 'actions.html'
    When I launch new driver as 'browser2':
    """
    {
      "capabilities": {
          "browserName": "firefox"
      }
    }
    """
    And I switch to 'browser2' driver
    And I open '$valuesPage' url
    And I switch to 'default' driver
    Then I expect current url to contain 'actions.html'
    When I switch to 'browser2' driver
    Then I expect current url to contain 'values.html'
    When I close 'browser2' driver
    Then I expect current url to contain 'actions.html'
