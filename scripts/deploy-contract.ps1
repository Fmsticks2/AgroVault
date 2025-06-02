# AgroVault Smart Contract Deployment Script
# This script builds and deploys the Marketplace smart contract to Aleo testnet

Param(
    [string]$PrivateKey = "",
    [string]$Network = "testnet3"
)

Write-Host "Deploying AgroVault Marketplace Smart Contract..." -ForegroundColor Green

# Navigate to contracts directory
Set-Location "$PSScriptRoot\..\backend\contracts"

# Check if Aleo CLI is available
if (!(Get-Command aleo -ErrorAction SilentlyContinue)) {
    Write-Host "Aleo CLI not found. Please run setup-aleo.ps1 first." -ForegroundColor Red
    exit 1
}

# Get private key from parameter or prompt
if ([string]::IsNullOrEmpty($PrivateKey)) {
    if (Test-Path "account-info.txt") {
        Write-Host "Reading private key from account-info.txt..." -ForegroundColor Yellow
        $accountInfo = Get-Content "account-info.txt"
        $privateKeyLine = $accountInfo | Where-Object { $_ -like "*Private Key*" }
        if ($privateKeyLine) {
            $PrivateKey = ($privateKeyLine -split ":")[1].Trim()
        }
    }
    
    if ([string]::IsNullOrEmpty($PrivateKey)) {
        $PrivateKey = Read-Host "Enter your Aleo private key"
    }
}

# Validate private key format
if ($PrivateKey -notmatch "^APrivateKey1[a-zA-Z0-9]+$") {
    Write-Host "Invalid private key format. Please check your private key." -ForegroundColor Red
    exit 1
}

# Check if Leo program exists
if (!(Test-Path "Marketplace.leo")) {
    Write-Host "Marketplace.leo not found in current directory." -ForegroundColor Red
    exit 1
}

Write-Host "Building the smart contract..." -ForegroundColor Yellow

# Build the program
try {
    $buildOutput = aleo build 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed:" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
        exit 1
    }
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host $buildOutput -ForegroundColor Cyan
} catch {
    Write-Host "Build error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying to $Network..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Yellow

# Deploy the program
try {
    $deployOutput = aleo deploy --network $Network --private-key $PrivateKey 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Deployment failed:" -ForegroundColor Red
        Write-Host $deployOutput -ForegroundColor Red
        
        # Check for common errors
        if ($deployOutput -like "*insufficient*credits*") {
            Write-Host "Insufficient credits. Please fund your account at: https://faucet.aleo.org/" -ForegroundColor Yellow
        } elseif ($deployOutput -like "*already*exists*") {
            Write-Host "Program already exists on the network." -ForegroundColor Yellow
        }
        exit 1
    }
    
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host $deployOutput -ForegroundColor Cyan
    
    # Extract program ID from output
    $programIdLine = $deployOutput | Where-Object { $_ -like "*program*id*" -or $_ -like "*marketplace.aleo*" }
    if ($programIdLine) {
        Write-Host "Program ID: marketplace.aleo" -ForegroundColor Green
    }
    
    # Save deployment info
    $deploymentInfo = @"
Deployment Information
=====================
Network: $Network
Program ID: marketplace.aleo
Deployment Time: $(Get-Date)
Private Key: $PrivateKey

Deployment Output:
$deployOutput
"@
    
    $deploymentInfo | Out-File -FilePath "deployment-info.txt" -Encoding UTF8
    Write-Host "Deployment information saved to deployment-info.txt" -ForegroundColor Green
    
} catch {
    Write-Host "Deployment error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Smart contract deployment completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Update your frontend .env with VITE_ALEO_PROGRAM_ID=marketplace.aleo" -ForegroundColor White
Write-Host "2. Update your backend .env with ALEO_PROGRAM_ID=marketplace.aleo" -ForegroundColor White
Write-Host "3. Test the contract functions using the Aleo SDK" -ForegroundColor White

# Test basic contract function (optional)
$testChoice = Read-Host "Would you like to test the contract? (y/n)"
if ($testChoice -eq "y" -or $testChoice -eq "Y") {
    Write-Host "Testing contract..." -ForegroundColor Yellow
    
    # Test with sample data
    try {
        $testOutput = aleo execute create_product "apple" "fresh_apple" "100u64" "fruit" "10u64" "2024" "organic" --private-key $PrivateKey --network $Network 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Contract test successful!" -ForegroundColor Green
            Write-Host $testOutput -ForegroundColor Cyan
        } else {
            Write-Host "Contract test failed:" -ForegroundColor Yellow
            Write-Host $testOutput -ForegroundColor Red
        }
    } catch {
        Write-Host "Test error: $_" -ForegroundColor Yellow
    }
}

Write-Host "Deployment script completed!" -ForegroundColor Green