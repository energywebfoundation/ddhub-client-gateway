Feature: Channel management
  Scenario Outline: Receives empty list of channels
    Given The system has identity set with <PrivateKey_ID>
    Given No channels exists
    When I ask for channels
    Then I should receive empty list of channels
    Examples:
    | PrivateKey_ID |
    | s2whsu7jjyj4y2ezph7swiyy7a |

  Scenario Outline: Should create channel
    Given The system has identity set with <PrivateKey_ID>
    Given No channels exists
    Given The topic with <Topic_Payload_Id> does not exists
    Given The topic was created with payload <Topic_Payload_Id>
    When I send a request with <Payload_ID>
    Then The channel with <Payload_ID> should be visible in list of channels
    Examples:
    | PrivateKey_ID | Payload_ID | Topic_Payload_Id |
    | s2whsu7jjyj4y2ezph7swiyy7a | create_channel.json | create_pub_topic.json |

  Scenario Outline: Should delete channel
    Given The system has identity set with <PrivateKey_ID>
    Given No channels exists
    When I send a request with <Channel_Payload_Id>
    When I send a delete request with <Channel_Payload_Id>
    Then The channel with <Channel_Payload_Id> should not be visible in list of channels
    Examples:
      | PrivateKey_ID | Channel_Payload_Id |
      | s2whsu7jjyj4y2ezph7swiyy7a | create_channel.json |

  Scenario Outline: Should receive qualified dids
    Given The system has identity set with <PrivateKey_ID>
    Given No channels exists
    When I send a request with <Channel_Payload_Id>
    Then The channel with <Channel_Payload_Id> should return qualified dids
    Examples:
      | PrivateKey_ID | Channel_Payload_Id |
      | s2whsu7jjyj4y2ezph7swiyy7a | dids.json |

  Scenario Outline: Should update channel payload encryption
    Given The system has identity set with <PrivateKey_ID>
    Given No channels exists
    When I send a request with <Channel_Payload_Id>
    When I send update request with <Channel_Update_Payload_Id> and fqcn <FQCN>
    Then The channel with <FQCN> should have payload encryption set to <PayloadEncryption>
    Examples:
      | PrivateKey_ID | Channel_Payload_Id | PayloadEncryption | FQCN | Channel_Update_Payload_Id |
      | s2whsu7jjyj4y2ezph7swiyy7a | create_channel.json | false | testjson33456780dasdsa | update_channel.json |
