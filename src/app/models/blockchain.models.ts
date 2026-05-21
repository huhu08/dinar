xport interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: number;
    timestamp: number;
    signature: string;
  }
  
  export interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
    miner: string;
    reward: number;
  }
  
  export interface Wallet {
    address: string;
    name: string;
    balance: number;
    transactionCount: number;
  }
  
  export interface ChainStats {
    totalBlocks: number;
    totalTransactions: number;
    pendingTransactions: number;
    totalSupply: number;
    difficulty: number;
    isValid: boolean;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
  }
  