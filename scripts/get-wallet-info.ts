import { createLocalWallet } from '../frontend/src/app/utils/localWallet';

const mnemonic = "torch battle glare chair fix thought trick party coral jazz dice quarter";
const wallet = createLocalWallet(mnemonic);

if (wallet) {
    console.log('Wallet 2 Public Key:', wallet.publicKey.toString());
} else {
    console.error('Failed to create wallet');
} 