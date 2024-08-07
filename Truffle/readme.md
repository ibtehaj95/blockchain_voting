These files are used to handle the BlockChain part of Voting System

in contracts folders, there are smart contracts

in utils, there is a javascript file blockChain.js, This file is used to connect js frontend with the blockchain.

	function "Connect()" is used to connect to the web3 Server.

	function "allocateIndex()" is used when an account is created, each user will get a unique index
	they will put their index during vote process to find their block address

	function "vote()" is used to excute the vote process, it should be called in frontend when user click vote.
	parameters are the index of voter and candidate. 
	You can add some operations in the places of comments.
	console operations can be deleted

                To receive notifications when a vote event occurs, call the "listenToVoteEvent()" function.
	inside this function you can add some code to handle operations when vote event is triggered.

	For more, refers to comments in blockChain.js

More tips:
1. I am not sure whether our js frontend has imported web3 service, if not, import web3.js is needed.
2. blockChain.js is now in the util filefolder in truffle. Our frontend need to call its function.
I don't know much about js, maybe the frontend have some ways to import it,
or we need to put it inside frontend folder?