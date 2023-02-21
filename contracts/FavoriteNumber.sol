// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

error FavoriteNumber__NumberMustBeLower(uint favoriteNumber);

contract FavoriteNumber {
    uint private s_favoriteNumber;

    constructor() { }

    function setFavoriteNumber(uint favoriteNumber) external {
        if (favoriteNumber > 100) {
            revert FavoriteNumber__NumberMustBeLower(favoriteNumber);
        }

        s_favoriteNumber = favoriteNumber;
    }

    function getFavoriteNumber() public view returns (uint) {
        return s_favoriteNumber;
    }
}
