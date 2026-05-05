# Deploying the Pet Burn Contract

This project uses Hardhat to compile and deploy `contracts/PetBurnVault.sol`.

## 1. Create `.env`

Copy `.env.example` to `.env`, then fill in the values:

```text
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
DEPLOYER_PRIVATE_KEY=YOUR_TEST_WALLET_PRIVATE_KEY
```

Use a test wallet. Do not use a wallet that holds important real funds.

## 2. Compile

```powershell
npm run compile
```

## 3. Deploy to Sepolia

```powershell
npm run deploy:sepolia
```

Hardhat will print:

```text
PetBurnVault deployed to: 0x...
```

The deploy script also saves the address to:

```text
deployments/sepolia/PetBurnVault.json
```

Copy the printed address into the pet page's burn contract address field.
