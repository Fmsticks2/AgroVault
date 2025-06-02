# AgroVault - Decentralized Agricultural Marketplace

## Overview
AgroVault is a decentralized platform built on the Aleo blockchain that connects farmers, traders, and consumers in a secure and transparent agricultural marketplace. The platform leverages zero-knowledge proofs for privacy-preserving transactions while maintaining transparency where needed.

## Features
- **Decentralized Marketplace**: Buy and sell agricultural products with privacy-preserving transactions
- **Product Ownership Verification**: Track and verify product ownership using blockchain technology
- **Live Crypto Prices**: Real-time tracking of cryptocurrency prices including Aleo tokens
- **Wallet Integration**: Secure connection with Aleo-compatible wallets
- **Smart Contract Security**: Automated and secure transaction handling

## Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS
- Blockchain: Aleo Network
- Smart Contracts: Leo Programming Language

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Aleo Wallet Browser Extension

## Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/agrovault.git
cd agrovault
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a .env file and add necessary environment variables
```env
VITE_SOME_KEY=your_key_here
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Smart Contract Structure
The marketplace smart contract (`Marketplace.leo`) handles:
- Product listing and management
- Secure transactions between buyers and sellers
- Category-based product organization
- Recent purchase tracking

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Security
- All transactions are secured using Aleo's zero-knowledge proof technology
- Smart contracts are audited for security vulnerabilities
- Private data remains encrypted on-chain

## Support
For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments
- Aleo Network for providing the privacy-focused blockchain infrastructure
- The open-source community for various tools and libraries used in this project
