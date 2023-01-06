Feature:
  Scenario Outline: Should send message
    Given The system has identity set
    Given The topic with <Topic_Payload_Id> does not exists
    Given The topic was created with payload <Topic_Payload_Id>
    Given Channel is created with <Channel_Payload_Id>
    When I send message with payload <Message_Payload_Id>
    Then Message response status should be <STATUS_CODE>
    Then Message response should contain 1 successful recipient
    Examples:
      | Topic_Payload_Id | Channel_Payload_Id | Message_Payload_Id | STATUS_CODE |
      | create_message_pub_topic.json | create_message_pub_channel.json | send_message.json | 200 |
