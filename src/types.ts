/* eslint-disable @typescript-eslint/no-explicit-any */
// --- PayIn --- //
export interface ICreatePixCashIn {
  webhook_url: string;
  value: number;
  buyer: {
    cpf: string;
    name: string;
    description?: string;
    email?: string;
  };
}

export interface IResponsePixCashIn {
  id: string;
  acquirer_id: string;
  qr_code: string;
  qr_code_image: string;
}

export interface IWebhookMessage {
  id: string;
  value: number;
  paid_value: number;
  paid_at: string;
  status: string;
}

export interface IGetPayment {
  id: string;
  transaction_type: string;
  value: number;
  created_at: string;
  delivered_at: string | null;
  status: string;
  bank: string;
  endToEndId: string | null;
  timezone: string;
  merchant: {
    id: number;
    name: "BET WASE";
  };
  buyer: {
    name: string;
    email: string | null;
    cpf: string;
    cnpj: string | null;
  };
}

export interface IListPayment {
  total: number;
  transactions_total: number;
  transactions_value: number;
  paid_total: number;
  paid_value: number;
  chargeback_total: number;
  chargeback_value: number;
  waiting_total: number;
  waiting_value: number;
  canceled_total: number;
  canceled_value: number;
  declined_total: number;
  declined_value: number;
  refunded_total: number;
  refunded_value: number;
  page: number;
  limit: number;
  transactions: IGetPayment[];
}

// --- Payout --- //
export interface ICreateCashOut {
  value: number;
  cpf: string;
  pix_key_type: "CPF" | "EMAIL" | "PHONE" | "EVP";
  pix_key: string;
  webhook_url: string;
}

export interface IResponseCashOut {
  id: string;
  value: string;
  receiver_name: string;
  receiver_cpf: string;
  pix_key_type: "CPF" | "EMAIL" | "PHONE" | "EVP";
  pix_key: string;
  merchant: {
    id: string;
    name: string;
  };
}

export interface IWebhookPayOut {
  id: string;
  value: number;
  type: string;
  pix_key_type: "CPF" | "EMAIL" | "PHONE" | "EVP";
  pix_key: string;
  paid_at: string;
  receiver_data: {
    name: string;
    document: string;
    agency: string;
    bank: string;
    account: string;
  };
}

export interface IGetWithdraw {
  transactionType: string;
  bank: string;
  id: string;
  acquirer_id: string;
  qr_code: string;
  qr_code_image: string;
  value: number;
  paid_value: number | null;
  description: string | null;
  webhook_url: string;
  paid_at: string | null;
  status: string;
  delivered_at: string | null;
  currency: string;
  paid_currency: string;
  timezone: string;
  endToEndId: string | null;
  created_at: string;
  pix_payer: string | null;
  buyer: { name: string; cpf: string; cnpj: string | null };
  merchant: { id: number; name: string };
}

export interface IListWithdraw {
  total: number;
  page: number;
  limit: number;
  transactions_total: number;
  transactions_value: number;
  canceled_total: number;
  canceled_value: number;
  created_total: number;
  created_value: number;
  paid_total: number;
  paid_value: number;
  pending_total: number;
  pending_value: number;
  processing_total: number;
  processing_value: number;
  items: IGetWithdraw[];
}

export interface IError {
  success: boolean;
  data: any;
}
