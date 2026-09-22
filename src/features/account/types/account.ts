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

export interface Account {
  account_id: number;
  account_name: string;
  is_duel_account: boolean;
  cash_balance: number;
  total_assets: number;
  return_percent: number;
}

export interface AccountListResponse {
  message: string;
  accounts: Account[];
}
