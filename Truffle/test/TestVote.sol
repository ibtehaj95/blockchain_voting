// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// These files are dynamically created at test time
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VoteCampaign.sol";

contract TestVote {

  function testInitialBalanceUsingDeployedContract() public {
    VoteCampaign vote = VoteCampaign(DeployedAddresses.VoteCampaign());

    uint expected = 1;

    Assert.equal(vote.getBalance(tx.origin), expected, "Owner should have 1 ballot initially");
  }

  function testInitialBalanceWithNewVote() public {
    VoteCampaign vote = new VoteCampaign();

    uint expected = 1;

    Assert.equal(vote.getBalance(tx.origin), expected, "Owner should have 1 ballot initially");
  }

}
