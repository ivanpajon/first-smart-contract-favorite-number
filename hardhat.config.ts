import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';

import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  defaultNetwork: 'hardhat',
  // localhost / hardhat -> 'http://127.0.0.1:8545/'
  networks: {
    localhost: {
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
    },
  },
  // Nodo opcional que permite agregar el plugin hardhat-deploy
  namedAccounts: {
    // Alias
    deployer: {
      default: 0, // Por defecto asigna la primera cuenta
    },
  },
};

export default config;
