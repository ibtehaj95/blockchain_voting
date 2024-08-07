import Web3 from 'web3';
import voteContract from "./build/contracts/voteContract.json";

const contractABI = voteContract;
const ethAddress = "0x81283C68fA42A255A7A7055c6CC90F0615d604Ab";

// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
web3.eth.Contract.handleRevert = true;

// Log the current block number to the console
export const printLatestBlockNum = async () => {

    try{
        const blockNum = await web3.eth.getBlockNumber();
        // console.log('Current block number: ' + blockNum);
        return blockNum;
    }
    catch (error) {
        return error;
    }

};

// Get the campaigns count value
export const getCampaignsCount = async () => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);

    try{
        const campaignCount = await contract.methods.getCampaignCount().call();
        // console.log('Campaign Count Value: ' + campaignCount);
        return parseInt(campaignCount);
    }
    catch (error) {
        console.error(error);
    }

};

// Get the campaign details
export const getCampaignDetails = async (num) => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);

    try{
        const campaignStatus = await contract.methods.getCampaign(parseInt(num)).call();
        const campaignID = campaignStatus[0];
        const campaignName = campaignStatus[1];
        const candidates = campaignStatus[2];

        // console.log('Campaign ID: ' + campaignID);
        // console.log('Campaign Name: ' + campaignName);
        // console.log('Candidates: ' + candidates);

        return{
            id: campaignID,
            name: campaignName,
            candidates: candidates,
        }
    }
    catch (error) {
        console.error(error);
    }

};

// Create New Campaign
export const createNewCampaign = async (campaignName, candidatesArray, ethAcc) => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);
    // const providersAccounts = await web3.eth.getAccounts();
    // const defaultAccount = providersAccounts[0];
    // console.log(ethAcc);

    try{
        const receipt = await contract.methods.newCampaign(campaignName, candidatesArray).send({
            from: ethAcc,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        // console.log('Transaction Hash: ' + receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch (error) {
        console.error(error);
    }

};

// Vote on a campaign
export const vote = async (campaignIdx, candidateIdx, ethAcc) => {

    const contract = new web3.eth.Contract(contractABI, ethAddress);
    // const providersAccounts = await web3.eth.getAccounts();
    // const defaultAccount = providersAccounts[0];
    // console.log(ethAcc);

    try{
        const receipt = await contract.methods.vote(campaignIdx, candidateIdx).send({
            from: ethAcc,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        // console.log('Transaction Hash: ' + receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch (error) {
        console.error(error);
    }

};

// Get a random Eth account
export const getEthAcc = async () => {
    const providersAccounts = await web3.eth.getAccounts();
    const randomNum = Math.floor(Math.random()*9);
    const ethAcc = providersAccounts[randomNum];
    return ethAcc;
}