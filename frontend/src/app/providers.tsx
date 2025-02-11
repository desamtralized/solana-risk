'use client';

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, useEffect } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Keypair, Transaction, VersionedTransaction, Connection } from "@solana/web3.js";
import { BaseWalletAdapter, WalletName, WalletReadyState, WalletError } from '@solana/wallet-adapter-base';
import { createLocalWallet } from './utils/localWallet';

console.log('Environment check:');
console.log('NEXT_PUBLIC_NETWORK:', process.env.NEXT_PUBLIC_NETWORK);
console.log('NEXT_PUBLIC_LOCAL_WALLET_KEY exists:', !!process.env.NEXT_PUBLIC_LOCAL_WALLET_KEY);

// Load local wallet if we're on localnet
const localWallet = (() => {
  if (process.env.NEXT_PUBLIC_NETWORK === 'localnet' && process.env.NEXT_PUBLIC_LOCAL_WALLET_KEY) {
    console.log('Attempting to load local wallet for localnet...');
    const wallet = createLocalWallet(process.env.NEXT_PUBLIC_LOCAL_WALLET_KEY);
    if (wallet) {
      console.log('Local wallet loaded successfully:', wallet.publicKey.toString());
      return wallet;
    } else {
      console.error('Failed to create local wallet');
    }
  } else {
    console.log('Not using local wallet. Network:', process.env.NEXT_PUBLIC_NETWORK);
    console.log('Local wallet key available:', !!process.env.NEXT_PUBLIC_LOCAL_WALLET_KEY);
  }
  return null;
})();

class LocalWalletAdapter extends BaseWalletAdapter {
  name = 'Local Wallet' as WalletName<'Local Wallet'>;
  url = 'https://solana.com';
  icon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PC9zdmc+';
  supportedTransactionVersions = new Set(['legacy', 0] as const);
  private _connecting: boolean;
  private _connected: boolean;
  private _publicKey: Keypair['publicKey'];
  
  constructor(private keypair: Keypair) {
    super();
    this._connecting = false;
    this._connected = true; // Start as connected since it's a local wallet
    this._publicKey = keypair.publicKey;
    console.log('LocalWalletAdapter initialized with public key:', this._publicKey.toString());
  }

  get connecting() {
    return this._connecting;
  }

  get connected() {
    return this._connected;
  }

  get readyState() {
    return WalletReadyState.Installed;
  }

  get publicKey() {
    return this._publicKey;
  }

  async connect(): Promise<void> {
    try {
      console.log('LocalWalletAdapter: Connecting...');
      this._connecting = true;
      this._connected = true;
      this.emit('connect', this._publicKey);
      console.log('LocalWalletAdapter: Connected successfully');
    } catch (error) {
      console.error('LocalWalletAdapter: Connection failed:', error);
      this.emit('error', new WalletError('Failed to connect'));
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    this._connected = false;
    this.emit('disconnect');
  }

  async sendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    connection: Connection
  ): Promise<string> {
    try {
      const signedTransaction = await this.signTransaction(transaction);
      const rawTransaction = signedTransaction.serialize();
      return await connection.sendRawTransaction(rawTransaction);
    } catch (error) {
      this.emit('error', new WalletError('Failed to send transaction'));
      throw error;
    }
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    try {
      if ('version' in transaction) {
        transaction.sign([this.keypair]);
      } else {
        transaction.partialSign(this.keypair);
      }
      return transaction;
    } catch (error) {
      this.emit('error', new WalletError('Failed to sign transaction'));
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
    try {
      return transactions.map(transaction => {
        if ('version' in transaction) {
          transaction.sign([this.keypair]);
        } else {
          transaction.partialSign(this.keypair);
        }
        return transaction;
      });
    } catch (error) {
      this.emit('error', new WalletError('Failed to sign transactions'));
      throw error;
    }
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "http://127.0.0.1:8899";
  
  const wallets = useMemo(() => {
    console.log('Initializing wallet adapters:');
    console.log('Network:', process.env.NEXT_PUBLIC_NETWORK);
    console.log('Local wallet available:', !!localWallet);
    
    if (process.env.NEXT_PUBLIC_NETWORK === 'localnet' && localWallet) {
      console.log('Using LocalWalletAdapter');
      const adapter = new LocalWalletAdapter(localWallet);
      // Prevent Phantom from being included
      return [adapter];
    }
    console.log('Using PhantomWalletAdapter');
    return [new PhantomWalletAdapter()];
  }, []);

  useEffect(() => {
    console.log('Providers mounted. Endpoint:', endpoint);
    console.log('Available wallets:', wallets.map(w => w.name).join(', '));
  }, [endpoint, wallets]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={process.env.NEXT_PUBLIC_NETWORK === 'localnet'}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 