import React, { useState } from "react";
import { getWallet, WalletType } from "../services/aleoWalletService";

// Add category to Product interface
interface Product {
  id: number;
  owner: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_listed: boolean;
}

const mockProducts: Product[] = [
  { id: 0, owner: "aleo1...abc", name: "Maize", description: "Fresh maize from farm", price: 10, category: "Cereals", is_listed: true },
  { id: 1, owner: "aleo1...xyz", name: "Wheat", description: "Organic wheat", price: 15, category: "Cereals", is_listed: true },
];

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [address, setAddress] = useState<string>("");
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  const connectWallet = async (type: WalletType) => {
    setWalletType(type);
    try {
      const wallet = getWallet(type);
      const addr = await wallet.connect();
      setAddress(addr);
    } catch (e) {
      alert("Wallet connection failed: " + e);
    }
  };

  const handleListProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrate with LEO contract add_product logic
    // For now, just add to local state
    setProducts([
      ...products,
      {
        id: products.length,
        owner: address || "aleo1...mock",
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        is_listed: true,
      },
    ]);
    setNewProduct({ name: "", description: "", price: "" });
    setLoading(false);
  };

  const categories = ["Cereals", "Vegetables", "Fruits", "Others"];
  const [cart, setCart] = useState<Product[]>([]);
  const [recentlyBought, setRecentlyBought] = useState<Product[]>([]);
  
  const addToCart = (product: Product) => {
    if (!cart.find(p => p.id === product.id)) {
      setCart([...cart, product]);
    }
  };
  
  const handleBuy = async (product: Product) => {
    setLoading(true);
    // TODO: Integrate with LEO contract buy_product logic and wallet signing
    setRecentlyBought([product, ...recentlyBought.filter(p => p.id !== product.id)].slice(0, 5));
    setCart(cart.filter(p => p.id !== product.id));
    alert(`Buying product: ${product.name} (mock)`);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {products.slice(0, 6).map(product => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="font-bold text-primary mb-1">{product.name}</div>
            <div className="text-sm mb-1">{product.description}</div>
            <div className="text-sm mb-2">Price: <span className="font-semibold">{product.price} credits</span></div>
            <div className="text-xs mb-2">Owner: {product.owner}</div>
            <button className="btn btn-primary mr-2" onClick={() => addToCart(product)} disabled={loading || !address || Boolean(cart.find(p => p.id === product.id))}>Add to Cart</button>
            <button className="btn btn-success" onClick={() => handleBuy(product)} disabled={loading || !address}>Buy</button>
          </div>
        ))}
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
        <span className="mb-2 md:mb-0">Wallet: {address ? address : "Not connected"}</span>
        <button className="btn btn-primary mr-2" onClick={() => connectWallet("LEO")}>Connect LEO Wallet</button>
        <button className="btn btn-secondary" onClick={() => connectWallet("Puzzle")}>Connect Puzzle Wallet</button>
        <div className="ml-auto flex items-center">
          <div className="relative">
            <button className="btn btn-outline btn-info flex items-center">
              Cart <span className="ml-1">({cart.length})</span>
            </button>
            {cart.length > 0 && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
                <div className="p-2 font-semibold border-b">Cart Items</div>
                {cart.map(item => (
                  <div key={item.id} className="p-2 border-b last:border-b-0 flex justify-between items-center">
                    <span>{item.name}</span>
                    <button className="btn btn-xs btn-success ml-2" onClick={() => handleBuy(item)} disabled={loading || !address}>Buy</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <form className="mb-6 bg-background-light p-4 rounded-lg" onSubmit={handleListProduct}>
        <h2 className="text-lg font-semibold mb-2">List a New Product</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            className="input mb-2 md:mb-0"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <input
            className="input mb-2 md:mb-0"
            placeholder="Description"
            value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          />
          <input
            className="input mb-2 md:mb-0"
            placeholder="Price"
            type="number"
            min="0"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <select
            className="input mb-2 md:mb-0"
            value={newProduct.category || categories[0]}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="btn btn-success" type="submit" disabled={loading}>List</button>
        </div>
      </form>
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Recently Bought</h2>
          {recentlyBought.length === 0 ? (
            <div className="text-gray-500">No recent purchases.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recentlyBought.map(product => (
                <div key={product.id} className="border rounded p-2 bg-gray-50 text-xs">
                  <div className="font-bold text-primary">{product.name}</div>
                  <div>Price: {product.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat} className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{cat}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="font-semibold text-primary mb-2">{cat}</h3>
              {products.filter(p => p.category === cat && p.is_listed).length === 0 ? (
                <div className="text-gray-400 text-xs mb-2">No products in this category.</div>
              ) : (
                products.filter(p => p.category === cat && p.is_listed).map(product => (
                  <div key={product.id} className="border rounded-lg p-4 bg-white shadow mb-2">
                    <div className="font-bold text-primary mb-1">{product.name}</div>
                    <div className="text-sm mb-1">{product.description}</div>
                    <div className="text-sm mb-2">Price: <span className="font-semibold">{product.price} credits</span></div>
                    <div className="text-xs mb-2">Owner: {product.owner}</div>
                    <button className="btn btn-primary mr-2" onClick={() => addToCart(product)} disabled={loading || !address || cart.find(p => p.id === product.id)}>Add to Cart</button>
                    <button className="btn btn-success" onClick={() => handleBuy(product)} disabled={loading || !address}>Buy</button>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
      {loading && <div className="mt-4 text-blue-500">Processing...</div>}
    </div>
  );
};

export default Marketplace;