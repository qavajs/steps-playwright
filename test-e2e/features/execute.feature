Feature: execute

  Background:
    When I open '$actionsPage' url

  Scenario: execute function plain text
    When I execute 'document.querySelector("#input").value = "some value"' function
    Then I expect 'value' property of 'Input' to be equal 'some value'

  Scenario: execute function
    When I execute '$setInputValue' script
    Then I expect 'value' property of 'Input' to be equal 'some value'

  Scenario: execute function and save result plain text
    When I click 'Button'
    When I execute 'document.querySelector("#action").innerText' function and save result as 'innerText'
    Then I expect '$innerText' memory value to be equal 'click'

  Scenario: execute function from memory and save result plain text
    When I click 'Button'
    When I execute '$getActionInnerText' script and save result as 'innerText'
    Then I expect '$innerText' memory value to be equal 'click'

  Scenario: execute function on element plain text
    When I execute 'arguments[0].click()' function on 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: execute function on element
    When I execute '$clickJS' function on 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: execute function on element plain text and save result
    When I execute 'arguments[0].innerText' script on 'Button' and save result as 'buttonInnerText'
    Then I expect '$buttonInnerText' memory value to be equal 'Click Me!'

  Scenario: execute function on element and save result
    When I execute '$getInnerText' function on 'Button' and save result as 'buttonInnerText'
    Then I expect '$buttonInnerText' memory value to be equal 'Click Me!'
