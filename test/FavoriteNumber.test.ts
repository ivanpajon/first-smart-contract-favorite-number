import { assert, expect } from 'chai';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';

import { FavoriteNumber } from '../typechain-types';
import { mine } from '@nomicfoundation/hardhat-network-helpers';

// Only execute tests in local environment
if (!['hardhat', 'localhost'].includes(network.name)) {
  describe.skip;
} else {
  describe('FavoriteNumber Unit Tests', () => {
    let favoriteNumberContract: FavoriteNumber;  // FavoriteNumber contract
    let deployer: string;  // Account from alias 'deployer'
    const deployerFavoriteNumber = '10';  // Deployer favorite number

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
      const favoriteNumber = (await favoriteNumberContract.getFavoriteNumber(deployer)).toString();

      assert.equal(favoriteNumber, '0');
    });

    it('Initial favorite number last update by default', async () => {
      // Gets default favorite number last update
      const favoriteNumberLastUpdate = (await favoriteNumberContract.getFavoriteNumberLastUpdate(deployer)).toString();

      assert.equal(favoriteNumberLastUpdate, '0');
    });

    it('Set and get favorite number', async () => {
      // Updates favorite number
      await favoriteNumberContract.setFavoriteNumber(deployerFavoriteNumber);

      // Gets updated favorite number
      const updatedFavoriteNumber = (await favoriteNumberContract.getFavoriteNumber(deployer)).toString();

      assert.equal(deployerFavoriteNumber, updatedFavoriteNumber);
    });

    it('Set favorite number and get its last update', async () => {
      // Updates favorite number
      const txReceipt = await favoriteNumberContract.setFavoriteNumber(deployerFavoriteNumber);

      // Gets transaction block timestamp
      const txBlockTimestamp = (await ethers.provider.getBlock(txReceipt.blockNumber!)).timestamp;

      // Mines blocks
      const blocksToMine = 5;
      await mine(blocksToMine);

      // Gets favorite number last update
      const favoriteNumberLastUpdate = (await favoriteNumberContract.getFavoriteNumberLastUpdate(deployer)).toString();
      assert.equal(`${txBlockTimestamp}`, favoriteNumberLastUpdate);

      // Gets timestamp from new last block
      const latestBlockTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      assert.equal(`${txBlockTimestamp + blocksToMine}`, `${latestBlockTimestamp}`);
    });

    it('Set and get favorite number for multiple users', async () => {
      // Deployer updates favorite number
      await favoriteNumberContract.setFavoriteNumber(deployerFavoriteNumber);

      // User updates favorite number
      const user = (await ethers.getSigners())[1];
      const userFavoriteNumber = '50';
      favoriteNumberContract.connect(user).setFavoriteNumber(userFavoriteNumber);

      // Tester updates favorite number
      const tester = (await ethers.getSigners())[2];
      const testerFavoriteNumber = '98';
      favoriteNumberContract.connect(tester).setFavoriteNumber(testerFavoriteNumber);

      // Gets deployer updated favorite number
      const deployerUpdatedFavoriteNumber = (await favoriteNumberContract.getFavoriteNumber(deployer)).toString();

      // Gets user updated favorite number
      const userUpdatedFavoriteNumber = (await favoriteNumberContract.getFavoriteNumber(user.address)).toString();

      // Gets tester updated favorite number
      const testerUpdatedFavoriteNumber = (await favoriteNumberContract.getFavoriteNumber(tester.address)).toString();

      assert.equal(deployerFavoriteNumber, deployerUpdatedFavoriteNumber);
      assert.equal(userFavoriteNumber, userUpdatedFavoriteNumber);
      assert.equal(testerFavoriteNumber, testerUpdatedFavoriteNumber);
    });

    it('Cannot set invalid favorite number', async () => {
      // Invalid favorite number
      const invalidFavoriteNumber = '101';

      // Tries to update favorite number
      const txReceipt = favoriteNumberContract.setFavoriteNumber(invalidFavoriteNumber);

      await expect(txReceipt).to.be.revertedWithCustomError(favoriteNumberContract, 'FavoriteNumber__NumberMustBeLower');
    });
  });
}
