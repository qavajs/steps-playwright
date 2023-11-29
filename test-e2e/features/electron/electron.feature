Feature: electron

  Scenario: open electron app
    * I click 'Open New Window Electron Button'
    * I switch to 'qavajs electron app new window' window
    * I click 'Close Current Window Electron Button'

  Scenario: open electron and browser
    * I click 'Open New Window Electron Button'
    * I switch to 'qavajs electron app new window' window
    When I launch new driver as 'browser2':
    """
    {
      "capabilities": {
          "browserName": "chromium",
          "headless": false
      }
    }
    """
    And I switch to 'browser2' driver
    And I open '$valuesPage' url
    Then I expect current url to contain 'values.html'
    And I switch to 'default' driver
    * I click 'Close Current Window Electron Button'
