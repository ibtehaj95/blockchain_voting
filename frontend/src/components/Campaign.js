import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userContext from '../utils/UserContext';
import {db} from "../config/firebase";
import {getDocs, collection, updateDoc, doc} from "firebase/firestore";
import {printLatestBlockNum, getCampaignDetails, createNewCampaign, vote, getCampaignsCount, getEthAcc} from "./blockchain/blockchainFunctions";
import { auth } from "../config/firebase";

function Vote(){
    const {id: nameAsCollection} = useParams();
    const {userObj} = React.useContext(userContext);
    const [campaignDetails, setCampaignDetails] = useState({
        id: null,
        name: "default",
    });
    const [usersTable, setUsersTable] = useState([]);
    const [eligibleUsersTable, setEligibleUsersTable] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);
    const [observers, setObservers] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [start, setStart] = useState(false);
    const [changesFixed, setChangesFixed] = useState(true);

    const updateCampaignDetails = () => {
        const campaignsTableRef = collection(db, nameAsCollection);
        getDocs(campaignsTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const campaigns_data = resp.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setCampaignDetails(campaigns_data[0]);
        })
    }

    const updateUsersTable = () => {
        const usersTableRef = collection(db, "users");
        getDocs(usersTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const users_data = resp.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setUsersTable(users_data);
        })
        
    }

    const updateParticipantsTableAdded = (index, added_val) => {
        // console.log(index_pmtr);
        let newParticipantsTable = eligibleUsersTable;
        newParticipantsTable[index] = {
            ...newParticipantsTable[index],
            added: added_val,
        };
        setEligibleUsersTable(newParticipantsTable);
        // const newParticipantsTable = eligibleUsersTable.map((user, index) => {
        //     if(index === index_pmtr){
        //         console.log(index);
        //         return {
        //             ...user,
        //             added: added_val,
        //         };
        //     }
        //     else{
        //         return {
        //             ...user,
        //         };
        //     }
        // });
        setEligibleUsersTable(newParticipantsTable);
    }

    const handleAdd = (event) => {
        const htmlElement = event.target.parentElement.childNodes;
        // console.log(htmlElement);
        const name = htmlElement[0].data;
        const email = htmlElement[6].data;
        const role = htmlElement[12].data;
        // console.log(name, email, role);
        if(role === "voter"){
            // console.log("Voter");
            const find_res = voters.find((voter) => voter.email === email);
            if(find_res === undefined){
                let parIdx = 0;
                eligibleUsersTable.find((participant, index) => {
                    parIdx = index;
                    return participant.email === email;
                });
                updateParticipantsTableAdded(parIdx, true);

                let newCampaignVoterDetails = campaignDetails.voters;
                newCampaignVoterDetails = [
                    ...newCampaignVoterDetails,
                    {
                        name: name,
                        email: email,
                        voted: false,
                    }
                ];
                setCampaignDetails((prev) => ({
                    ...prev,
                    voters: newCampaignVoterDetails,
                }));
            }
        }
        else if(role === "candidate"){
            // console.log("Candidate");
            const find_res = candidates.find((candidate) => candidate.email === email);
            if(find_res === undefined){
                let parIdx = 0;
                eligibleUsersTable.find((participant, index) => {
                    parIdx = index;
                    return participant.email === email;
                });
                updateParticipantsTableAdded(parIdx, true);

                let newCampaignCandidateDetails = campaignDetails.candidates;
                newCampaignCandidateDetails = [
                    ...newCampaignCandidateDetails,
                    {
                        name: name,
                        email: email,
                        votes: 0,
                        voted: false,
                    }
                ];
                setCampaignDetails((prev) => ({
                    ...prev,
                    candidates: newCampaignCandidateDetails,
                }));
            }
        }
        else if(role === "observer"){
            // console.log("Observer");
            const find_res = observers.find((observer) => observer.email === email);
            if(find_res === undefined){
                let parIdx = 0;
                eligibleUsersTable.find((participant, index) => {
                    parIdx = index;
                    return participant.email === email;
                });
                updateParticipantsTableAdded(parIdx, true);

                let newCampaignObserverDetails = campaignDetails.observers;
                newCampaignObserverDetails = [
                    ...newCampaignObserverDetails,
                    {
                        name: name,
                        email: email,
                    }
                ];
                setCampaignDetails((prev) => ({
                    ...prev,
                    observers: newCampaignObserverDetails,
                }));
            }
        }
        else if(role === "official"){
            // console.log("Official");
            const find_res = officials.find((official) => official.email === email);
            if(find_res === undefined){
                let parIdx = 0;
                eligibleUsersTable.find((participant, index) => {
                    parIdx = index;
                    return participant.email === email;
                });
                updateParticipantsTableAdded(parIdx, true);

                let newCampaignOfficialDetails = campaignDetails.officials;
                newCampaignOfficialDetails = [
                    ...newCampaignOfficialDetails,
                    {
                        name: name,
                        email: email,
                    }
                ];
                setCampaignDetails((prev) => ({
                    ...prev,
                    officials: newCampaignOfficialDetails,
                }));
            }
        }
    }

    const removeHandler = (event) => {
        const htmlElement = event.target.parentElement.childNodes;
        const email = htmlElement[2].data;
        const find_res = eligibleUsersTable.find((participant) => participant.email === email);
        const parIdx = eligibleUsersTable.findIndex((participant) => participant.email === email);
        const parRole = find_res.role + "s";
        updateParticipantsTableAdded(parIdx, false);
        let newCampaignParticipantDetails = campaignDetails[parRole];
        const campaignParIdx = newCampaignParticipantDetails.findIndex((participant) => participant.email === email);
        newCampaignParticipantDetails.splice(campaignParIdx, 1);
        setCampaignDetails((prev) => ({
            ...prev,
            [parRole]: newCampaignParticipantDetails,
        }));
    }

    const isParticipant = () => {
        const participantsTable = [...voters, ...candidates, ...observers, ...officials];
        if(participantsTable.length > 0){
            const find_res = participantsTable.find((participant) => participant.email === userObj.email);
            if(find_res !== undefined || userObj.name === "Admin"){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    const handleVote = async (event) => {

        if(campaignDetails.running === false){
            alert("Voting Not Allowed (Yet)!");
            return;
        }

        let blockChainConnectionFailed = true;
        const blocksCount = await printLatestBlockNum();

        if(typeof(blocksCount) === "bigint"){
            console.log("BlockChain Connected. Changes Confirmed");
            blockChainConnectionFailed = false;
        }

        if(blockChainConnectionFailed === true){
            alert("Couldn't connect to the blockchain");
            console.log("Couldn't connect to the blockchain");
        }
        else{
            const email = event.target.parentElement.children[0].children[1].textContent;
            // console.log("Vote", email);

            //identify vote recieving candidate
            let newCampaignCandidateDetails = campaignDetails["candidates"];
            const candidateIdx = newCampaignCandidateDetails.findIndex((participant) => participant.email === email);

            //increase candidate vote count (BC)
            await vote(campaignDetails.blockChainIndex, candidateIdx, campaignDetails.campaignEthAcc);
            //check if it got updated
            const resp = await getCampaignDetails(campaignDetails.blockChainIndex);
            const candidateDetails = resp.candidates[candidateIdx];
            const voteCountConv = parseInt(candidateDetails[1]);
            
            //increase the vote count for the candidate (DB)
            const newCandidateObj = newCampaignCandidateDetails[candidateIdx];
            newCandidateObj.votes = voteCountConv;
            newCampaignCandidateDetails[candidateIdx] = newCandidateObj;
            setCampaignDetails((prev) => ({
                ...prev,
                "candidates": newCampaignCandidateDetails,
            }));

            //set the voted bit of (the appropriate index of the) eligible voters table
            if(userObj.role === "voter"){
                let newCampaignVoterDetails = campaignDetails["voters"];
                const voterIdx = newCampaignVoterDetails.findIndex((voter) => voter.email === userObj.email);
                newCampaignVoterDetails[voterIdx] = {
                    ...newCampaignVoterDetails[voterIdx],
                    voted: true,
                }
                setCampaignDetails((prev) => ({
                    ...prev,
                    "voters": newCampaignVoterDetails,
                }));
            }
            else if (userObj.role === "candidate") {
                let newCampaignCandidateDetails = campaignDetails["candidates"];
                const candidateIdx = newCampaignCandidateDetails.findIndex((candidate) => candidate.email === userObj.email);
                newCampaignCandidateDetails[candidateIdx] = {
                    ...newCampaignCandidateDetails[candidateIdx],
                    voted: true,
                }
                setCampaignDetails((prev) => ({
                    ...prev,
                    "candidates": newCampaignCandidateDetails,
                }));
            }
            }
    }

    const voteAllowed = () => {
        const participantsTable = [...voters, ...candidates];
        if(participantsTable.length > 0){
            // console.log(participantsTable);
            const find_res = participantsTable.find((participant) => participant.email === userObj.email);
            if(find_res !== undefined){
                if(userObj.role === "voter" && campaignDetails.voters.find((voter) => voter.email === userObj.email).voted === false){
                    return true;
                }
                else if(userObj.role === "candidate" && campaignDetails.candidates.find((candidate) => candidate.email === userObj.email).voted === false){
                    return true;
                }
                else{
                    return false;   //if the voter hasn't voted yet
                }
            }
            else{
                return false;   //if this user isn't on the list of participants list
            }
        }
        else{
            return false;   //when the array is empty
        }
    }

    const displayStartStop = () => {
        if(campaignDetails.id !== null){
            const isOfficial = campaignDetails.officials.find((official) => official.email === userObj.email);
            if(isOfficial !== undefined){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    const renderStartStop = () => {
        if (start === false){
            return <button className={!campaignDetails.campaignEnded ? "btn-startstop" : ""} disabled={campaignDetails.campaignEnded} onClick={handleVoteStart} >Start</button>
        }
        else if (start === true){
            return <button className="btn-startstop" onClick={handleVoteStop}>Stop</button>
        }
    }

    const handleVoteStart = () => {
        if(campaignDetails.campaignEnded === true){
            console.log("Campaign Already Ran Once");
        }
        else{
            console.log("Voting Started");
            setStart(() => true);
            setCampaignDetails((prev) => ({
                ...prev,
                running: true,
                campaignEnded: true,
            }));
        }
    }

    const handleVoteStop = () => {
        console.log("Voting Stopped");
        setStart(() => false);
        setCampaignDetails((prev) => ({
            ...prev,
            running: false,
        }));
    }

    const confirmChanges = async () => {
        let blockChainConnectionFailed = true;

        const blocksCount = await printLatestBlockNum();

        if(typeof(blocksCount) === "bigint"){
            console.log("BlockChain Connected. Changes Confirmed");
            blockChainConnectionFailed = false;
        }

        if(blockChainConnectionFailed === true){
            alert("Couldn't connect to the blockchain");
            console.log("Couldn't connect to the blockchain");
        }
        else{
            //create campaign on blockchain with the given candidates
            const campaignBlockChainIndex = await getCampaignsCount();
            const candidatesArray = candidates.map((candidate) => candidate.name);
            const ethAcc = await getEthAcc();
            await createNewCampaign(campaignDetails.name, candidatesArray, ethAcc);
            
            setCampaignDetails((prev) => ({
                ...prev,
                changesFixed: true,
                blockChainIndex: campaignBlockChainIndex,
                campaignEthAcc: ethAcc,
            }));
        }
    }

    useEffect(() => {
        console.log(`You are logged in as ${userObj.name}`);
        // setCampaignDetails(JSON.parse(localStorage.getItem(`campaign${id}`)));
        // setUsersTable(JSON.parse(localStorage.getItem("usersTable")));
        updateCampaignDetails();
        updateUsersTable();
    }, [userObj]);

    useEffect(() => {
        const participants = usersTable.map((user) => {

            const participantsArray = [...voters, ...candidates, ...observers, ...officials];
            const find_res = participantsArray.find((participant) => participant.email === user.email);
            const added = find_res === undefined ? false:true;

            return {
            ...user,
            added: added,
            voted: false,
        }});
        setEligibleUsersTable(participants);
    }, [usersTable, voters, candidates, observers, officials]);

    useEffect(() => {
        // console.log(campaignDetails);
        if(campaignDetails.voters !== undefined && campaignDetails.id !== null){
            setVoters(campaignDetails.voters);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                voters: campaignDetails.voters,
            });
        }
        if(campaignDetails.candidates !== undefined && campaignDetails.id !== null){
            setCandidates(campaignDetails.candidates);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                candidates: campaignDetails.candidates,
            });
        }
        if(campaignDetails.observers !== undefined && campaignDetails.id !== null){
            setObservers(campaignDetails.observers);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                observers: campaignDetails.observers,
            });
        }
        if(campaignDetails.officials !== undefined && campaignDetails.id !== null){
            setOfficials(campaignDetails.officials);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                officials: campaignDetails.officials,
            });
        }
        if(campaignDetails.changesFixed !== undefined && campaignDetails.id !== null){
            setChangesFixed(campaignDetails.changesFixed);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                changesFixed: campaignDetails.changesFixed,
                blockChainIndex: campaignDetails.blockChainIndex,
                campaignEthAcc: campaignDetails.campaignEthAcc,
            });
        }
        else{
            //do nothing
        }
        if(campaignDetails.running === true && campaignDetails.id !== null){
            setStart(true);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                running: true,
                campaignEnded: true,
            });
        }
        else if(campaignDetails.running === false && campaignDetails.id !== null){
            setStart(false);
            const oneCampaignDocRef = doc(db, nameAsCollection, campaignDetails.id);
            updateDoc(oneCampaignDocRef, {
                running: false,
            });
        }
    }, [campaignDetails, nameAsCollection]);

    // useEffect(() => {
    //     console.log("Eligible Users:", eligibleUsersTable);
    // }, [eligibleUsersTable]);

    return(
        <div className="primary-container">
            {auth.currentUser.emailVerified===true && campaignDetails!==undefined && `Vote for Campaign ${campaignDetails.name}`}
            {userObj.name === "Admin" && 
                <div className="secondary-container">
                    <h3>Admin's Panel</h3>
                    <div className="tertiary-container">
                    <h5>Available Users</h5>
                    {
                        eligibleUsersTable && eligibleUsersTable.map((participant) => {
                            if(participant.approved === true && participant.added === false && participant.name !== "Admin"){
                                return (
                                    <div className="cmpgn-prtcpnts-pnl" key={participant.id}>
                                        {participant.name} <span></span> with <span></span> {participant.email} <span></span> as <span></span> {participant.role}
                                        <button className={!changesFixed ? "btn-confirm" : ""} disabled={changesFixed} onClick={handleAdd}>Add</button>
                                    </div>
                                )
                            }
                            else{
                                return null;// do nothing
                            }
                        })
                    }
                    </div>
                    <div className="tertiary-container">
                    <h5>Candidates</h5>
                    {candidates.length !== 0 && (
                        candidates.map((candidate) => <div className="cmpgn-prtcpnts-pnl" key={candidate.email}>{candidate.name} with {candidate.email} as {"candidate"}<button className={!changesFixed ? "btn-del" : ""} disabled={changesFixed} onClick={removeHandler}>Remove</button></div>)
                    )}
                    </div>
                    <div className="tertiary-container">
                    <h5>Voters</h5>
                    {voters.length !== 0 && (
                        voters.map((voter) => <div className="cmpgn-prtcpnts-pnl" key={voter.email}>{voter.name} with {voter.email} as {"voter"} <button className={!changesFixed ? "btn-del" : ""} disabled={changesFixed} onClick={removeHandler}>Remove</button></div>)
                    )}
                    </div>
                    <div className="tertiary-container">
                    <h5>Observers</h5>
                    {observers.length !== 0 && (
                        observers.map((observer) => <div className="cmpgn-prtcpnts-pnl" key={observer.email}>{observer.name} with {observer.email} as {"observer"} <button className={!changesFixed ? "btn-del" : ""} disabled={changesFixed} onClick={removeHandler}>Remove</button></div>)
                    )}
                    </div>
                    <div className="tertiary-container">
                    <h5>Officials</h5>
                    {officials.length !== 0 && (
                        officials.map((official) => <div className="cmpgn-prtcpnts-pnl" key={official.email}>{official.name} with {official.email} as {"official"} <button className={!changesFixed ? "btn-del" : ""} disabled={changesFixed} onClick={removeHandler}>Remove</button></div>)
                    )}
                    </div>
                    <div>
                        <button
                            className={!changesFixed ? "btn-confirm" : ""}
                            onClick={confirmChanges}
                            disabled={changesFixed}
                        >Confirm Changes Permanently</button>
                    </div>
                </div>
            }
            <div className="secondary-container">
                {isParticipant() ? (
                    <div className="tertiary-container">
                        <h3>Voters' Panel</h3>
                        <h5>Please vote for one of these candidates</h5>
                        {candidates.map((candidate) => (
                            <div key={candidate.email}>
                                <span><b>{candidate.name}</b> with <i>{candidate.email}</i> has <b>{candidate.votes}</b> votes </span>
                                {voteAllowed() && <button className="btn-confirm" onClick={handleVote}>Vote!</button>}
                            </div>
                        ))}
                    </div>
                ) : <h3>You are not allowed to participate in this campaign</h3>}
            </div>
            <div className="secondary-container">
                <div>
                {displayStartStop() && renderStartStop()}
                </div>
            </div>
        </div>
    );
}

export default Vote;

// //BC Code
// const resp = await printLatestBlockNum();
// console.log(resp);
// console.log(typeof(resp));
// if(typeof(resp) === "bigint"){
//     console.log("BlockChain Connected");
//     blockChainConnectionFailed = false;
// }
// useEffect(()=>{
//     // printLatestBlockNum();
//     // campaignsCount();
//     // createNewCampaign("test-campaign-12", ["AZ", "BY", "CX"]);
//     // campaignDetails(11);
//     // vote(11, 1);
// }, );