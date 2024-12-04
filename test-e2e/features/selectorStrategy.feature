Feature: selector engines

  Background:
    When I open '$valuesPage' url

  Scenario: single element by js
    Then I expect text of 'Simple Text Element By JS' to be equal 'text value'

  Scenario: element collection by js
    Then I expect number of elements in 'Simple Text List Items By JS' collection to equal '3'
