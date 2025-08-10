export interface AccountRecord {
    id: number;
    account: number;
    balance: number;
    type: string;
    duty?: number;
    interestRate?: number;
    loanTerm?: number;
}
