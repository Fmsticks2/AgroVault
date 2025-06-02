// Core utility functions for cryptographic operations
import * as bip39 from 'bip39';

// Re-export the generateMnemonic function from bip39
export const generateMnemonic = bip39.generateMnemonic;

// Export other bip39 functions that might be needed
export const validateMnemonic = bip39.validateMnemonic;
export const mnemonicToEntropy = bip39.mnemonicToEntropy;
export const entropyToMnemonic = bip39.entropyToMnemonic;
export const mnemonicToSeedSync = bip39.mnemonicToSeedSync;
export const mnemonicToSeed = bip39.mnemonicToSeed;

// Export the entire bip39 module as well
export { bip39 };