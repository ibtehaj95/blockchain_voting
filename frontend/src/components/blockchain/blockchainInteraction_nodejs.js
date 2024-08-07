const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)

const contractABI = require("./build/contracts/voteContract.json");
const ethAddress = "0x8dB929f2901601559B1416050D07B9AFA06b7e2c";

// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

// Log the current block number to the console
// web3.eth
//     .getBlockNumber()
//     .then(result => {
//         console.log('Current block number: ' + result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

// Log the current block number to the console
const printLatestBlockNum = async () => {

    try{
        const blockNum = await web3.eth.getBlockNumber();
        console.log('Current block number: ' + blockNum);
    }
    catch (error) {
        console.error(error);
    }

}

// Get the campaigns count value
const campaignsCount = async () => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);

    try{
        const campaignCount = await contract.methods.getCampaignCount().call();
        console.log('Campaign Count Value: ' + campaignCount);
        return parseInt(campaignCount);
    }
    catch (error) {
        console.error(error);
    }

}

// Get the campaign details
const campaignDetails = async (num) => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);

    try{
        const campaignStatus = await contract.methods.getCampaign(parseInt(num)).call();
        const campaignID = campaignStatus[0];
        const campaignName = campaignStatus[1];
        const candidates = campaignStatus[2];

        console.log('Campaign ID: ' + campaignID);
        console.log('Campaign Name: ' + campaignName);
        console.log('Candidates: ' + candidates);
    }
    catch (error) {
        console.error(error);
    }

}

// Create New Campaign
const createNewCampaign = async (campaignName, candidatesArray) => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];

    console.log(defaultAccount);

    try{
        const receipt = await contract.methods.newCampaign(campaignName, candidatesArray).send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch (error) {
        console.error(error);
    }

}

// Vote on a campaign
const vote = async (campaignIdx, candidateIdx) => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];

    console.log(defaultAccount);

    try{
        const receipt = await contract.methods.vote(campaignIdx, candidateIdx).send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch (error) {
        console.error(error);
    }

}

// Get a random Eth account
const getEthAcc = async () => {
    const providersAccounts = await web3.eth.getAccounts();
    const randomNum = Math.floor(Math.random()*9);
    const EthAcc = providersAccounts[randomNum];
    console.log(EthAcc);
}

//create campaign and see details right ater

// const createNewCampaignAndSeeRes = async(campaignName, candidatesArray) => {
//     await createNewCampaign(campaignName, candidatesArray);
//     const count = await campaignsCount();
//     campaignDetails(count-1);
// }

// printLatestBlockNum();
// campaignsCount();
// createNewCampaign("test-campaign-5", ["AZ", "BY", "CX"]);
// campaignDetails(2);
// getEthAcc();
// createNewCampaign("test-campaign-7", ["IK", "BB", "MNS"]).then(campaignDetails(6));  //doesn't work
// createNewCampaignAndSeeRes("test-campaign-10", ["IK", "NM", "XJ"]);
// vote(7, 0);