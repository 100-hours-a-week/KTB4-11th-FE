export interface CreateAccountRequest {
  initial_capital: number;
  account_name: string;
}

export interface CreateAccountResponse {
  message: string;
  account_id: number;
  account_name: string;
  initial_capital: number;
}
