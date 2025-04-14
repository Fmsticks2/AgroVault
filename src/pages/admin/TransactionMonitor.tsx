import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'stake' | 'unstake';
  status: 'pending' | 'completed' | 'failed';
  amount: string;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  hash: string;
}

const TransactionMonitor = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      status: 'completed',
      amount: '1000 AGRO',
      fromAddress: '0x1234...5678',
      toAddress: '0x8765...4321',
      timestamp: '2024-01-20 10:30:00',
      hash: '0xabcd...efgh'
    },
    {
      id: '2',
      type: 'withdrawal',
      status: 'pending',
      amount: '500 AGRO',
      fromAddress: '0x8765...4321',
      toAddress: '0x2468...1357',
      timestamp: '2024-01-20 11:15:00',
      hash: '0xijkl...mnop'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const response = await adminService.getTransactions();
        setTransactions(response.data);
      } catch (error) {
        toast.error('Failed to load transactions');
        console.error('Error loading transactions:', error);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleStatusUpdate = async (transactionId: string, newStatus: Transaction['status']) => {
    try {
      await adminService.updateTransactionStatus(transactionId, newStatus);
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === transactionId ? { ...tx, status: newStatus } : tx
        )
      );
      toast.success('Transaction status updated successfully');
    } catch (error) {
      toast.error('Failed to update transaction status');
      console.error('Error updating transaction status:', error);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transaction Monitor</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by hash or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-light border border-border rounded-lg"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-background-light border border-border rounded-lg px-4 py-2"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
          <option value="stake">Stake</option>
          <option value="unstake">Unstake</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-background-light border border-border rounded-lg px-4 py-2"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Hash</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 capitalize">{tx.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.status === 'completed' ? (
                      <FaCheckCircle className="mr-1" />
                    ) : tx.status === 'failed' ? (
                      <FaExclamationCircle className="mr-1" />
                    ) : null}
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4">{tx.amount}</td>
                <td className="px-6 py-4">{tx.fromAddress}</td>
                <td className="px-6 py-4">{tx.toAddress}</td>
                <td className="px-6 py-4">{tx.timestamp}</td>
                <td className="px-6 py-4">{tx.hash}</td>
                <td className="px-6 py-4">
                  {tx.status === 'failed' ? (
                    <button
                      onClick={() => handleRetryFailedTransaction(tx.id)}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors"
                    >
                      Retry
                    </button>
                  ) : (
                    <select
                      value={tx.status}
                      onChange={(e) => handleStatusUpdate(tx.id, e.target.value as Transaction['status'])}
                      className="bg-background-light border border-border rounded px-2 py-1"
                      disabled={tx.status === 'completed' || tx.status === 'failed'}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Complete</option>
                      <option value="failed">Fail</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionMonitor;

  const handleRetryFailedTransaction = async (transactionId: string) => {
    try {
      await adminService.retryTransaction(transactionId);
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === transactionId ? { ...tx, status: 'pending' } : tx
        )
      );
      toast.success('Transaction retry initiated');
    } catch (error) {
      toast.error('Failed to retry transaction');
      console.error('Error retrying transaction:', error);
    }
  };