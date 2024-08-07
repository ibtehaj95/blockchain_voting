var web3;
var address = ""; 
//This address is the address of contract, when the contract is deployed, it will get its address
//maybe we can add a textfield to write the address in GUI, this can be only used by admin

async function Connect(){
    await window.web3.currentProvider.enable();
    web3 = new Web3(window.web3.currentProvider);
}

if(typeof web3 !== 'undefined'){
    web3 = new Web3(window.web3.currentProvider);
}
else{
    web3 = new Web3(new web3.Provider.HttpProvider("HTTP://127.0.0.1:8111"));
}

var abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "voterAdress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "candiateAdress",
				"type": "address"
			}
		],
		"name": "Vote",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "ballot",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "candiateAdress",
				"type": "address"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

var Contract = new web3.eth.Contract(abi, address);

async function vote(voterIndex, candidateIndex){
    web3.eth.getAccounts().then(function(account){
        Contract.methods.vote(account[candidateIndex]).send({ from: account[voterIndex] })
        .on('transactionHash', function(hash){
            // Add Operations after vote button is clicked
             console.log("Transaction hash: " + hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            // Add Operations after vote transaction is confirmed
             console.log("Confirmation number: " + confirmationNumber);
             console.log("Receipt: " + JSON.stringify(receipt));
        })
        .on('error', function(error){
            // Add Operations when error occurs
             console.error("Error: " + error);
        });
    }).catch(function(temp){
        alert(temp);
    })
}

function listenToVoteEvent() {
  Contract.events.Vote({}, function(error, event) {
    if (!error) {
      console.log("Vote event: " + JSON.stringify(event));
      // Here you can add operations when a vote event is triggered, eg.updating GUI
    } else {
      console.error("Error: " + error);
    }
  });
}

let currentIndex = 0;

//allocateIndex function is used when an account is created, each user will get a unique index
//they will put their index during vote process to find their block address

function allocateIndex() {
  const index = currentIndex;
  currentIndex++;
  return index;
}
