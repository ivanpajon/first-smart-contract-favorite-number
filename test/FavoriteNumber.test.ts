import { assert, expect } from 'chai';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';

import { FavoriteNumber } from '../typechain-types';

// Only execute tests in local environment
if (!['hardhat', 'localhost'].includes(network.name)) {
  describe.skip;
} else {
  describe('FavoriteNumber Unit Tests', () => {
    let favoriteNumberContract: FavoriteNumber;  // FavoriteNumber contract
    let deployer: string;  // Account from alias 'deployer'

    beforeEach(async () => {
      // Gets deployer account
      deployer = (await getNamedAccounts()).deployer;

      // Executes deploy scripts with given tags to prepare test environment
      await deployments.fixture(['favorite-number']);

      // Gets FavoriteNumber contract
      favoriteNumberContract = await ethers.getContract('FavoriteNumber');
    });

    it('Initial favorite number by default', async () => {
      // Gets default favorite number
      const favoriteNumber = (await favoriteNumberContract.getFavoriteNumber()).toString();

      assert.equal(favoriteNumber, '0');
    });

    it('Set favorite number', async () => {
      // New favorite number
      const newFavoriteNumber = '10';

      // Updates favorite number
      await favoriteNumberContract.setFavoriteNumber(newFavoriteNumber);

      // Gets updated favorite number
      const updatedFavoriteNumber = (await favoriteNumberContract.getFavoriteNumber()).toString();

      assert.equal(newFavoriteNumber, updatedFavoriteNumber);
    });

    it('Can not set invalid favorite number', async () => {
      // Invalid favorite number
      const invalidFavoriteNumber = '101';

      // Tries to update favorite number
      const transaction = favoriteNumberContract.setFavoriteNumber(invalidFavoriteNumber);

      await expect(transaction).to.be.revertedWithCustomError(favoriteNumberContract, 'FavoriteNumber__NumberMustBeLower');
    });
  });
}
