import { createLocalWallet } from '../frontend/src/app/utils/localWallet';

const mnemonic = "noodle tube gadget message pause stable rain pond school rapid define absent";
const wallet = createLocalWallet(mnemonic);

if (wallet) {
    console.log('Wallet 2 Public Key:', wallet.publicKey.toString());
} else {
    console.error('Failed to create wallet');
} 