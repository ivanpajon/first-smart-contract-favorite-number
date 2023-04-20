// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

error FavoriteNumber__NumberMustBeLower(uint favoriteNumber);

contract FavoriteNumber {
    struct FavoriteNumberData {
        uint[2] favoriteNumbers;
        uint lastUpdate;
    }

    mapping(address => FavoriteNumberData) private s_addressToFavoriteNumbersData;

    constructor() { }

    function setFavoriteNumbers(uint[2] calldata favoriteNumbers) external {
        if (favoriteNumbers[0] > 100) {
            revert FavoriteNumber__NumberMustBeLower(favoriteNumbers[0]);
        }
        if (favoriteNumbers[1] > 100) {
            revert FavoriteNumber__NumberMustBeLower(favoriteNumbers[1]);
        }

        s_addressToFavoriteNumbersData[msg.sender] = FavoriteNumberData({
            favoriteNumbers: favoriteNumbers,
            lastUpdate: block.timestamp
        });
    }

    function getFavoriteNumbers(address favoriteNumberAddress) public view returns (uint[2] memory) {
        return s_addressToFavoriteNumbersData[favoriteNumberAddress].favoriteNumbers;
    }

    function getFavoriteNumbersLastUpdate(address favoriteNumberAddress) public view returns (uint) {
        return s_addressToFavoriteNumbersData[favoriteNumberAddress].lastUpdate;
    }
}
