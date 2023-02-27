Feature: waits

  Background:
    When I open '$waitsPage' url

  Scenario Outline: wait for condition
    Then I wait until '<element>' <condition>

    Examples:
      | element         | condition         |
      | Present Element | to be present     |
      | Detach Element  | not to be present |
      | Visible Element | to be visible     |
      | Hidden Element  | to be invisible   |

  Scenario: wait for text
      Then I wait until text of 'Loading' to be equal '100%'

  Scenario: wait for property
    Then I wait until 'value' property of 'Loading Input' to be equal '100%'

  Scenario: wait for attribute
    Then I wait until 'style' attribute of 'Hidden Element' to contain 'hidden'

  Scenario Outline: wait for number of elements in collection
    Then I wait until number of elements in 'Wait Collection' collection <condition> '<expected>'

    Examples:
      | condition   | expected |
      | to be equal | 10       |
      | to be above | 8        |
      | to be below | 5        |

  Scenario: wait for current url
    Then I wait until current url to contain '#anchor'

  Scenario: wait for title
    Then I wait until page title to be equal 'title changed'

  Scenario Outline: wait for condition with timeout
    Then I wait until '<element>' <condition> (timeout: 3000)

    Examples:
      | element         | condition         |
      | Present Element | to be present     |
      | Detach Element  | not to be present |
      | Visible Element | to be visible     |
      | Hidden Element  | to be invisible   |

  Scenario: wait for text with timeout
    Then I wait until text of 'Loading' to be equal '100%' (timeout: 3000)

  Scenario: wait for property with timeout
    Then I wait until 'value' property of 'Loading Input' to be equal '100%' (timeout: 3000)

  Scenario: wait for attribute with timeout
    Then I wait until 'style' attribute of 'Hidden Element' to contain 'hidden' (timeout: 3000)

  Scenario Outline: wait for number of elements in collection with timeout
    Then I wait until number of elements in 'Wait Collection' collection <condition> '<expected>' (timeout: 3000)

    Examples:
      | condition   | expected |
      | to be equal | 10       |
      | to be above | 8        |
      | to be below | 5        |

  Scenario: wait for current url with timeout
    Then I wait until current url to contain '#anchor' (timeout: 3000)

  Scenario: wait for title with timeout
    Then I wait until page title to be equal 'title changed' (timeout: 3000)

