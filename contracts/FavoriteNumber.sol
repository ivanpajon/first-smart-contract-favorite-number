// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract FavoriteNumber {
    uint private s_favoriteNumber;

    constructor() { }

    function setFavoriteNumber(uint favoriteNumber) external {
        s_favoriteNumber = favoriteNumber;
    }

    function getFavoriteNumber() public view returns (uint) {
        return s_favoriteNumber;
    }
}
