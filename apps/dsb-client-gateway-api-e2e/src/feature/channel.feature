Feature: Channel management
  Scenario: Receives empty list of channels
    Given The system has identity set
    Given No channels exists
    When I ask for channels
    Then I should receive empty list of channels

  Scenario Outline: Should create channel
    Given The system has identity set
    Given No channels exists
    Given The topic with <Topic_Payload_Id> does not exists
    Given The topic was created with payload <Topic_Payload_Id>
    When I send a request with <Payload_ID>
    Then The channel with <Payload_ID> should be visible in list of channels
    Then Response status for <MEM_TYPE> should be <ResponseStatus>
    Examples:
    | Payload_ID | Topic_Payload_Id | MEM_TYPE | ResponseStatus |
    | create_channel.json | create_pub_topic.json | CHANNEL_CREATE_RESPONSE | 201 |

  Scenario Outline: Should delete channel
    Given The system has identity set
    Given No channels exists
    Given Channel is created with <Channel_Payload_Id>
    When I send a delete request with <Channel_Payload_Id>
    Then Response status for <MEM_TYPE> should be <ResponseStatus>
    Then The channel with <Channel_Payload_Id> should not be visible in list of channels
    Examples:
      | Channel_Payload_Id | MEM_TYPE | ResponseStatus |
      | create_channel.json | CHANNEL_DELETE_RESPONSE | 200 |

  Scenario Outline: Should receive qualified dids
    Given The system has identity set
    Given No channels exists
    When I send a request with <Channel_Payload_Id>
    Then The channel with <Channel_Payload_Id> should return qualified dids
    Examples:
      | Channel_Payload_Id |
      | dids.json |

  Scenario Outline: Should update channel payload encryption
    Given The system has identity set
    Given No channels exists
    Given Channel is created with <Channel_Payload_Id>
    When I send update request with <Channel_Update_Payload_Id> and fqcn <FQCN>
    Then The channel with <FQCN> should have payload encryption set to <PayloadEncryption>
    Examples:
      | Channel_Payload_Id | PayloadEncryption | FQCN | Channel_Update_Payload_Id |
      | create_channel.json | false | testjson33456780dasdsa | update_channel.json |
