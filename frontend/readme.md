The frontend of the application has been developed on ReactJS

**Setup**

Before being able to run the app locally, you'll need to create a Firebase account and set it up to communicate it with the frontend. The steps of this process are as follows:
1. Add a new project on console.firebase.google.com
2. Follow the instructions (assign name, disable analytics)
3. Create a folder in the src folder with the name config (in case not created already)
4. Open the project in Firebase (happens automatically after project creation) and click on Cloud Firestore
5. Create a database in the Firestore Database (production mode, Europe). Start a collection called "users" in it and add the first entry for admin by using an auto id and creating five fields, called approved, authenticated, email, name and role. All fields other than approved and authenticated (approved and authenticated booleans to be set true and false, respectively) will be string. Assign initial string values as you based on the email ID you want to use as admin (example, name: Admin, admin@outlook.de, role: admin). Outlook accounts are easy to acquire, hence preferred in this application, but all accounts work
6. Go back to the project homepage on Firebase and click on </> icon to create a web-app configuration file, assign a name (any name) and click on "Register App" (don't click on hosting). You should now see the Add Firebase SDK subheading. Now, go to the folder frontend/src/config and copy and rename the file called firebase-template.js to simply firebase. Copy and paste into it all the indicated values from the initialization code given to you when you click on "web app" and assign a name to your app and are asked to run npm install firebase (which you must not do). Simply ignore the npm install firebase step.
7. Set the Firebase store rules. Simply go to the rules tab and change false in line 5 to true
8. Truffle (alongside node-gyp) has to be installed on the local (or virtual) machine on which the application is expected to run
9. To run the smart contract on the blockchain, the blockchain must be running and then the smart contract should be migrated onto it. To run the Ganache blockchain, download the Ganache App Image and run it using ./ganache-2.7.1-linux-x86_64.AppImage, create a workspace by specifying the truffle-config.js file to be used (project_a1/frontend/src/components/blockchain) and then run truffle migrate from the folder containing the truffle-config.js file. This workspace will launch this very same blockchain each time we want to run a voting campaign.
10. Copy the contract address from the console output of the truffle migrate command and paste it in line 5 of blockchainFunctions.js file, where it is assigned to the variable ethAddress.
11. Run npm i solc && npx solcjs voteContract.sol --abi in the project_a1/frontend/src/components/blockchain/contracts directory to generate a .abi file and rename it as voteContract.json (the .bin can be deleted or ignored) and move it to blockchain/build/contracts. (Ideally, this step shouldn't have been necessary, but truffle's .json does not work with this code).

To run the web app, please run the following commands:

12. sudo apt install nodejs (if NodeJS has not been installed already)
13. sudo apt install npm (if NodeJS has not been installed already)
14. navigate to the folder called frontend (other folders in the same directory are backend and frontend-angular)
15. npm install
16. npm start

To run the project after it has has already been setup first time, simply run npm start from the frontend directory and launch the Ganache blockchain ./ganache-2.7.1-linux-x86_64.AppImage from /frontend/src/components/blockchain and select the workspace

**Program Flow**

keywords: "tabs" here mean the voting application tabs and not browser tabs

1. An admin account (ideally one) is added to Firebase during the setup. An email account is required for verification
2. Each user who wishes to participate in the election needs to have an email account. They have to register themselves in the Register Yourself tab, after which they will receive a verification email (check Junk/Spam if not in Inbox). After clicking on the link, they need to log into their account and make sure the homepage doesn't tell them that they aren't verified. Reload page or log in again if the status doesn't update
3. The admin has to approve the users before they can be added to any campaigns. The users need to already be authenticated for this step
4. The admin needs to create campaigns, assign users to them, they then confirm changes (irreversible process)
5. The users with the roles official need to start their campaigns and stop them eventually (irreversible process)
6. The voters and candidates can now vote for the campaigns they have the rights for ((irreversible process)) and the observers can monitor the election results (switch tabs to update results, periodic status update feature has not yet been implemented)
7. The official needs to finally stop the campaign voting for the voting process to finish
8. To run another campaign, the admin needs to create another campaign
