# AgroVault - Decentralized Agricultural Finance Platform

![AgroVault Logo](frontend/public/logo.svg)

AgroVault is a comprehensive decentralized platform built on Aleo blockchain that revolutionizes agricultural finance and supply chain management. The platform connects farmers, investors, and consumers through secure, transparent, and efficient blockchain-based solutions.

## 🌟 Features

### Core Functionality
- **Decentralized Marketplace**: Trade agricultural products with smart contract security
- **DeFi Integration**: Staking, lending, and yield farming for agricultural assets
- **Supply Chain Tracking**: Transparent tracking from farm to consumer
- **Governance System**: Community-driven decision making
- **Multi-Wallet Support**: Compatible with various Aleo wallets

### Advanced Features
- **Real-time Analytics**: Market insights and performance metrics
- **Risk Assessment**: AI-powered risk analysis for investments
- **Certification Management**: Digital certificates for organic and quality standards
- **Cross-border Payments**: Seamless international transactions
- **Insurance Integration**: Crop insurance and risk mitigation

## 🏗️ Architecture

### Monorepo Structure
```
AgroVault/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express API server
│   └── contracts/     # Aleo smart contracts
├── scripts/           # Deployment and setup scripts
└── docs/             # Documentation
```

### Technology Stack

**Frontend**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Aleo Wallet Adapter for blockchain integration
- Recharts for data visualization

**Backend**
- Node.js with Express.js
- RESTful API architecture
- CORS and security middleware
- Environment-based configuration

**Blockchain**
- Aleo blockchain for smart contracts
- Leo programming language
- Zero-knowledge proofs for privacy
- Testnet3 for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- PowerShell (for Windows deployment scripts)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AgroVault.git
   cd AgroVault
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local
   
   # Backend
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🌐 Deployment

### Production Deployment

AgroVault is designed for deployment across multiple platforms:

- **Frontend**: Vercel (recommended)
- **Backend**: Render (recommended)
- **Smart Contracts**: Aleo Testnet

### Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

#### Quick Deployment Steps

1. **Deploy Smart Contracts**
   ```powershell
   # Run as Administrator
   .\scripts\setup-aleo.ps1
   .\scripts\deploy-contract.ps1
   ```

2. **Deploy Backend to Render**
   - Connect GitHub repository
   - Set environment variables
   - Deploy with auto-build

3. **Deploy Frontend to Vercel**
   - Import GitHub repository
   - Configure build settings
   - Set environment variables

## 📖 API Documentation

### Backend Endpoints

#### Health Check
```
GET /
Response: { "message": "AgroVault API is running" }
```

#### Authentication
```
POST /auth/login
POST /auth/register
POST /auth/logout
```

#### Marketplace
```
GET    /marketplace/products
POST   /marketplace/products
GET    /marketplace/products/:id
PUT    /marketplace/products/:id
DELETE /marketplace/products/:id
```

#### Transactions
```
GET  /transactions
POST /transactions
```

#### Analytics
```
GET /analytics/dashboard
GET /analytics/market-stats
```

### Smart Contract Functions

#### Marketplace.leo
```leo
// Create a new product listing
create_product(name, description, price, category, quantity, harvest_date, certification)

// Purchase a product
purchase_product(product_id, price)

// Update product status
update_product_status(product_id, is_listed)
```

## 🔧 Development

### Project Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build frontend for production
npm run build:frontend   # Build frontend only

# Installation
npm run install:all      # Install all dependencies
npm run install:frontend # Install frontend dependencies
npm run install:backend  # Install backend dependencies
```

### Environment Variables

#### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ALEO_NETWORK=testnet3
VITE_ALEO_PROGRAM_ID=marketplace.aleo
VITE_WALLET_NETWORK=testnet3
```

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ALEO_NETWORK=testnet3
ALEO_PROGRAM_ID=marketplace.aleo
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend Testing
```bash
cd backend
npm run test
```

### Smart Contract Testing
```bash
cd backend/contracts
aleo test
```

## 🔒 Security

### Security Features
- Zero-knowledge proofs for transaction privacy
- Secure smart contract architecture
- CORS protection
- Input validation and sanitization
- Environment variable protection

### Security Best Practices
- Never commit private keys to repository
- Use environment variables for all secrets
- Regular dependency updates
- Security audits for smart contracts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow commit message conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/AgroVault/issues)
- 💬 [Discussions](https://github.com/yourusername/AgroVault/discussions)

### Resources
- [Aleo Documentation](https://developer.aleo.org/)
- [Leo Language Guide](https://developer.aleo.org/leo/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core marketplace functionality
- ✅ Basic DeFi features
- ✅ Wallet integration
- ✅ Deployment infrastructure

### Phase 2 (Q2 2024)
- 🔄 Advanced analytics
- 🔄 Mobile application
- 🔄 Insurance integration
- 🔄 Multi-language support

### Phase 3 (Q3 2024)
- 📋 Cross-chain integration
- 📋 AI-powered recommendations
- 📋 Advanced governance features
- 📋 Enterprise partnerships

## 📊 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Aleo](https://img.shields.io/badge/blockchain-Aleo-purple)

---

**Built with ❤️ for the agricultural community**

For more information, visit our upcoming page [website](https://agrovault.com) or follow developer on [Twitter](https://twitter.com/web3spida).
