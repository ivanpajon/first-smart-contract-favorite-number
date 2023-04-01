// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

error FavoriteNumber__NumberMustBeLower(uint favoriteNumber);

contract FavoriteNumber {
    struct FavoriteNumberData {
        uint favoriteNumber;
        uint lastUpdate;
    }

    mapping(address => FavoriteNumberData) private s_addressToFavoriteNumberData;

    constructor() { }

    function setFavoriteNumber(uint favoriteNumber) external {
        if (favoriteNumber > 100) {
            revert FavoriteNumber__NumberMustBeLower(favoriteNumber);
        }

        s_addressToFavoriteNumberData[msg.sender] = FavoriteNumberData({
            favoriteNumber: favoriteNumber,
            lastUpdate: block.timestamp
        });
    }

    function getFavoriteNumber(address favoriteNumberAddress) public view returns (uint) {
        return s_addressToFavoriteNumberData[favoriteNumberAddress].favoriteNumber;
    }

    function getFavoriteNumberLastUpdate(address favoriteNumberAddress) public view returns (uint) {
        return s_addressToFavoriteNumberData[favoriteNumberAddress].lastUpdate;
    }
}
