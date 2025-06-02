# AgroVault Deployment Guide

This guide covers deploying the AgroVault platform across three environments:
- **Frontend**: Vercel
- **Backend**: Render
- **Smart Contracts**: Aleo Testnet

## Prerequisites

1. **Aleo CLI**: Install the latest Aleo CLI
   ```bash
   curl -L https://raw.githubusercontent.com/AleoHQ/aleo/testnet3/scripts/install.sh | bash
   ```

2. **Node.js**: Version 18+ required
3. **Git**: For version control
4. **Accounts**:
   - Vercel account
   - Render account
   - Aleo testnet credits

## 1. Smart Contract Deployment (Aleo Testnet)

### Step 1: Generate Aleo Account
```bash
# Navigate to contracts directory
cd backend/contracts

# Generate a new account
aleo account new

# Save the output - you'll need:
# - Private Key
# - View Key
# - Address
```

### Step 2: Fund Your Account
1. Visit [Aleo Testnet Faucet](https://faucet.aleo.org/)
2. Enter your address to receive testnet credits
3. Wait for confirmation

### Step 3: Deploy Smart Contract
```bash
# Build the program
aleo build

# Deploy to testnet
aleo deploy --network testnet3 --private-key YOUR_PRIVATE_KEY

# Note the program ID from deployment output
```

## 2. Backend Deployment (Render)

### Step 1: Prepare Repository
1. Ensure your code is pushed to GitHub
2. Create `.env` file based on `.env.example`

### Step 2: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `agrovault-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty

### Step 3: Environment Variables
Add these environment variables in Render:
```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
CORS_CREDENTIALS=true
ALEO_NETWORK=testnet3
ALEO_PRIVATE_KEY=your_private_key_here
ALEO_PROGRAM_ID=marketplace.aleo
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
LOG_LEVEL=info
```

## 3. Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Update API endpoints to use your Render backend URL
2. Create `.env.local` file based on `.env.example`

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

### Step 3: Environment Variables
Add these environment variables in Vercel:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_API_TIMEOUT=10000
VITE_ALEO_NETWORK=testnet3
VITE_ALEO_PROGRAM_ID=marketplace.aleo
VITE_WALLET_NETWORK=testnet3
VITE_ENABLE_WALLET_ADAPTER=true
VITE_APP_NAME=AgroVault
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_ENABLE_HTTPS=true
```

## 4. Post-Deployment Configuration

### Update CORS Settings
1. Update backend `.env` with actual frontend URL:
   ```
   CORS_ORIGIN=https://your-actual-frontend-url.vercel.app
   ```

### Update Frontend API Configuration
1. Update frontend `.env.local` with actual backend URL:
   ```
   VITE_API_BASE_URL=https://your-actual-backend-url.onrender.com
   ```

### Test Deployment
1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints
3. **Smart Contract**: Test contract interactions

## 5. Monitoring and Maintenance

### Render Monitoring
- Check logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring
- Monitor build logs
- Check Core Web Vitals
- Monitor function execution

### Aleo Network
- Monitor transaction status
- Check program state
- Monitor credit balance

## 6. Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS_ORIGIN matches frontend URL
   - Check credentials setting

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed

3. **Smart Contract Issues**
   - Ensure sufficient credits
   - Verify program syntax
   - Check network connectivity

### Support Resources
- [Aleo Documentation](https://developer.aleo.org/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Security Considerations

1. **Never commit private keys to repository**
2. **Use environment variables for all secrets**
3. **Enable HTTPS in production**
4. **Regularly update dependencies**
5. **Monitor for security vulnerabilities**

## Next Steps

1. Set up CI/CD pipelines
2. Implement monitoring and alerting
3. Configure custom domains
4. Set up database (if needed)
5. Implement backup strategies