Feature: mock

  Background:
    Given I restore all mocks

  Scenario: mock response multiline
    When I create mock for '**/users' as 'usersService'
    And I set '$usersService' mock to respond '200' with:
    """
    [
     {"name": "Mock 1"},
     {"name": "Mock 2"},
     {"name": "{$userFromMemory}"}
    ]
    """
    And I open '$mockPage' url
    Then I expect text of 'User (1)' to be equal 'Mock 1'
    And I expect text of 'User (2)' to be equal 'Mock 2'
    And I expect text of 'User (3)' to be equal 'Mock 3'

  Scenario: mock response from memory
    When I create mock for '**/users' as 'usersService'
    And I set '$usersService' mock to respond '200' with '$users'
    And I open '$mockPage' url
    Then I expect text of 'User (1)' to be equal 'Memory Mock 1'
    And I expect text of 'User (2)' to be equal 'Memory Mock 2'
    And I expect text of 'User (3)' to be equal 'Memory Mock 3'

  Scenario: mock abort
    When I create mock for '**/users' as 'usersService'
    And I set '$usersService' mock to abort with 'failed' reason
    And I open '$mockPage' url
    Then I expect text of 'User (1)' to be equal 'Failed to load!'
