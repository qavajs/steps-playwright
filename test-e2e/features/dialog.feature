Feature: dialog

  Background:
    When I open '$actionsPage' url
    And I will wait for dialog

  Scenario: accept alert
    When I click 'Alert Button'
    And I accept dialog
    Then I expect text of 'Action' to be equal 'true'

  Scenario: dismiss alert
    When I click 'Alert Button'
    And I dismiss alert
    Then I expect text of 'Action' to be equal 'false'

  Scenario: type text to alert
    When I expect text of 'Action' to be equal 'Nothing'
    And I click 'Prompt Button'
    And I type 'I am not a robot' to alert
    Then I expect text of 'Action' to be equal 'I am not a robot'

  Scenario: expect text of alert
    When I click 'Alert Button'
    Then I expect text of alert to be equal 'Are you robot?'