var CrowdFunder = artifacts.require('./CrowdFunder.sol');

module.exports = function(deployer) {
  deployer.deploy(CrowdFunder, 24, 'testing', '0x1b51bb198a6eebf0e60fcf4ac6652a0755258685e09e11a92870ee9f9bed297b', 10);
};
