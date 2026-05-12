# Crypto Pet Banking App

Senior capstone web project built with Express, MetaMask, Hardhat, Sequelize, and MySQL. The app includes a basic account portal, a wallet dashboard, and a crypto pet mini game where shop purchases are sent through MetaMask to a deployed burn contract.

MySQL is used only as a record-only audit copy for login activity and pet shop transactions. If MySQL is not configured or is unavailable, the main app still runs.

## Features

- Express web server with separate route files
- Login, signup, logout, dashboard, and pet game pages
- MetaMask wallet connection
- Wallet balance display and explorer links
- Crypto pet with hunger, happiness, and energy stats
- Free rest action
- Pet shop purchases sent through MetaMask
- Sepolia burn vault smart contract
- MySQL audit tables for login events and transaction copies
- Drop-in pet shop image folders and manifest-based shop items

## Requirements

- Node.js and npm
- MySQL Server running locally
- MetaMask browser extension
- Sepolia test ETH for contract deployment and test purchases
- Alchemy or Infura Sepolia RPC URL

## 1. Install Dependencies

From the `web-project` folder:

```powershell
npm install
```

This installs Express, Sequelize, MySQL support, Hardhat, and Ethers.

## 2. Create the Environment File

Create `.env` from `.env.example`:

```powershell
copy .env.example .env
```

Example local `.env`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
DEPLOYER_PRIVATE_KEY=YOUR_TEST_WALLET_PRIVATE_KEY

DB_NAME=webapp
DB_USER=root
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=3306
```

Use a test wallet only. Never commit `.env`, private keys, or funded wallet credentials.

## 3. Set Up MySQL

Start your local MySQL server, then create the database:

```sql
CREATE DATABASE webapp;
```

If you use a different database name, update `DB_NAME` in `.env`.

The app creates these tables automatically on startup:

```text
login_events
transaction_copies
```

MySQL records only copies of activity. It does not replace the existing login/session behavior or pet state.

## 4. Start the Local App

```powershell
npm start
```

The app runs at:

```text
http://localhost:5000
```

Expected successful startup:

```text
MySQL audit copy connected.
Server running at http://localhost:5000
```

If MySQL is missing or misconfigured, the app still starts and shows a warning that SQL recording is disabled.

To use another port:

```powershell
$env:PORT='3002'; npm start
```

## 5. Log In Locally

Seeded test account:

```text
Email: user@example.com
Password: password123
```

Main routes:

```text
/          Home
/login     Login
/signup    Signup
/dashboard Wallet dashboard
/pet       Crypto pet game
```

## 6. Deploy the Burn Contract

Compile:

```powershell
npm run compile
```

Deploy to Sepolia:

```powershell
npm run deploy:sepolia
```

Deployment output is saved to:

```text
deployments/sepolia/PetBurnVault.json
```

Copy the deployed contract address into the burn contract address field on the pet page. Make sure MetaMask is connected to Sepolia before buying pet shop items.

## 7. How SQL Recording Works

Login records are written when:

- a login succeeds
- a login fails
- a signup succeeds
- a logout occurs

Transaction records are written after MetaMask returns a transaction hash for a pet shop purchase.

The transaction copy includes:

- logged-in email
- wallet address
- burn contract address
- chain ID
- transaction hash
- item ID, name, type, and price

If a SQL insert fails, the app continues. For example, a MetaMask transaction can still complete even if MySQL recording fails.

## 8. Pet Shop Assets

Manifest items live here:

```text
public/assets/pet/shop-items.json
```

Image folders:

```text
public/assets/pet/food
public/assets/pet/accessories
public/assets/pet/pets
```

`Extraordinary_Kibble.png` is configured in `shop-items.json`, including its price and stat effects.

Example item:

```json
{
  "id": "food-Extraordinary_Kibble.png",
  "type": "food",
  "name": "Extraordinary Kibble",
  "src": "/assets/pet/food/Extraordinary_Kibble.png",
  "priceEth": "0.0002",
  "effect": {
    "hunger": 45,
    "happiness": 6,
    "energy": -12
  }
}
```

More asset notes are in:

```text
public/assets/pet/README.md
```

## Troubleshooting

If the server says MySQL recording is disabled, check that `DB_NAME`, `DB_USER`, and `DB_HOST` are set in `.env`.

If MySQL connection fails, confirm MySQL is running and the database exists:

```sql
SHOW DATABASES;
```

If MetaMask purchases fail, confirm:

- MetaMask is installed
- MetaMask is on Sepolia
- the burn contract address is deployed on Sepolia
- the wallet has Sepolia test ETH

## Safety Notes

- Test on Sepolia only for development.
- Funds sent to `PetBurnVault` are intentionally locked and cannot be withdrawn.
- Do not use a wallet with real funds for development.
- Rotate any private key that has been shared, committed, or exposed.
