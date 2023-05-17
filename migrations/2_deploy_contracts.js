const Reverse = artifacts.require("Reverse");

module.exports = function(deployer) {
  deployer.deploy(Reverse);
};
