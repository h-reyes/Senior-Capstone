# Crypto Pet Banking App

This is a senior capstone web project built with Express, MetaMask, and Hardhat. It includes a basic account portal, a wallet dashboard, and a crypto pet mini game where shop purchases are sent to a burn contract.

## Features

- Express server with separate route files
- Login, signup, dashboard, and pet game pages
- MetaMask wallet connection
- Wallet balance and explorer links
- Crypto pet with hunger, happiness, and energy stats
- Pet stats drain over time
- Rest is the only free pet action
- Food, accessories, and pet customization items are purchased through MetaMask
- Burn vault smart contract that permanently locks sent native-chain currency
- Drop-in pet shop asset folders for custom images

## Requirements

- Node.js
- npm
- MetaMask browser extension
- Sepolia test ETH for contract deployment and test purchases

## Install

```powershell
npm install
```

## Run the Web App

```powershell
npm start
```

The app starts at:

```text
http://localhost:5000
```

If another server is already using that port, run with a different port:

```powershell
$env:PORT='3002'; npm start
```

## Test Login

Use the seeded test account:

```text
Email: user@example.com
Password: password123
```

## Main Pages

- `/` - home page
- `/login` - login page
- `/signup` - signup page
- `/dashboard` - wallet dashboard
- `/pet` - crypto pet game

## Smart Contract

The burn contract is:

```text
contracts/PetBurnVault.sol
```

It accepts native-chain payments and has no owner or withdrawal function. Funds sent to it are intentionally locked.

Compile the contract:

```powershell
npm run compile
```

Deploy to Sepolia:

```powershell
npm run deploy:sepolia
```

After deployment, Hardhat prints the contract address and saves it to:

```text
deployments/sepolia/PetBurnVault.json
```

Copy the deployed address into the pet page's burn contract address field.

## Environment Variables

Create `.env` from `.env.example`:

```powershell
copy .env.example .env
```

Required for deploying:

```text
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
DEPLOYER_PRIVATE_KEY=YOUR_TEST_WALLET_PRIVATE_KEY
```

Use a test wallet. Do not use a wallet that holds important real funds.

## Pet Shop Assets

Custom shop images go here:

```text
public/assets/pet/food
public/assets/pet/accessories
public/assets/pet/pets
```

The default shop items live in:

```text
public/assets/pet/shop-items.json
```

Food with `extraordinary` in the filename gets stronger default hunger effects than regular food.

You can adjust item potency with filename tags:

```text
Extraordinary_Kibble_hunger50_energy-12_happiness6_price0.0002.png
```

Or use a sidecar JSON file:

```text
Extraordinary_Kibble.png
Extraordinary_Kibble.json
```

```json
{
  "name": "Extraordinary Kibble",
  "priceEth": "0.0002",
  "effect": {
    "hunger": 50,
    "happiness": 6,
    "energy": -12
  }
}
```

More asset notes are in:

```text
public/assets/pet/README.md
```

## Safety Notes

- Test on Sepolia before using any real network.
- Purchases sent to `PetBurnVault` cannot be recovered.
- Never commit `.env` or private keys.
- Make sure MetaMask is on the same network where the burn contract was deployed.

