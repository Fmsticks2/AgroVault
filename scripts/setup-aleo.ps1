# AgroVault Aleo Setup Script
# This script installs Aleo CLI and sets up the development environment

Write-Host "Setting up Aleo development environment..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires administrator privileges. Please run as administrator." -ForegroundColor Red
    exit 1
}

# Install Chocolatey if not present
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install Git if not present
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Git..." -ForegroundColor Yellow
    choco install git -y
}

# Install Rust if not present
if (!(Get-Command rustc -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Rust..." -ForegroundColor Yellow
    
    # Download and install Rust
    $rustInstaller = "$env:TEMP\rustup-init.exe"
    Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile $rustInstaller
    Start-Process -FilePath $rustInstaller -ArgumentList "-y" -Wait
    
    # Add Rust to PATH for current session
    $env:PATH += ";$env:USERPROFILE\.cargo\bin"
}

# Refresh environment variables
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

# Install Aleo CLI
Write-Host "Installing Aleo CLI..." -ForegroundColor Yellow
try {
    # Install via cargo
    cargo install aleo
    
    # Verify installation
    aleo --version
    Write-Host "Aleo CLI installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to install Aleo CLI via cargo. Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Download pre-built binary
    $aleoUrl = "https://github.com/AleoHQ/aleo/releases/latest/download/aleo-windows.zip"
    $aleoZip = "$env:TEMP\aleo-windows.zip"
    $aleoDir = "$env:USERPROFILE\.aleo"
    
    # Create Aleo directory
    New-Item -ItemType Directory -Force -Path $aleoDir
    
    # Download and extract
    Invoke-WebRequest -Uri $aleoUrl -OutFile $aleoZip
    Expand-Archive -Path $aleoZip -DestinationPath $aleoDir -Force
    
    # Add to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$aleoDir*") {
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$aleoDir", "User")
        $env:PATH += ";$aleoDir"
    }
    
    Write-Host "Aleo CLI installed via binary download!" -ForegroundColor Green
}

# Create Aleo account
Write-Host "Creating new Aleo account..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\backend\contracts"

# Generate new account
$accountOutput = aleo account new
Write-Host "New Aleo Account Created:" -ForegroundColor Green
Write-Host $accountOutput -ForegroundColor Cyan

# Save account info to file
$accountOutput | Out-File -FilePath "account-info.txt" -Encoding UTF8
Write-Host "Account information saved to account-info.txt" -ForegroundColor Green

# Extract private key for environment setup
$privateKeyLine = $accountOutput | Select-String "Private Key"
if ($privateKeyLine) {
    $privateKey = $privateKeyLine.Line.Split(" ")[-1].Trim()
    Write-Host "Private Key: $privateKey" -ForegroundColor Yellow
} else {
    Write-Host "Warning: Could not extract private key from output. Please check account-info.txt file." -ForegroundColor Yellow
    $privateKey = "Check account-info.txt file"
}

Write-Host "Setup completed! Next steps:" -ForegroundColor Green
Write-Host "1. Fund your account at: https://faucet.aleo.org/" -ForegroundColor White
Write-Host "2. Update your .env files with the private key" -ForegroundColor White
Write-Host "3. Run deploy-contract.ps1 to deploy the smart contract" -ForegroundColor White