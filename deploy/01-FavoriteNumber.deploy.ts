import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFn: DeployFunction = async ({
  getNamedAccounts,
  deployments
}: HardhatRuntimeEnvironment) => {
  // Gets deploy and log functions
  const { deploy, log } = deployments;
  // Gets account of the deployer alias
  const { deployer } = await getNamedAccounts();

  // Changes log color to yellow
  log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------------');

  // Deploys FavoriteNumber contract
  const favoriteNumber = await deploy('FavoriteNumber', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
  // log(favoriteNumberContract);

  // Changes log color to yellow
  log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------------');
};

// Custom tags to target with --tags flag in hardhat cli
deployFn.tags = ['all', 'favorite-number'];

// Exports deploy function
export default deployFn;
