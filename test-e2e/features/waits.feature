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

  Scenario Outline: wait for text (<condition>)
    Then I wait until text of 'Loading' <condition> '<expectation>'

    Examples:
     | condition      | expectation |
     | to equal       | 100%        |
     | to contain     | 10          |
     | to match       | ^.00%$      |
     | not to equal   | 10%         |
     | not to contain | 10          |
     | not to match   | ^.0%$       |

  Scenario Outline: wait for property (<condition>)
    Then I wait until 'value' property of 'Loading Input' <condition> '<expectation>'

    Examples:
      | condition      | expectation |
      | to equal       | 100%        |
      | to contain     | 10          |
      | to match       | ^.00%$      |
      | not to equal   | 10%         |
      | not to contain | 10          |
      | not to match   | ^.0%$       |

  Scenario Outline: wait for attribute (<condition>)
    Then I wait until 'style' attribute of 'Hidden Element' <condition> '<expectation>'

    Examples:
      | condition      | expectation            |
      | to equal       | visibility: hidden;    |
      | to contain     | hidden                 |
      | to match       | hidden;$               |
      | not to equal   | visibility: displayed; |
      | not to contain | displayed              |
      | not to match   | displayed;$            |

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

