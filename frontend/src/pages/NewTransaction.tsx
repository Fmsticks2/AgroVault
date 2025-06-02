import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAleoWallet } from "../hooks/useAleoWallet";
import { toast } from "react-toastify";

const NewTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    recipient: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our custom hook for wallet functionality
  const {
    address,
    isConnected,
    signTransaction,
    sendTransaction
  } = useAleoWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create transaction object for the smart contract
      const transaction = {
        programId: "marketplace.aleo",
        functionName: "transfer",
        inputs: [
          formData.recipient, // recipient address
          formData.amount,    // amount as a string
          formData.type,      // transaction type
        ]
      };
      
      // Sign the transaction
      const signedTx = await signTransaction(transaction);
      
      // Send the transaction
      const txId = await sendTransaction(signedTx);
      
      console.log(`Transaction submitted: ${txId}`);
      toast.success(`Transaction submitted! ID: ${txId.slice(0, 10)}...`);
      navigate("/operations");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Transaction error:', error);
      toast.error(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6 w-full min-w-0 md:space-y-6 py-6 pt-24 pl-20 md:pl-24 lg:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">New Transaction</h1>
      </div>
      
      <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Transaction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select type</option>
              <option value="transfer">Transfer</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Recipient Address</label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="Enter recipient's address"
              className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transaction description"
              className="w-full bg-background-light border border-border rounded-lg px-4 py-2 h-24"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/operations")}
              className="btn-secondary py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-4 rounded-lg"
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? 'Processing...' : !isConnected ? 'Connect Wallet First' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransaction;