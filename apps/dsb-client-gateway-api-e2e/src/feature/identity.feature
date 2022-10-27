Feature: Identity
  Scenario Outline: Receives identity
    Given The system has no identity set
    When The private key is submitted to the system
    Then I should get in POST response <Address>
    Then The <UserRole> has its enrolment state equals to <EnrolmentState> for the application <Application> and role is SYNCED
    Then The signature key and public RSA key should exists in DID document for <Address>
    Examples:
    | Address | UserRole | EnrolmentState | Application |
    | 0x14B9f6D0E00d601D32E02AAf88585505Bb659dC2 | user.roles | SYNCED | ddhub.apps.energyweb.iam.ewc|
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
