Feature: Memory

  Background:
    When I open '$valuesPage' url

  Scenario: element text
    When I save text of 'Simple Text Element' as 'memory'
    Then I expect '$memory' memory value to be equal 'text value'

  Scenario: collection number of elements
    When I save number of elements in 'Simple Text List Items' collection as 'memory'
    Then I expect '$memory' memory value to be equal '$number(3)'

  Scenario: element property
    When I save 'value' property of 'Simple Text Input' as 'memory'
    Then I expect '$memory' memory value to be equal '123'

  Scenario: element attribute
    When I save 'name' attribute of 'Simple Text Input' as 'memory'
    Then I expect '$memory' memory value to be equal 'textInputName'

  Scenario: current url
    When I save current url as '$valuesPage'
    Then I expect '$memory' memory value to be equal 'textInputName'

  Scenario: page title
    Then I save page title as 'memory'
    Then I expect '$memory' memory value to be equal '@qavajs'

  Scenario: collection text of elements
    Then I save text of every element of 'Simple Text List Items' collection as 'memory'
    Then I expect '$memory' memory value to be equal '$array("first value", "second value", "third value")'

  Scenario: collection attribute of elements
    Then I save 'id' attribute of every element of 'Simple Text List Items' collection as 'memory'
    Then I expect '$memory' memory value to be equal '$array("firstValue", "secondValue", "thirdValue")'

  Scenario: collection property of elements
    Then I save 'nodeName' property of every element of 'Simple Text List Items' collection as 'memory'
    Then I expect '$memory' memory value to be equal '$array("LI", "LI", "LI")'
