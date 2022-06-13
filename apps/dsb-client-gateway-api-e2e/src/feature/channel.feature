Feature: Channel management
  Scenario Outline: Receives empty list of channels
    Given The system has identity set with <PrivateKey_ID>
    Given No channels exists
    When I ask for channels
    Then I should receive empty list of channels
    Examples:
    | PrivateKey_ID |
    | s2whsu7jjyj4y2ezph7swiyy7a |
