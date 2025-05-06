Feature: waits

  Background:
    When I open '$waitsPage' url

  Scenario Outline: wait for condition
    Then I expect '<element>' <condition>

    Examples:
      | element              | condition         |
      | Present Element      | to be present     |
      | Detach Element       | not to be present |
      | Not Existing Element | not to be present |
      | Visible Element      | to be visible     |
      | Visible Element      | to be clickable   |

  Scenario Outline: wait for text (<condition>)
    Then I expect text of 'Loading' <condition> '<expectation>'

    Examples:
      | condition      | expectation |
      | to equal       | 100%        |
      | to contain     | 10          |
      | to match       | ^.00%$      |
      | not to equal   | 10%         |
      | not to contain | 10          |
      | not to match   | ^.0%$       |

  Scenario: wait for value
    Then I expect value of 'Loading Input' to equal '100%'

  Scenario Outline: wait for property (<condition>)
    Then I expect 'value' property of 'Loading Input' <condition> '<expectation>'

    Examples:
      | condition      | expectation |
      | to equal       | 100%        |
      | to contain     | 10          |
      | to match       | ^.00%$      |
      | not to equal   | 10%         |
      | not to contain | 10          |
      | not to match   | ^.0%$       |

  Scenario Outline: wait for attribute (<condition>)
    Then I expect 'style' attribute of 'Hidden Element' <condition> '<expectation>'

    Examples:
      | condition      | expectation            |
      | to equal       | visibility: hidden;    |
      | to contain     | hidden                 |
      | to match       | hidden;$               |
      | not to equal   | visibility: displayed; |
      | not to contain | displayed              |
      | not to match   | displayed;$            |

  Scenario: wait for css property
    Then I expect 'visibility' css property of 'Hidden Element' to be equal 'hidden'

  Scenario Outline: wait for number of elements in collection (<condition>)
    Then I expect number of elements in 'Wait Collection' collection <condition> '<expected>'

    Examples:
      | condition   | expected |
      | to be equal | 10       |
      | to be above | 8        |
      | to be below | 5        |

  Scenario: wait for current url
    Then I expect current url to contain '#anchor'

  Scenario: wait for title
    Then I expect page title to be equal 'title changed'


  Scenario: refresh page until element text
    Then I refresh page until text of 'Pseudo Random Text' to equal 'You are lucky' (timeout: 9000)

  Scenario: refresh page until element state
    Then I refresh page until 'Randomly Disabled Button' to be enabled (timeout: 9000)

  Scenario: click until text
    Then I click 'Flip Coin' until text of 'Coin' to equal 'Heads' (timeout: 9000)

  Scenario: click until value
    Then I click 'Plus Button' until value of 'Digit Input' to equal '4'

  Scenario: wait for network idle
    When I set 2000 ms delayed mock for '**/comments' request
    And I click 'Fetch Button'
    And I wait for network idle (timeout: 2200)
    Then I expect text of 'Fetch Result' to equal 'data received'
