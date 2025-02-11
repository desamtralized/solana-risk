import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

export function createLocalWallet(mnemonic: string): Keypair | null {
  try {
    console.log('Creating local wallet with mnemonic:', mnemonic);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    console.log('Seed created');
    const { key } = derivePath("m/44'/501'/0'/0'", seed.toString('hex'));
    console.log('Key derived');
    const keypair = Keypair.fromSeed(Uint8Array.from(key));
    console.log('Keypair created:', keypair.publicKey.toString());
    return keypair;
  } catch (e) {
    console.error('Could not create local wallet:', e);
    return null;
  }
} 