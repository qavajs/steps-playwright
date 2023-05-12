Feature: Drag And Drop

  Background:
    When I open '$dragDropPage' url

  Scenario: drag and drop
    When I drag and drop 'Drag Element' to 'Drop Zone'
    And I expect 'Drag Element In Drop Zone' to be visible
