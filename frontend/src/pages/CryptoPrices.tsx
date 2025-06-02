import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
}

const CryptoPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPrices = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: false,
            locale: 'en'
          }
        }
      );
      setPrices(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cryptocurrency prices. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredPrices = prices.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mt-20">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold">Live Crypto Prices</h1>
          <div className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or symbol..."
                className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="p-4 text-left font-medium">Asset</th>
                <th className="p-4 text-right font-medium">Price</th>
                <th className="p-4 text-right font-medium">24h Change</th>
                <th className="p-4 text-right font-medium">24h Volume</th>
                <th className="p-4 text-right font-medium">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPrices.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-sm text-gray-400 uppercase">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-white">
                    ${crypto.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td
                    className={`p-4 text-right font-medium ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                      <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-white">
                    ${crypto.total_volume.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-medium text-white">
                    ${crypto.market_cap.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CryptoPrices;