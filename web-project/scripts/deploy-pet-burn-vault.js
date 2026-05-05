const hre = require('hardhat');

async function main() {
    const PetBurnVault = await hre.ethers.getContractFactory('PetBurnVault');
    const petBurnVault = await PetBurnVault.deploy();

    await petBurnVault.deployed();

    console.log(`PetBurnVault deployed to: ${petBurnVault.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
