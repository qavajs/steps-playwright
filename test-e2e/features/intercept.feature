Feature: intercept

  Scenario Outline: wait for intercepted response (<handler>)
    When I create interception for '<handler>' as 'usersInterception'
    And I open '$mockPage' url
    And I wait for '$usersInterception' response

    Examples:
      | handler                    |
      | **/users                   |
      | $userInterceptionPredicate |

  Scenario Outline: save intercepted response (<handler>)
    When I create interception for '<handler>' as 'usersInterception'
    And I open '$mockPage' url
    And I save '$usersInterception' response as 'response'
    And I expect '$response.status()' memory value to be equal '$js(200)'

    Examples:
      | handler                    |
      | **/users                   |
      | $userInterceptionPredicate |
