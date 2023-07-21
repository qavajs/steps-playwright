Feature: validations

  Background:
    When I open '$valuesPage' url

  Scenario: element text
    Then I expect text of 'Simple Text Element' to be equal 'text value'
    Then I expect text of 'Simple Text Element' to contain 'text val'
    Then I expect text of 'Simple Text Element' not to equal 'not text value'
    Then I expect text of 'Simple Text Element' not to contain 'not text val'
    Then I expect text of '#2 of Simple Text List Items' to be equal 'second value'
    Then I expect text of '#third in Simple Text List Items' to be equal 'third value'
    Then I expect text of 'Simple Text Element' to match '^text.+$'

  Scenario: collection number of elements
    Then I expect number of elements in 'Simple Text List Items' collection to be equal '3'
    Then I expect number of elements in 'Simple Text List Items' collection not to be equal '4'
    Then I expect number of elements in 'Simple Text List Items' collection to be greater than '2'
    Then I expect number of elements in 'Simple Text List Items' collection to be less than '4'

  Scenario: element property
    Then I expect 'value' property of 'Simple Text Input' to be equal '123'
    Then I expect 'value' property of 'Simple Text Input' not to be equal '1234'
    Then I expect 'value' property of 'Simple Text Input' to contain '12'

  Scenario: element attribute
    Then I expect 'name' attribute of 'Simple Text Input' to be equal 'textInputName'
    Then I expect 'name' attribute of 'Simple Text Input' not to be equal 'textInput'
    Then I expect 'name' attribute of 'Simple Text Input' to contain 'textInputName'

  Scenario: current url
    Then I expect current url not to be equal 'https://qavajs.github.io/'
    Then I expect current url to contain 'values'

  Scenario: page title
    Then I expect page title to be equal '@qavajs'
    Then I expect page title not to be equal 'not @qavajs'
    Then I expect page title to be contain 'qava'

  Scenario: collection text of elements
    Then I expect text of every element in 'Simple Text List Items' collection to contain 'value'
    Then I expect text of every element in 'Simple Text List Items' collection not to be equal 'text'

  Scenario: collection attribute of elements
    Then I expect 'id' attribute of every element in 'Simple Text List Items' collection to contain 'Value'
    Then I expect 'id' attribute of every element in 'Simple Text List Items' collection not to contain 'fourth'

  Scenario: collection property of elements
    Then I expect 'nodeName' property of every element in 'Simple Text List Items' collection to equal 'LI'
    Then I expect 'nodeName' property of every element in 'Simple Text List Items' collection not to contain 'A'

  Scenario: element css property
    Then I expect 'background-color' css property of 'Simple Text Input' to be equal 'rgb(95, 158, 160)'
    Then I expect 'font-size' css property of '#1 of Simple Text List Items' to be equal '20px'

  Scenario Outline: collection condition
    Then I expect every element in '<collection>' collection <condition>

    Examples:
      | collection         | condition     |
      | Present Collection | to be present |
