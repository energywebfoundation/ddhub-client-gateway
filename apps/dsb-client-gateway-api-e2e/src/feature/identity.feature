Feature: Identity
  Scenario Outline: Receives identity
    Given The system has no identity set
    When The <PrivateKey_ID> is submitted to the system
    Then I should get in POST response <Address>
    Then The <UserRole> has its enrolment state equals to <EnrolmentState> for the application <Application> and role is SYNCED
    Then The signature key and public RSA key should exists in DID document for <Address>
    Examples:
    | PrivateKey_ID | Address | UserRole | EnrolmentState | Application |
    | s2whsu7jjyj4y2ezph7swiyy7a | 0x552761011ea5b332605Bc1Cc2020A4a4f8C738CD | user.roles | SYNCED | ddhub.apps.energyweb.iam.ewc|
  Scenario: No private key
    Given The system has no identity set
    When No private key is provided
    Then I should get no private key error
  Scenario Outline: Invalid private key
    Given The system has no identity set
    When Invalid <PrivateKey> is provided
    Then I should get validation error

    Examples:
    | PrivateKey |
    | invalid    |
