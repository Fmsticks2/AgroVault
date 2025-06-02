import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Operation {
  id: string;
  type: string;
  amount: number;
  recipient: string;
  status: string;
  date: string;
  description: string;
}

const mockOperations: Operation[] = [
  {
    id: "1",
    type: "transfer",
    amount: 1000,
    recipient: "0x1234...5678",
    status: "completed",
    date: "2024-01-20",
    description: "Transfer to supplier"
  },
  {
    id: "2",
    type: "deposit",
    amount: 5000,
    recipient: "0x8765...4321",
    status: "pending",
    date: "2024-01-19",
    description: "Monthly deposit"
  }
];

const ViewAllOperations: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredOperations = mockOperations.filter(op => {
    const matchesSearch = 
      op.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && op.type === filter;
  });

  return (
    <div className="space-y-6 w-full min-w-0 md:space-y-6 py-6 pt-24 pl-20 md:pl-24 lg:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">All Operations</h1>
        <button
          onClick={() => navigate("/new-transaction")}
          className="btn-primary py-2 px-4 rounded-lg"
        >
          New Transaction
        </button>
      </div>

      <div className="bg-background p-6 rounded-lg border border-border">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by recipient or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-background-light border border-border rounded-lg px-4 py-2"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-background-light border border-border rounded-lg px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="transfer">Transfer</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Recipient</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperations.map((op) => (
                <tr key={op.id} className="border-b border-border">
                  <td className="py-4">{op.date}</td>
                  <td className="py-4 capitalize">{op.type}</td>
                  <td className="py-4">{op.amount.toLocaleString()} AGRI</td>
                  <td className="py-4">{op.recipient}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      op.status === 'completed' ? 'bg-green-100 text-green-800' :
                      op.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="py-4">{op.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAllOperations;