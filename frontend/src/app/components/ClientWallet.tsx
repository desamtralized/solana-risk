'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletName } from '@solana/wallet-adapter-base';
import { FC, useState } from 'react';

const ClientWallet: FC = () => {
  const { publicKey, wallet, wallets, select } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLocalnet = process.env.NEXT_PUBLIC_NETWORK === 'localnet';
  
  const handleWalletSelect = (walletName: WalletName) => {
    select(walletName);
    setIsOpen(false);
  };

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  
  if (!isLocalnet) {
    return <WalletMultiButton />;
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="py-2 px-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-80 rounded-md font-semibold text-white transition-all flex items-center gap-2"
          >
            <span>{wallet ? wallet.adapter.name : 'Select Local Wallet'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute top-full mt-2 w-full bg-[#1a1f2e] border border-[#2a2f3e] rounded-md shadow-lg overflow-hidden z-50">
              {wallets.map((w) => (
                <button
                  key={w.adapter.name}
                  onClick={() => handleWalletSelect(w.adapter.name)}
                  className={`w-full px-4 py-2 text-left hover:bg-[#2a2f3e] transition-colors ${
                    wallet?.adapter.name === w.adapter.name ? 'bg-[#2a2f3e] text-[#14F195]' : 'text-white'
                  }`}
                >
                  {w.adapter.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {publicKey && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-white">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </p>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-[#2a2f3e] rounded-md transition-colors relative group"
              title="Copy address"
            >
              {copied ? (
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {copied ? 'Copied!' : 'Copy address'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientWallet; 