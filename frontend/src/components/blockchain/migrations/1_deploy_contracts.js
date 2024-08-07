const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const voteContract = artifacts.require("voteContract");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin, voteContract);
  deployer.deploy(MetaCoin);
  deployer.deploy(voteContract);
};