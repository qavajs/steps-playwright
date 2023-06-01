Feature: mouse actions

  Background:
    When I open '$actionsPage' url
    And I hover over 'Event Handler'

  Scenario Outline: mouse press and release
    Then I press <button> mouse button
    And I expect text of 'Event Handler' to contain '"buttons":<buttonCode>'
    And I expect text of 'Event Handler' to contain '"type":"mousedown"'
    Then I release <button> mouse button
    And I expect text of 'Event Handler' to contain '"buttons":0'
    And I expect text of 'Event Handler' to contain '"type":"mouseup"'

    Examples:
      | button | buttonCode |
      | left   | 1          |
      | right  | 2          |
      | middle | 4          |

  Scenario: mouse move
    Then I move mouse to '10, 10'
    And I expect text of 'Event Handler' to contain '"type":"mousemove"'

  Scenario Outline: mouse wheel
    Then I scroll mouse wheel by '<offset>'
    And I expect text of 'Event Handler' to contain '"type":"wheel"'
    And I expect text of 'Event Handler' to match '<deltaY>'

    Examples:
      | offset  | deltaY            |
      | 0, 100  | .+"deltaY":\d+.+  |
      | 0, -100 | .+"deltaY":-\d+.+ |

