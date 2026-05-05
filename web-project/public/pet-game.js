const petWalletButton = document.getElementById('petWalletButton');
const petWalletStatus = document.getElementById('petWalletStatus');
const burnContractAddressInput = document.getElementById('burnContractAddressInput');
const petNameInput = document.getElementById('petNameInput');
const savePetNameButton = document.getElementById('savePetNameButton');
const polygonPet = document.getElementById('polygonPet');
const customPet = document.getElementById('customPet');
const petAccessoryLayer = document.getElementById('petAccessoryLayer');
const petMood = document.getElementById('petMood');
const hungerMeter = document.getElementById('hungerMeter');
const happinessMeter = document.getElementById('happinessMeter');
const energyMeter = document.getElementById('energyMeter');
const restButton = document.getElementById('restButton');
const shopGrid = document.getElementById('shopGrid');

const stateKey = 'cryptoPetState';
const weiPerEth = 1000000000000000000n;
const decayIntervalMs = 15000;
const dialogIntervalMs = 12000;
const idleDialog = [
    'I wonder what block number it is.',
    'A snack would be excellent.',
    'My polygon edges feel shiny today.',
    'I am practicing my tiny dashboard stare.',
    'Maybe the next accessory is the one.',
    'I can hear MetaMask thinking.',
];
const hungryDialog = [
    'Food thoughts are getting louder.',
    'I could absolutely demolish a pixel snack.',
    'My hunger bar is making dramatic choices.',
];
const tiredDialog = [
    'A rest would hit perfectly right now.',
    'My energy is buffering.',
    'Low battery polygon mode activated.',
];
const lonelyDialog = [
    'An accessory would cheer me up.',
    'I am accepting compliments and shop items.',
    'A little attention would be nice.',
];

let walletAddress = '';
let currentChainId = '';
let petState = loadPetState();

function loadPetState() {
    const saved = JSON.parse(localStorage.getItem(stateKey) || '{}');

    return {
        name: saved.name || 'Pixel',
        hunger: Number.isFinite(saved.hunger) ? saved.hunger : 72,
        happiness: Number.isFinite(saved.happiness) ? saved.happiness : 66,
        energy: Number.isFinite(saved.energy) ? saved.energy : 81,
        petImage: saved.petImage || '',
        accessoryImage: saved.accessoryImage || '',
        polygon: saved.polygon || randomPolygon(),
        owned: Array.isArray(saved.owned) ? saved.owned : [],
        burnContractAddress: saved.burnContractAddress || saved.merchantAddress || '',
        lastUpdatedAt: Number.isFinite(saved.lastUpdatedAt) ? saved.lastUpdatedAt : Date.now(),
    };
}

function savePetState() {
    localStorage.setItem(stateKey, JSON.stringify(petState));
}

function randomPolygon() {
    const points = [];
    const sides = 7 + Math.floor(Math.random() * 5);

    for (let index = 0; index < sides; index += 1) {
        const angle = (Math.PI * 2 * index) / sides;
        const radius = 34 + Math.random() * 16;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    }

    return {
        clipPath: `polygon(${points.join(', ')})`,
        hue: Math.floor(Math.random() * 360),
    };
}

function clampStat(value) {
    return Math.max(0, Math.min(100, value));
}

function applyEffect(effect = {}) {
    petState.hunger = clampStat(petState.hunger + (effect.hunger || 0));
    petState.happiness = clampStat(petState.happiness + (effect.happiness || 0));
    petState.energy = clampStat(petState.energy + (effect.energy || 0));
    petState.lastUpdatedAt = Date.now();
    savePetState();
    renderPet();
}

function applyTimeDecay() {
    const now = Date.now();
    const elapsedIntervals = Math.floor((now - petState.lastUpdatedAt) / decayIntervalMs);

    if (elapsedIntervals <= 0) {
        return false;
    }

    petState.hunger = clampStat(petState.hunger - elapsedIntervals * 2);
    petState.happiness = clampStat(petState.happiness - elapsedIntervals);
    petState.energy = clampStat(petState.energy - elapsedIntervals);
    petState.lastUpdatedAt += elapsedIntervals * decayIntervalMs;
    savePetState();
    renderPet();

    return true;
}

function shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function ethToWeiHex(ethAmount) {
    const [whole = '0', fraction = ''] = ethAmount.split('.');
    const paddedFraction = fraction.padEnd(18, '0').slice(0, 18);
    const wei = BigInt(whole) * weiPerEth + BigInt(paddedFraction || '0');

    return `0x${wei.toString(16)}`;
}

function isAddress(value) {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function readableWalletError(error) {
    if (error && error.code === 4001) {
        return 'Purchase was cancelled in MetaMask.';
    }

    if (error && error.message) {
        return error.message;
    }

    return 'Purchase failed.';
}

async function hasContractCode(address) {
    const code = await window.ethereum.request({
        method: 'eth_getCode',
        params: [address, 'latest'],
    });

    return code && code !== '0x';
}

function stringToHex(value) {
    return Array.from(new TextEncoder().encode(value))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

function moodText() {
    const average = Math.round((petState.hunger + petState.happiness + petState.energy) / 3);

    if (average >= 80) {
        return `${petState.name} is thriving.`;
    }

    if (petState.hunger < 35) {
        return `${petState.name} is hungry.`;
    }

    if (petState.energy < 35) {
        return `${petState.name} needs a nap.`;
    }

    if (petState.happiness < 35) {
        return `${petState.name} wants attention.`;
    }

    return `${petState.name} is curious.`;
}

function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function dialogText() {
    if (petState.hunger < 35) {
        return randomFrom(hungryDialog);
    }

    if (petState.energy < 35) {
        return randomFrom(tiredDialog);
    }

    if (petState.happiness < 35) {
        return randomFrom(lonelyDialog);
    }

    return randomFrom(idleDialog);
}

function showRandomDialog() {
    petMood.textContent = dialogText();
}

function renderPet() {
    petNameInput.value = petState.name;
    burnContractAddressInput.value = petState.burnContractAddress;
    hungerMeter.value = petState.hunger;
    happinessMeter.value = petState.happiness;
    energyMeter.value = petState.energy;
    petMood.textContent = moodText();

    polygonPet.style.clipPath = petState.polygon.clipPath;
    polygonPet.style.background = `linear-gradient(135deg, hsl(${petState.polygon.hue} 82% 58%), hsl(${(petState.polygon.hue + 64) % 360} 78% 48%))`;

    customPet.src = petState.petImage;
    customPet.hidden = !petState.petImage;
    polygonPet.hidden = Boolean(petState.petImage);

    petAccessoryLayer.innerHTML = '';

    if (petState.accessoryImage) {
        const accessory = document.createElement('img');
        accessory.src = petState.accessoryImage;
        accessory.alt = '';
        petAccessoryLayer.appendChild(accessory);
    }
}

function renderShop(items) {
    shopGrid.innerHTML = '';

    items.forEach((item) => {
        const card = document.createElement('article');
        const preview = document.createElement('div');
        const title = document.createElement('h3');
        const type = document.createElement('span');
        const price = document.createElement('strong');
        const buyButton = document.createElement('button');

        card.className = 'shop-item';
        preview.className = 'shop-preview';
        type.className = 'shop-type';

        if (item.src) {
            const image = document.createElement('img');
            image.src = item.src;
            image.alt = '';
            preview.appendChild(image);
        } else {
            preview.textContent = item.type === 'food' ? 'Food' : 'Pet';
        }

        title.textContent = item.name;
        type.textContent = item.type;
        price.textContent = `${item.priceEth} native`;
        buyButton.type = 'button';
        buyButton.textContent = petState.owned.includes(item.id) ? 'Buy again' : 'Buy';

        buyButton.addEventListener('click', () => buyOrUseItem(item));
        card.append(preview, type, title, price, buyButton);
        shopGrid.appendChild(card);
    });
}

async function connectWallet() {
    if (!window.ethereum) {
        petWalletStatus.textContent = 'MetaMask is not installed in this browser.';
        return;
    }

    try {
        petWalletStatus.textContent = 'Waiting for MetaMask approval...';
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        walletAddress = accounts[0];
        petWalletButton.textContent = 'Wallet connected';
        petWalletStatus.textContent = `Connected to ${shortenAddress(walletAddress)} on chain ${currentChainId}.`;
    } catch (error) {
        petWalletStatus.textContent = 'Wallet connection was cancelled or failed.';
    }
}

async function buyOrUseItem(item) {
    if (!walletAddress) {
        await connectWallet();
    }

    const burnContractAddress = burnContractAddressInput.value.trim();

    if (!isAddress(burnContractAddress)) {
        petWalletStatus.textContent = 'Add a valid burn contract address before buying.';
        burnContractAddressInput.focus();
        return;
    }

    if (burnContractAddress.toLowerCase() === walletAddress.toLowerCase()) {
        petWalletStatus.textContent = 'Use the deployed burn contract address, not your wallet address.';
        return;
    }

    try {
        const isContract = await hasContractCode(burnContractAddress);

        if (!isContract) {
            petWalletStatus.textContent = 'No contract found at that address on the current MetaMask network.';
            return;
        }

        petWalletStatus.textContent = 'Confirm the burn purchase in MetaMask.';
        const transactionHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: walletAddress,
                to: burnContractAddress,
                value: ethToWeiHex(item.priceEth),
                data: `0x${stringToHex(`pet-shop:${item.id}`)}`,
            }],
        });

        if (!petState.owned.includes(item.id)) {
            petState.owned.push(item.id);
        }

        petState.burnContractAddress = burnContractAddress;
        savePetState();
        useItem(item);
        petWalletStatus.textContent = `Burn purchase confirmed: ${transactionHash.slice(0, 10)}...`;
    } catch (error) {
        petWalletStatus.textContent = readableWalletError(error);
    }
}

function useItem(item) {
    if (item.type === 'pet') {
        petState.petImage = item.src || '';
        petState.polygon = randomPolygon();
    }

    if (item.type === 'accessory') {
        petState.accessoryImage = item.src || '';
    }

    applyEffect(item.effect);
        renderShop(window.petShopItems || []);
}

async function loadShopItems() {
    try {
        const response = await fetch('/api/pet-assets');
        const assets = await response.json();
        const assetItems = [
            ...(assets.defaults || []),
            ...(assets.food || []),
            ...(assets.accessories || []),
            ...(assets.pets || []),
        ];

        window.petShopItems = assetItems;
        renderShop(window.petShopItems);
    } catch (error) {
        window.petShopItems = [];
        renderShop([]);
    }
}

petWalletButton.addEventListener('click', connectWallet);

savePetNameButton.addEventListener('click', () => {
    petState.name = petNameInput.value.trim() || 'Pixel';
    savePetState();
    renderPet();
});

burnContractAddressInput.addEventListener('change', () => {
    petState.burnContractAddress = burnContractAddressInput.value.trim();
    savePetState();
});

restButton.addEventListener('click', () => applyEffect({ energy: 16, hunger: -4, happiness: -1 }));

if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        walletAddress = accounts[0] || '';
        petWalletButton.textContent = walletAddress ? 'Wallet connected' : 'Connect MetaMask';
        petWalletStatus.textContent = walletAddress ? `Connected to ${shortenAddress(walletAddress)}.` : 'MetaMask disconnected.';
    });

    window.ethereum.on('chainChanged', (chainId) => {
        currentChainId = chainId;
        petWalletStatus.textContent = walletAddress ? `Connected to ${shortenAddress(walletAddress)} on chain ${chainId}.` : 'Network changed.';
    });
}

applyTimeDecay();
renderPet();
loadShopItems();

setInterval(applyTimeDecay, decayIntervalMs);
setInterval(showRandomDialog, dialogIntervalMs);
