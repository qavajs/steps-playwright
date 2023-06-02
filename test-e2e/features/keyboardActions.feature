Feature: keyboard actions

  Background:
    When I open '$actionsPage' url
    And I click 'Keyboard Event Handler'

  Scenario: key press and release
    When I hold down 'Q' key
    Then I expect 'value' property of 'Keyboard Event Handler' to contain '"code":"KeyQ"'
    Then I expect 'value' property of 'Keyboard Event Handler' to contain '"type":"keydown"'
    When I release 'Q' key
    Then I expect 'value' property of 'Keyboard Event Handler' to contain '"code":"KeyQ"'
    Then I expect 'value' property of 'Keyboard Event Handler' to contain '"type":"keyup"'
