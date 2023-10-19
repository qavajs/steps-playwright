Feature: electron

  @debug
  Scenario: open electron app
    * I click 'Open New Window Electron Button'
    * I switch to 'qavajs electron app new window' window
    * I click 'Close Current Window Electron Button'
