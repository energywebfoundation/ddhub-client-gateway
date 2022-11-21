Feature: Test smth
  Scenario Outline: CIPA
    Given Chuj
    When Chuj into cipa with <CM>
    Then Result <CM>
    Examples:
    | CM |
    | 5  |
    | 6  |
