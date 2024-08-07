//SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0 < 0.9.0;

contract voteContract{
    
    struct Candidate{
        string candEmail;
        uint32 voteCount;
    }
    
    struct PartialCampaignData{
        uint16 campaignID;
        string campaignName;
        Candidate[] candidates;
    }

    // PartialCampaignData[] public partialCampaignsData;
    mapping(uint16 => PartialCampaignData) public mapPartialCampaignsData;
    uint16 campaignsCount;

    address public votingApp;

    constructor(){
        votingApp = msg.sender;
        campaignsCount = 0;
    }

    // incoming data is like (invalid format. Solidity doesn't allow objects):

    // string newCampaignName,
    // string[] newCampaignCandidatesEmails,

    // Need to make it like:

    // {
    //     name: campaignName,
    //     running: false,
    //     candidates:[
    //         {
    //             candEmail: newCampaignCandidatesEmails[0],
    //             voteCount: 0
    //         },
    //         {
    //             candEmail: newCampaignCandidatesEmails[1],
    //             voteCount: 0
    //         },
    //         {
    //             candEmail: newCampaignCandidatesEmails[2],
    //             voteCount: 0
    //         }
    //     ]
    // }

    //create a new campaign
    function newCampaign(string calldata newCampaignName, string[] calldata newCampaignCandidatesEmails) public{

        // Candidate[] memory candidates = new Candidate[] (newCampaignCandidatesEmails.length);

        // for(uint i=0; i<newCampaignCandidatesEmails.length; ++i){
        //     candidates[i] = Candidate({
        //         candEmail: newCampaignCandidatesEmails[i],
        //         voteCount: 0
        //         });
        // }

        // // this is operation (push) leads to the contract not compiling
        // // solution at https://ethereum.stackexchange.com/questions/117658/copying-of-type-struct-memory-memory-to-storage-not-yet-supported
        // partialCampaignsData.push(PartialCampaignData({
        //     campaignName: newCampaignName,
        //     campaignRunning: false,
        //     candidates: candidates
        // }));

        // PartialCampaignData memory partialCampaignsData;
        // partialCampaignsData.campaignID = newCampaignID;
        // partialCampaignsData.campaignName = newCampaignName;
        // for(uint i=0; i<newCampaignCandidatesEmails.length; ++i){
        //     partialCampaignsData.candidates[i] = Candidate(newCampaignCandidatesEmails[i], 0);
        // }
        // mapPartialCampaignsData[partialCampaignsData.campaignID] = partialCampaignsData;

        uint16 campaignID = campaignsCount;
        PartialCampaignData storage partialCampaignsData = mapPartialCampaignsData[campaignID];
        partialCampaignsData.campaignID = campaignsCount;
        partialCampaignsData.campaignName = newCampaignName;
        for(uint16 i=0; i<newCampaignCandidatesEmails.length; ++i){
            // partialCampaignsData.candidates[i] = Candidate(newCampaignCandidatesEmails[i], 0);
            partialCampaignsData.candidates.push(Candidate(newCampaignCandidatesEmails[i], 0));
        }
        campaignsCount++;
    }

    //find the names of campaigns
    function getCampaignCount() public view returns (uint16){
        return campaignsCount;
    }

    // vote for a candidate on a campaign
    function vote(uint16 campaignIndex, uint8 candidateIndex) public{
        mapPartialCampaignsData[campaignIndex].candidates[candidateIndex].voteCount++;
    }

    //find the names of campaigns
    function getCampaign(uint16 campaignIndex) public view returns (uint16, string memory, Candidate[] memory){
        PartialCampaignData storage pcd = mapPartialCampaignsData[campaignIndex];
        return (pcd.campaignID, pcd.campaignName, pcd.candidates);
        // return mapPartialCampaignsData;
    }
}