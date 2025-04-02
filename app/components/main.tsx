"use client";

import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Copy, Sun, Moon,Trash } from "lucide-react";
import toast , {Toaster} from "react-hot-toast";

interface WalletData {
  seedPhrase: string;
  publicKey: string;
  secretKey: string;
}

function Main() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const [darkMode, setDarkMode] = useState(true);

  const handleSolGenerate = async () => {
    try {
      
      setGenerating(true);
      const { data } = await axios.get(process.env.NEXT_PUBLIC_ROUTE!);
      
      setWallets((prevWallets) => [data, ...prevWallets]);
    } catch (error) {
      console.error("Error generating wallet:", error);
    } finally {
      setGenerating(false);
    }
  };

  const togglePassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const deleteWallet = (index: number) => {
    setWallets((prevWallets) => prevWallets.filter((_, i) => i !== index));
  };
  

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div
      className={`${
        darkMode ? "bg-black text-gray-200" : " bg-gray-800 text-gray-900"
      } min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all`}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } shadow-xl rounded-2xl border border-gray-800 p-8 transition-all`}
        >
          {/* Header & Theme Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Crypto Wallet Generator</h1>
            <button
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun size={24} className={`text-yellow-400`} />
              ) : (
                <Moon size={24} className={` text-white`} />
              )}
            </button>
          </div>

          <p className="text-gray-400 mb-6">
            Generate secure solana wallets instantly.
          </p>

          {/* Generate Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSolGenerate}
              disabled={generating}
              className={`px-8 py-4 rounded-xl text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md ${
                generating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {generating ? "Generating..." : "Generate Wallet"}
            </button>
          </div>

          {/* Wallet List */}
          {wallets.length > 0 && (
            <div className="space-y-6 mt-6">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-gray-200 text-gray-900"
                  } p-6 rounded-lg border border-gray-700 shadow-lg transition-all`}
                >
                  <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold mb-2">
                      Wallet #{wallets.length - index}
                    </h2>
                    <Trash size={24} onClick={()=>{
                      deleteWallet(index);
                    }} />
                  </div>

                  {/* Seed Phrase */}
                  <div className="mb-4 relative">
                    <h3
                      className={` ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      } text-lg font-semibold `}
                    >
                      Seed Phrase
                    </h3>
                    <p className="font-mono p-4 bg-gray-700 rounded-lg text-sm text-gray-200">
                      {wallet.seedPhrase}
                    </p>
                    <button
                      className="absolute top-10 right-3 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(wallet.seedPhrase)}
                    >
                      <Copy size={20} />
                    </button>
                  </div>

                  {/* Private Key */}
                  <div className="mb-4 relative">
                    <h3
                      className={` ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      } text-lg font-semibold`}
                    >
                      Private Key
                    </h3>
                    <div className="relative">
                      <input
                        className="font-mono p-4 bg-gray-700 rounded-lg w-full pr-12 text-sm text-gray-200"
                        value={wallet.secretKey}
                        type={showPasswords[index] ? "text" : "password"}
                        readOnly
                      />
                      <button
                        className="absolute right-10 top-4 text-gray-400 hover:text-white"
                        onClick={() => togglePassword(index)}
                      >
                        {showPasswords[index] ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                      <button
                        className="absolute right-3 top-4 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(wallet.secretKey)}
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Public Key */}
                  <div className="relative">
                    <h3
                      className={` ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      } text-lg font-semibold`}
                    >
                      Public Key
                    </h3>
                    <p className="font-mono p-4 bg-gray-700 rounded-lg text-sm text-gray-200">
                      {wallet.publicKey}
                    </p>
                    <button
                      className="absolute top-10 right-3 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(wallet.publicKey)}
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Warning */}
          <div className="mt-10 p-5 bg-red-900/20 border border-red-800/30 rounded-xl text-red-300 text-sm">
            <p className="font-semibold text-red-400">Security Warning</p>
            <p>
              Never share your private key or seed phrase with anyone. Store
              them securely offline.
            </p>
          </div>

          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default Main;
