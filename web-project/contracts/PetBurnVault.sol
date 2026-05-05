// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Accepts native-chain pet shop payments and permanently locks them.
/// @dev There is intentionally no owner and no withdrawal function.
contract PetBurnVault {
    event PetPurchaseBurned(
        address indexed buyer,
        uint256 amount,
        bytes purchaseData
    );

    receive() external payable {
        emit PetPurchaseBurned(msg.sender, msg.value, "");
    }

    fallback() external payable {
        emit PetPurchaseBurned(msg.sender, msg.value, msg.data);
    }
}
