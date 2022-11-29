Feature: Association Keys
  Scenario Outline: Deriving keys
    Given The system has identity set
    Given No association keys are generated
    Given The <MNEMONIC> mnenomic is set
    When Deriving keys for <DATE>
    Then I should have at least <KEYS_AMOUNT> association keys available
    Then Then dates of keys should cross each other
    Then All keys should have status sent
    Then Keys should be visible in response
    Examples:
    | MNEMONIC | DATE | KEYS_AMOUNT |
    | prevent bridge survey obvious lecture excuse year disorder crowd burst shadow maze | 2022-11-29T10:26:57.588Z | 2 |
  Scenario Outline: Duplicate request for deriving keys
    Given The system has identity set
    Given No association keys are generated
    Given The <MNEMONIC> mnenomic is set
    Given One association key is already generated for <DATE>
    When Deriving keys for <DATE>
    Then I should have at least <KEYS_AMOUNT> association keys available
    Then Then dates of keys should cross each other
    Examples:
      | MNEMONIC | DATE | KEYS_AMOUNT |
      | prevent bridge survey obvious lecture excuse year disorder crowd burst shadow maze | 2022-11-29T10:26:57.588Z | 2 |
