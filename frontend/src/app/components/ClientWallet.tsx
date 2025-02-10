'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';

const ClientWallet: FC = () => {
  const { publicKey } = useWallet();
  
  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton />
      {publicKey && (
        <p className="text-sm text-white">
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </p>
      )}
    </div>
  );
};

export default ClientWallet; 