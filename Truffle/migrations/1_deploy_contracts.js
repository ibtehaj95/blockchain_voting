const ConvertLib = artifacts.require("ConvertLib");
const VoteCampaign = artifacts.require("VoteCampaign");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, VoteCampaign);
  deployer.deploy(VoteCampaign);
};
