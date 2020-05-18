/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      email
      avatar {
        bucket
        region
        key
        oldkey
      }
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      email
      avatar {
        bucket
        region
        key
        oldkey
      }
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      email
      avatar {
        bucket
        region
        key
        oldkey
      }
    }
  }
`;
export const triggerProgressUpdate = /* GraphQL */ `
  mutation TriggerProgressUpdate($input: ProgressInput!) {
    triggerProgressUpdate(input: $input) {
      message
    }
  }
`;
