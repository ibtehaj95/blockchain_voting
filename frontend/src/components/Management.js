import React, { useEffect, useState } from 'react';
import userContext from '../utils/UserContext';
import { useNavigate } from "react-router-dom";
import {getDocs, collection, deleteDoc, updateDoc, deleteField, doc} from "firebase/firestore";
import {deleteUser} from "firebase/auth";
import {auth, db} from "../config/firebase";

function Management(){

    const {userObj} = React.useContext(userContext);
    const [usersTable, setUsersTable] = useState([]);
    const [rldScrn, setRldScrn] = useState(false);
    const [campaignsTable, setCampaignsTable] = useState([]);
    const [eligibleUsersTable, setEligibleUsersTable] = useState([]);

    const navigateTo = useNavigate();

    const usersTableRef = collection(db, "users");
    const campaignsTableRef = collection(db, "campaigns");

    const updateEligibleUsers = () => {
        //look for all campaigns, find their participants and add them to an array
        if(campaignsTable.length > 0){
            campaignsTable.forEach((campaign) => {
                const nameasCollection = campaign.name.toLocaleLowerCase().replace(/\s/g, '');
                const oneCampaignColRef = collection(db, nameasCollection);
                populateParticipantsTable(oneCampaignColRef);
            })
        }
    }

    const populateParticipantsTable = async (ref) => {
        const resp = await getDocs(ref);
        const filtered_data = resp.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        // console.log(filtered_data[0]);
        setEligibleUsersTable((prev) => [
            ...prev,
            ...filtered_data[0].candidates,
            ...filtered_data[0].observers,
            ...filtered_data[0].officials,
            ...filtered_data[0].voters,
        ]);
    }

    const updateUsersTable = () => {
        getDocs(usersTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const users_data = resp.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setUsersTable(users_data);
        });
    }

    const updateCampaignsTable = () => {

        getDocs(campaignsTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const campaigns_data = resp.docs.map((doc) => ({
                ...doc.data(),
            }))
            return campaigns_data
        })
        .then((resp) => {
            // setCampaignsTable(resp);
            // console.log(resp);
            setCampaignsTable(resp);
        })
    }

    const handleApprove = (event) => {
        // console.log("Approve");
        const email = event.target.parentElement.childNodes[1].textContent;
        const userIdx = usersTable.findIndex((user) => user.email === email);
        // let newUserData = usersTable[userIdx];
        let userFBID = usersTable[userIdx].id;
        // newUserData = {
        //     name: newUserData.name,
        //     email: newUserData.email,
        //     password: newUserData.password,
        //     role: newUserData.role,
        //     approved: true
        // }
        // const newUsersTable = usersTable;
        // newUsersTable[userIdx] = newUserData;
        const oneCampaignDocRef = doc(db, "users", userFBID);
        updateDoc(oneCampaignDocRef, {
        approved: true,
        }).then(updateUsersTable());
        // localStorage.setItem("usersTable", JSON.stringify(newUsersTable));
        // setUsersTable(newUsersTable);
        // setRldScrn((prev) => !prev);
    }

    const handleDelete = (event) => {
        // console.log("Delete");
        const email = event.target.parentElement.childNodes[1].textContent;
        const userIdx = usersTable.findIndex((user) => user.email === email);
        if(usersTable[userIdx].role !== "admin"){
            // const newUsersTable = usersTable.filter((element) => element.email !== email);
            // localStorage.setItem("usersTable", JSON.stringify(newUsersTable));
            const userID = usersTable[userIdx].id;
            // console.log(userID);
            console.log(auth);
            updateUsersTable();
            const usersDocRef = doc(db, "users", userID);
            updateDoc(usersDocRef, {
                name: deleteField(),
                approved: deleteField(),
                email: deleteField(),
                password: deleteField(),
                role: deleteField(),
            })
            .then(deleteDoc(doc(db, "users", userID))).then(alert("Successfully Deleted. Please remove from Firebase authentication"));
            //remove from Firebase Authentication - Problem is that admin will need credentials, maybe the users should delete themselves
            //Firebase supplies an Admin module for this purpose (https://firebase.google.com/docs/auth/admin/manage-users)
            // deleteUser().catch((error) => console.log(error));
        }
        else{
            console.log("Deleting Protected Users not Allowed");
        }
    }

    const handleRoleChange = (event) => {
        // console.log("Role Change Confirmed");
        // console.log(event.target.parentElement.childNodes[2].childNodes[1].childNodes[1].value);
        // console.log(event.target.parentElement.children);
        const role = event.target.parentElement.childNodes[2].childNodes[1].childNodes[1].value;
        const email = event.target.parentElement.childNodes[1].textContent;
        const userIdx = usersTable.findIndex((user) => user.email === email);
        const userID = usersTable[userIdx].id;
        // let newUserData = usersTable[userIdx];
        // newUserData = {
        //     ...newUserData,
        //     role: role,
        // }
        // const newUsersTable = usersTable;
        // newUsersTable[userIdx] = newUserData;
        updateUsersTable();
        const usersDocRef = doc(db, "users", userID);
            updateDoc(usersDocRef, {
                role: role,
            });
        // localStorage.setItem("usersTable", JSON.stringify(newUsersTable));
        // setUsersTable(newUsersTable);
        // setRldScrn((prev) => !prev);
    }

    const alterationAllowed = (email) => {
        let pariticipationCount = 0;
        // if(campaignsTable.length > 0){
        //     campaignsTable.forEach((campaign) => {
        //         const uid = campaign.uid;
        //         const keyName = "campaign" + uid;
        //         const campaignDetails = JSON.parse(localStorage.getItem(keyName));
        //         const campaignParticipants = [
        //             ...campaignDetails.candidates, 
        //             ...campaignDetails.voters,
        //             ...campaignDetails.officials,
        //             ...campaignDetails.observers];
        //         const findRes = campaignParticipants.find((participant) => participant.email === email);
        //         if(findRes === undefined){
        //             //null
        //         }
        //         else{
        //             pariticipationCount = pariticipationCount + 1;
        //         }
        //     });
        //     if(pariticipationCount === 0){
        //         return true;
        //     }
        //     else{
        //         return false;
        //     }
        // }
        // else{
        //     return false;
        // }
        if(eligibleUsersTable.length === 0){
            return true;
        }
        else{
            const findRes = eligibleUsersTable.find((participant) => participant.email === email);
            if(findRes === undefined){
                //null
            }
            else{
                pariticipationCount = pariticipationCount + 1;
            }

            if(pariticipationCount === 0){
                return true;
            }
            else{
                return false;
            }

        }
    }

    useEffect(()=>{
        if (userObj.role !== "admin"){
            navigateTo("/home", {replace: true});
        }
        // setCampaignsTable(JSON.parse(localStorage.getItem("campaignsTable")));
        updateCampaignsTable();
    }, [userObj, navigateTo]);

    useEffect(() => {
        // setUsersTable(JSON.parse(localStorage.getItem("usersTable")));
        // console.log(usersTable.length);
        updateUsersTable();
    }, []);

    useEffect(() => {
        updateEligibleUsers();
    }, [campaignsTable]);

    // useEffect(() => {
    //     console.log(eligibleUsersTable);
    // }, [eligibleUsersTable]);

    // useEffect(() => {
    //     console.log(usersTable);
    // }, [usersTable]);

    return(
        <div>
            {(userObj.role === "admin" && usersTable.length !== 0) && (
                <div className='primary-container'>
                    <h1>User Management {rldScrn?null:null}</h1>
                        {usersTable.map((element) => {
                            if(element.authenticated === true){
                                return (
                                    <div className='user-mgmt-entry' key = {element.id}>
                                        <div>{element.name}</div>
                                        <div>{element.email}</div>
                                        {element.role !== "admin" ? <div>
                                            <div>Current Role: {element.role}</div>
                                            <div>Change Role: {
                                                <select>
                                                    <option>Select Role</option>
                                                    <option>voter</option>
                                                    <option>candidate</option>
                                                    <option>official</option>
                                                    <option>observer</option>
                                                </select>
                                            }</div>   
                                        </div> : null}
                                        {element.role !== "admin" ? (alterationAllowed(element.email) ? <button className='btn-confirm' onClick={handleRoleChange}>Confirm</button> : <button disabled={true} onClick={handleRoleChange}>Confirm</button>) : null}
                                        {element.role !== "admin" ? (alterationAllowed(element.email) ? <button className='btn-del' onClick={handleDelete}>Delete</button> : <button disabled={true} onClick={handleDelete}>Delete</button>) : null}
                                        {element.approved?"Approved":"Not Approved"}
                                        {element.approved === true ? null : (<button onClick={handleApprove}>Approve User</button>)}
                                    </div>
                                );
                            }
                            else{
                                return null;
                            }
                        }
                        )}
                </div>
            )}
        </div>
    );
}

export default Management;