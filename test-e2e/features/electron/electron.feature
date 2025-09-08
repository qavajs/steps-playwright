Feature: electron

  Scenario: open electron app
    * I click 'Open New Window Electron Button'
    * I switch to 'qavajs electron app new window' window
    * I click 'Close Current Window Electron Button'

  Scenario: evaluate script on main process
    * I execute '$js(async ({ app }) => app.showAboutPanel())' script on electron app

  Scenario: evaluate script on main process and save result to memory
    * I execute '$js(async ({ app }) => app.getAppPath())' script on electron app and save result as 'appPath'
    * I expect '$appPath' memory value to contain 'test-e2e/apps/electron'