import React, { useEffect, useState } from "react";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
}

const TOKENS = ["bitcoin", "ethereum", "binancecoin", "solana", "cardano", "dogecoin"];

const fetchPrices = async (): Promise<CryptoPrice[]> => {
  const ids = TOKENS.join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch crypto prices");
  return res.json();
};

const CryptoPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPrices = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPrices();
      setPrices(data);
    } catch (err: any) {
      setError(err.message || "Error fetching prices");
    }
    setLoading(false);
  };

  useEffect(() => {
    getPrices();
    const interval = setInterval(getPrices, 15000); // update every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Live Crypto Prices</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && !error && (
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Token</th>
              <th className="py-2 px-4 text-left">Symbol</th>
              <th className="py-2 px-4 text-left">Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((token) => (
              <tr key={token.id} className="border-t">
                <td className="py-2 px-4 flex items-center gap-2">
                  <img src={token.image} alt={token.name} className="w-6 h-6" />
                  {token.name}
                </td>
                <td className="py-2 px-4 uppercase">{token.symbol}</td>
                <td className="py-2 px-4 font-mono">${token.current_price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CryptoPrices;