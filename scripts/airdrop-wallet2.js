const { Keypair } = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');

function createLocalWallet(mnemonic) {
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

const mnemonic = "noodle tube gadget message pause stable rain pond school rapid define absent";
const wallet = createLocalWallet(mnemonic);

if (wallet) {
    console.log('Wallet 2 Public Key:', wallet.publicKey.toString());
} else {
    console.error('Failed to create wallet');
} 