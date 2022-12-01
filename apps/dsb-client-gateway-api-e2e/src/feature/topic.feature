Feature: Topic Management
  ## TO-001 (Endpoint POST /api/v2/topics)
  Scenario Outline: Create a topic
    Given The system has identity set
    And The <UserRole> has its enrolment status equals to <EnrolmentStatus> for the application <Application>
    And There is no topic with the name <name>
    When The user submit <schemaType>, <schema>, <version>, <owner>, <tags> to create the <name> topic
    Then a new topic is registered in storage with the name <name>

    Examples:
      | UserRole | EnrolmentStatus | Application | name  |  schemaType  | schema   | version | owner   |  tags    |
      | topiccreator.roles | SYNCED | EWTEST.apps.ewaemotest.iam.ewc| E2E_TOPIC | JSD7 | {} | 1.0.0 | EWTEST.apps.ewaemotest.iam.ewc | test |
