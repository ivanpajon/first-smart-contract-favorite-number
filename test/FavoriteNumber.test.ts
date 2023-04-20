import { assert, expect } from 'chai';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';

import { mine } from '@nomicfoundation/hardhat-network-helpers';
import { FavoriteNumber } from '../typechain-types';

// Only execute tests in local environment
if (!['hardhat', 'localhost'].includes(network.name)) {
  describe.skip;
} else {
  describe('FavoriteNumber Unit Tests', () => {
    let favoriteNumberContract: FavoriteNumber;  // FavoriteNumber contract
    let deployer: string;  // Account from alias 'deployer'
    const deployerFavoriteNumbers: [number, number] = [10, 20];  // Deployer favorite numbers

    beforeEach(async () => {
      // Gets deployer account
      deployer = (await getNamedAccounts()).deployer;

      // Executes deploy scripts with given tags to prepare test environment
      await deployments.fixture(['favorite-number']);

      // Gets FavoriteNumber contract
      favoriteNumberContract = await ethers.getContract('FavoriteNumber');
    });

    it('Initial favorite numbers by default', async () => {
      // Gets default favorite numbers
      const favoriteNumbers = (await favoriteNumberContract.getFavoriteNumbers(deployer)).toString();

      assert.equal(favoriteNumbers, '0,0');
    });

    it('Initial favorite numbers last update by default', async () => {
      // Gets default favorite numbers last update
      const favoriteNumberLastUpdate = (await favoriteNumberContract.getFavoriteNumbersLastUpdate(deployer)).toString();

      assert.equal(favoriteNumberLastUpdate, '0');
    });

    it('Set and get favorite numbers', async () => {
      // Updates favorite numbers
      await favoriteNumberContract.setFavoriteNumbers(deployerFavoriteNumbers);

      // Gets updated favorite numbers
      const updatedFavoriteNumbers = (await favoriteNumberContract.getFavoriteNumbers(deployer)).toString();

      assert.equal(deployerFavoriteNumbers.join(','), updatedFavoriteNumbers);
    });

    it('Set favorite numbers and get its last update', async () => {
      // Updates favorite numbers
      const txReceipt = await favoriteNumberContract.setFavoriteNumbers(deployerFavoriteNumbers);

      // Gets transaction block timestamp
      const txBlockTimestamp = (await ethers.provider.getBlock(txReceipt.blockNumber!)).timestamp;

      // Mines blocks
      const blocksToMine = 5;
      await mine(blocksToMine);

      // Gets favorite numbers last update
      const favoriteNumbersLastUpdate = (await favoriteNumberContract.getFavoriteNumbersLastUpdate(deployer)).toString();
      assert.equal(`${txBlockTimestamp}`, favoriteNumbersLastUpdate);

      // Gets timestamp from new last block
      const latestBlockTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      assert.equal(`${txBlockTimestamp + blocksToMine}`, `${latestBlockTimestamp}`);
    });

    it('Set and get favorite numbers for multiple users', async () => {
      // Deployer updates favorite numbers
      await favoriteNumberContract.setFavoriteNumbers(deployerFavoriteNumbers);

      // User updates favorite numbers
      const user = (await ethers.getSigners())[1];
      const userFavoriteNumbers: [number, number] = [50, 70];
      favoriteNumberContract.connect(user).setFavoriteNumbers(userFavoriteNumbers);

      // Tester updates favorite numbers
      const tester = (await ethers.getSigners())[2];
      const testerFavoriteNumbers: [number, number] = [89, 98];
      favoriteNumberContract.connect(tester).setFavoriteNumbers(testerFavoriteNumbers);

      // Gets deployer updated favorite numbers
      const deployerUpdatedFavoriteNumbers = (await favoriteNumberContract.getFavoriteNumbers(deployer)).toString();

      // Gets user updated favorite numbers
      const userUpdatedFavoriteNumbers = (await favoriteNumberContract.getFavoriteNumbers(user.address)).toString();

      // Gets tester updated favorite numbers
      const testerUpdatedFavoriteNumbers = (await favoriteNumberContract.getFavoriteNumbers(tester.address)).toString();

      assert.equal(deployerFavoriteNumbers.join(','), deployerUpdatedFavoriteNumbers);
      assert.equal(userFavoriteNumbers.join(','), userUpdatedFavoriteNumbers);
      assert.equal(testerFavoriteNumbers.join(','), testerUpdatedFavoriteNumbers);
    });

    it('Cannot set invalid favorite numbers', async () => {
      // Invalid first favorite number
      const invalidFirstFavoriteNumbers: [number, number] = [101, 99];

      // Tries to update favorite numbers
      const txFirstReceipt = favoriteNumberContract.setFavoriteNumbers(invalidFirstFavoriteNumbers);

      await expect(txFirstReceipt).to.be.revertedWithCustomError(favoriteNumberContract, 'FavoriteNumber__NumberMustBeLower');
      
      // Invalid second favorite number
      const invalidSecondFavoriteNumbers: [number, number] = [99, 101];

      // Tries to update favorite numbers
      const txSecondReceipt = favoriteNumberContract.setFavoriteNumbers(invalidSecondFavoriteNumbers);

      await expect(txSecondReceipt).to.be.revertedWithCustomError(favoriteNumberContract, 'FavoriteNumber__NumberMustBeLower');
    });
  });
}
