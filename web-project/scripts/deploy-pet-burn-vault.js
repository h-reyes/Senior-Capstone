const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

async function main() {
    const PetBurnVault = await hre.ethers.getContractFactory('PetBurnVault');
    const petBurnVault = await PetBurnVault.deploy();

    await petBurnVault.deployed();

    const networkName = hre.network.name;
    const deployment = {
        contract: 'PetBurnVault',
        address: petBurnVault.address,
        network: networkName,
        deployedAt: new Date().toISOString(),
    };
    const deploymentDir = path.resolve(__dirname, '..', 'deployments', networkName);
    const deploymentPath = path.join(deploymentDir, 'PetBurnVault.json');

    fs.mkdirSync(deploymentDir, { recursive: true });
    fs.writeFileSync(deploymentPath, `${JSON.stringify(deployment, null, 2)}\n`);

    console.log('');
    console.log('============================================================');
    console.log(' PetBurnVault deployed');
    console.log(` Network: ${networkName}`);
    console.log(` Address: ${petBurnVault.address}`);
    console.log(` Saved:   ${deploymentPath}`);
    console.log('============================================================');
    console.log('');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
