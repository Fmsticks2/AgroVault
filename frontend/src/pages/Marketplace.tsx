import React, { useState } from "react";
import { useAleoWallet } from "../hooks/useAleoWallet";
import { WalletType } from "../services/aleoWalletService";

const isProductOwner = (product: Product, address: string) => {
  return product.owner.toLowerCase() === address.toLowerCase();
};


interface Product {
  id: number;
  owner: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_listed: boolean;
  quantity: number;
  unit: string;
  harvest_date: string;
  certification: string;
  total_sold: number;
  rating: number;
  location: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuy: (product: Product) => void;
  isOwner: boolean;
  address: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onBuy, isOwner, address }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div className="aspect-square bg-background-light rounded-lg overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-text-secondary">No image available</span>
                </div>
              )}
            </div>
            <div className="bg-background-light rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Location</p>
                  <p className="font-medium">{product.location}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Harvest Date</p>
                  <p className="font-medium">{product.harvest_date}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Certification</p>
                  <p className="font-medium">{product.certification}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-text-secondary">{product.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Price</p>
                <p className="text-2xl font-bold text-primary">${product.price}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Available</p>
                <p className="text-lg font-medium">{product.quantity} {product.unit}</p>
              </div>
            </div>
            
            <div className="bg-background-light rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-text-secondary">Owner</p>
                  <p className="font-medium">{product.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Sold</p>
                  <p className="font-medium">{product.total_sold} {product.unit}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-text-secondary">({product.rating} rating)</span>
                </div>
              </div>
            </div>
            
            {isOwner ? (
              <div className="space-y-4">
                <button className="w-full px-4 py-3 bg-background-light text-text-primary rounded-lg font-medium hover:bg-background-dark transition-colors">
                  Edit Listing
                </button>
                <button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                  Remove Listing
                </button>
              </div>
            ) : (
              <button
                onClick={() => onBuy(product)}
                disabled={!address}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  !address 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-dark text-background-dark'
                }`}
              >
                {!address ? 'Connect Wallet to Buy' : 'Buy Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mockProducts: Product[] = [
  { 
    id: 0, 
    owner: "aleo1...abc", 
    name: "Maize", 
    description: "Fresh maize from farm, high quality and organic. Our maize is carefully cultivated using sustainable farming practices, ensuring the highest quality and nutritional value.", 
    price: 10, 
    category: "Cereals", 
    image: "/products/maize.svg",
    is_listed: true,
    quantity: 1000,
    unit: "kg",
    harvest_date: "2024-02-15",
    certification: "Organic Certified",
    total_sold: 500,
    rating: 4.5,
    location: "Central Valley"
  },
  { 
    id: 1, 
    owner: "aleo1...xyz", 
    name: "Wheat", 
    description: "Premium organic wheat, perfect for baking. Grown in nutrient-rich soil and harvested at peak maturity for optimal quality.", 
    price: 15, 
    category: "Cereals", 
    image: "/products/wheat.svg",
    is_listed: true,
    quantity: 2000,
    unit: "kg",
    harvest_date: "2024-02-10",
    certification: "Non-GMO Verified",
    total_sold: 800,
    rating: 4.8,
    location: "Eastern Plains"
  },
  { 
    id: 2, 
    owner: "aleo1...def", 
    name: "Soybeans", 
    description: "Fresh soybeans, rich in protein. Sustainably grown and harvested using traditional farming methods combined with modern technology.", 
    price: 12, 
    category: "Legumes", 
    image: "/products/soybeans.svg",
    is_listed: true,
    quantity: 1500,
    unit: "kg",
    harvest_date: "2024-02-20",
    certification: "Sustainably Sourced",
    total_sold: 600,
    rating: 4.3,
    location: "River Delta"
  },
  { 
    id: 3, 
    owner: "aleo1...ghi", 
    name: "Rice", 
    description: "Premium quality rice, perfect for any meal. Cultivated in pristine paddy fields with careful attention to water management and soil health.", 
    price: 8, 
    category: "Cereals", 
    image: "/products/rice.svg",
    is_listed: true,
    quantity: 3000,
    unit: "kg",
    harvest_date: "2024-02-12",
    certification: "Premium Grade",
    total_sold: 1200,
    rating: 4.6,
    location: "Coastal Plains"
  },
];

const OwnershipPage: React.FC<{ address: string; products: Product[] }> = ({ address, products }) => {
  const ownedProducts = products.filter(p => p.owner === address);
  
  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Listed Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedProducts.map(product => (
            <div key={product.id} className="bg-background-light rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-background rounded-lg overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-text-secondary">{product.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-text-secondary">Price</p>
                  <p className="font-medium text-primary">${product.price}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Available</p>
                  <p className="font-medium">{product.quantity} {product.unit}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Total Sold</p>
                  <p className="font-medium">{product.total_sold} {product.unit}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Rating</p>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{product.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-background text-text-primary rounded-lg text-sm font-medium hover:bg-background-dark transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {ownedProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">You haven't listed any products yet.</p>
            <button className="mt-4 px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors">
              List Your First Product
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-background rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background-light rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Total Products</p>
            <p className="text-2xl font-bold">{ownedProducts.length}</p>
          </div>
          <div className="bg-background-light rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Total Sales</p>
            <p className="text-2xl font-bold">
              {ownedProducts.reduce((sum, p) => sum + p.total_sold, 0)} units
            </p>
          </div>
          <div className="bg-background-light rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Average Rating</p>
            <p className="text-2xl font-bold">
              {(ownedProducts.reduce((sum, p) => sum + p.rating, 0) / Math.max(ownedProducts.length, 1)).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOwnership, setShowOwnership] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Use our custom hook for wallet functionality
  const {
    walletType,
    address,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    signTransaction,
    sendTransaction
  } = useAleoWallet();

  const handleBuy = async (product: Product) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    try {
      // Create transaction object for the smart contract
      const transaction = {
        functionName: "buy_product",
        inputs: [
          product.id.toString(), // product_id
          "1", // quantity to buy
          product.price.toString(), // price
        ],
      };
      
      // Sign the transaction
      const signedTx = await signTransaction(transaction);
      
      // Send the transaction
      const txId = await sendTransaction(signedTx);
      
      console.log(`Transaction submitted: ${txId}`);
      alert(`Purchase initiated! Transaction ID: ${txId.slice(0, 10)}...`);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert(`Purchase failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Cereals", "Legumes", "Vegetables", "Fruits"];
  
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background-dark p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-background rounded-lg p-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">Agricultural Marketplace</h1>
            <p className="text-gray-600 mb-4">Connect your wallet to start trading agricultural products</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {!isConnected ? (
              <>
                <button 
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-background-dark font-medium transition-all duration-300" 
                  onClick={() => connect("LEO")}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect LEO Wallet'}
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-background-light hover:bg-background text-text-primary font-medium border border-border transition-all duration-300" 
                  onClick={() => connect("Puzzle")}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Puzzle Wallet'}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-background-light p-3 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  {walletType && ` (${walletType})`}
                </span>
                <button
                  onClick={() => setShowOwnership(!showOwnership)}
                  className="px-4 py-2 bg-background-light text-text-primary rounded-lg font-medium hover:bg-background transition-colors"
                >
                  {showOwnership ? 'View Marketplace' : 'My Products'}
                </button>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        {showOwnership && address ? (
          <OwnershipPage address={address} products={products} />
        ) : (
          <>
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-primary text-white' : 'bg-background-light text-text-primary'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
                  <div className="aspect-square bg-background-light flex items-center justify-center p-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-background-light rounded-lg">
                        <span className="text-text-secondary">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">{product.name}</h3>
                      <span className="text-sm font-medium text-primary">${product.price}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Owner: {product.owner.slice(0, 6)}...{product.owner.slice(-4)}</span>
                      <button
                        className={`px-4 py-2 rounded-lg ${!isConnected ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} text-background-dark font-medium transition-all duration-300`}
                        onClick={() => setSelectedProduct(product)}
                        disabled={loading || !isConnected}
                      >
                        {!isConnected ? 'Connect Wallet' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct && (
              <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onBuy={handleBuy}
                isOwner={isProductOwner(selectedProduct, address || '')}
                address={address || ''}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;