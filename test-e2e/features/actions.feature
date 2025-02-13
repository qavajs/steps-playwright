Feature: actions

  Background:
    When I open '$actionsPage' url

  Scenario: click
    When I click 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: force click
    When I force click 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: right click
    When I right click 'Button'
    Then I expect text of 'Action' to be equal 'rightclick'

  Scenario: double click
    When I double click 'Button'
    Then I expect text of 'Action' to be equal 'dblclick'

  Scenario: click on coordinates
    When I execute 'document.querySelector(".button4").getBoundingClientRect().x' function and save result as 'x'
    And I execute 'document.querySelector(".button4").getBoundingClientRect().y' function and save result as 'y'
    And I click '{$x}, {$y}' coordinates in 'Body'
    Then I expect text of 'Action' to be equal 'Button4'

  Scenario: type
    When I type 'test value' to 'Input'
    Then I expect text of 'Action' to be equal 'test value'

  Scenario: type chars
    When I type 'test value' chars to 'Input'
    Then I expect text of 'Action' to be equal 'test value'

  Scenario: clear
    When I type 'test value' to 'Input'
    When I clear 'Input'
    Then I expect value of 'Input' to be equal ''

  Scenario Outline: click in collection by text (<value>)
    When I click '<value>' text in 'Buttons' collection
    Then I expect text of 'Action' to be equal 'Button2'

    Examples:
      | value    |
      | Button2  |
      | $button2 |

  Scenario: access to locator in frame
    When I expect 'Frame Element' to be visible

  Scenario: access to locator in frame in frame
    When I expect 'Inner Frame Element' to be visible

  Scenario Outline: switch to tab by <test>
    When I click 'New Tab Link'
    When I wait 1000 ms
    When I switch to <param> window
    Then I expect current url to contain 'frame.html'
    When I expect 'Second Tab Element' to be visible

    Examples:
      | test  | param        |
      | index | 2            |
      | title | 'Frame'      |
      | url   | 'frame.html' |

  Scenario: refresh page
    When I type 'test value' to 'Input'
    Then I expect text of 'Action' to be equal 'test value'
    When I refresh page
    Then I expect text of 'Action' to be equal 'Nothing'

  Scenario: press key
    When I press 'w' key
    Then I expect text of 'Action' to be equal 'keypress'

  Scenario: press key with modifier
    And I press 'Alt+a' key
    Then I expect text of 'Key Dump' to contain '"keyCode":65'
    Then I expect text of 'Key Dump' to contain '"altKey":true'

  Scenario Outline: press <Key> key multiple times
    When I press '<Key>' key <Times> time<Postfix>
    Then I expect text of 'Press Counter' to be equal '<Result>'

    Examples:
      | Key   | Times | Postfix | Result                |
      | Enter | 1     |         | pressed Enter 1 times |
      | Space | 5     | s       | pressed Space 5 times |

  Scenario: hover
    When I hover over 'Button Hover'
    Then I expect text of 'Action' to be equal 'hover'

  Scenario: select input by text
    When I select 'two' option from 'Select' dropdown
    Then I expect text of 'Action' to be equal 'select two'

  Scenario: select input by index
    When I select 2 option from 'Select' dropdown
    Then I expect text of 'Action' to be equal 'select two'

  Scenario: scroll in window
    When I scroll by '0, 100'
    And I wait 500 ms
    And I execute 'window.scrollX' function and save result as 'scrollX'
    And I execute 'window.scrollY' function and save result as 'scrollY'
    Then I expect '$scrollX' memory value to be equal '$js(0)'
    Then I expect '$scrollY' memory value to be equal '$js(100)'

  Scenario: scroll in element
    When I scroll by '0, 50' in 'Overflow Container'
    And I wait 500 ms
    And I execute 'document.querySelector("#overflowContainer").scrollLeft' function and save result as 'scrollX'
    And I execute 'document.querySelector("#overflowContainer").scrollTop' function and save result as 'scrollY'
    Then I expect '$scrollX' memory value to be equal '$js(0)'
    Then I expect '$scrollY' memory value to be equal '$js(50)'

  Scenario: upload file
    When I upload '$uploadFile' file to 'File Input'
    Then I expect text of 'Action' to be equal 'file:C:\fakepath\actions.html'

  Scenario: upload file via file chooser
    When I upload '$uploadFile' file by clicking 'File Input'
    Then I expect text of 'Action' to be equal 'file:C:\fakepath\actions.html'

  Scenario: close current browser tab
    When I expect current url to contain 'actions.html'
    And I open new tab
    And I switch to 2 window
    And I close current tab
    Then I expect current url to contain 'actions.html'

  Scenario: open new tab
    When I open new tab
    And I switch to 2 window
    And I open '$valuesPage' url
    Then I expect current url to contain 'values.html'
    When I switch to 1 window
    Then I expect current url to contain 'actions.html'

  Scenario: resize browser's window
    When I open new tab
    And I set window size '800,600'
    Then I expect viewport size to equal '$js({ width: 800, height: 600 })'
    When I set window size '1440,900'
    Then I expect viewport size to equal '$js({ width: 1440, height: 900 })'

  Scenario: browser back and forward
    When I open '$valuesPage' url
    When I click back button
    Then I expect current url to contain 'actions.html'
    When I click forward button
    Then I expect current url to contain 'values.html'

  Scenario: tap
    When I tap 'Button Tap'
    Then I expect text of 'Action' to be equal 'tap'

  Scenario: scroll until visible
    When I hover over 'Infinite Scroll'
    When I scroll until 'Infinite Scroll Item (row 34)' to be visible

  Scenario: scroll until visible in element
    When I scroll in 'Infinite Scroll' until 'Infinite Scroll Item (row 34)' to be visible

  Scenario: set location
    When I set '$canada' geolocation
    When I grant '$location' permission
    When I click 'Location Button'
    When I expect text of 'Location Button' to equal '$js(JSON.stringify($canada))'

  Scenario: revoke permissions
    When I set '$canada' geolocation
    When I grant 'geolocation' permission
    When I click 'Location Button'
    When I expect text of 'Location Button' to equal '$js(JSON.stringify($canada))'
    When I revoke browser permissions
    When I refresh page
    When I click 'Location Button'
    When I expect text of 'Location Button' to equal 'No location'

  Scenario: save file
    When I save file to '$downloadPath' by clicking 'Download Button'
    When I expect file '$downloadPath' to exist
