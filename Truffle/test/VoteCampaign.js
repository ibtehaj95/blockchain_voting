const VoteCampaign = artifacts.require("VoteCampaign");

contract("VoteCampaign", function (accounts) {
  it("should put 1 ballot in the first account", async function () {
    const voteCampaignInstance = await VoteCampaign.deployed();
    const balance = await voteCampaignInstance.getBallotAmount.call(accounts[0]);

    assert.equal(balance.toNumber(), 1, "1 ballot wasn't in the first account");
  });

  it("should increase candidate's ballot count when a voter votes for them", async function () {
    const voteCampaignInstance = await VoteCampaign.deployed();
    const voter = accounts[1];
    const candidate = accounts[2];

    // Get initial ballot count of the candidate
    const initialBallotCount = await voteCampaignInstance.getBallotAmount.call(candidate);

    // Voter votes for the candidate
    await voteCampaignInstance.vote(candidate, { from: voter });

    // Get updated ballot count of the candidate
    const updatedBallotCount = await voteCampaignInstance.getBallotAmount.call(candidate);

    assert.equal(updatedBallotCount.toNumber(), initialBallotCount.toNumber() + 1, "Ballot count of the candidate should increase by 1");
  });

  it("should emit a Vote event when a voter votes for a candidate", async function () {
    const voteCampaignInstance = await VoteCampaign.deployed();
    const voter = accounts[1];
    const candidate = accounts[2];

    // Voter votes for the candidate and listen for the Vote event
    const voteTx = await voteCampaignInstance.vote(candidate, { from: voter });
    const voteEvent = voteTx.logs.find((log) => log.event === "Vote");

    // Verify that the Vote event is emitted and contains the correct data
    assert.exists(voteEvent, "Vote event should be emitted");
    assert.equal(voteEvent.args.voter, voter, "Voter address should be correct");
    assert.equal(voteEvent.args.candidate, candidate, "Candidate address should be correct");
  });
});