export interface PaymentMethodTemplate {
    id: string;
    type: PaymentType;
    name?: string;
    description?: string;
    details: PaymentDetails;
}

export type PaymentType =
    "Credit" |
    "Debit" |
    "DigitalWallet" |
    "Paypal" |
    "Crypto";

export interface PaymentDetails {
    cardNumber?: string;
    expiryDate?: Date;
    cvv?: string;
    bankAccountNumber?: string;
    routingNumber?: string;
    paypalEmail?: string;
    cryptoAddress?: string;
    walletId?: string;
    walletProvider?: DigitalWalletProvider;
}

export type DigitalWalletProvider =
    | 'applePay'
    | 'samsungPay'
    | 'googlePay'
    | 'amazonPay'
    | 'paypal'
    | 'venmo'
    | 'zelle'
    | 'cashApp';
