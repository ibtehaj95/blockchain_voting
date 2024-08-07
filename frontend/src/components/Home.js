import React, { useEffect, useState } from 'react';
import userContext from '../utils/UserContext';
import { Link } from 'react-router-dom';
import {db} from "../config/firebase";
import {getDocs, collection, deleteDoc, updateDoc, deleteField, doc} from "firebase/firestore";
import { auth } from "../config/firebase";
import {signOut, sendEmailVerification} from "firebase/auth";

function Home(){

    const {userObj, setUserObj} = React.useContext(userContext);
    const [campaignsTable, setCampaignsTable] = useState([]);

    const campaignsTableRef = collection(db, "campaigns");

    const logOut = async () => {
        // console.log("LogOut");
        await signOut(auth);
        setUserObj({
            name: "loggedOut",
            role: "loggedOut",
            email: "loggedOut",
          });
    };

    const verify = async () => {
        try{
            await sendEmailVerification(auth.currentUser);
            console.log("Email sent. Check Mailbox (incl. Junk/Spam)");
            alert("Email sent. Check Mailbox (incl. Junk/Spam)");
        }
        catch{
            console.log("Email couldn't be sent");
            alert("Email couldn't be sent");
        }
    };

    const setAuthenticated = async () => {
        const userID = userObj.docID;
        const usersDocRef = doc(db, "users", userID);
            updateDoc(usersDocRef, {
                authenticated: true,
            });
        return true;
    }

    const updateCampaignsTable = () => {
        getDocs(campaignsTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const campaigns_data = resp.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setCampaignsTable(campaigns_data);
        })
    };

    const handleDelete = (event) => {
        // console.log("Delete Campaign");
        const nameInCollection = event.target.parentElement.children[0].textContent;
        const nameasCollection = nameInCollection.toLocaleLowerCase().replace(/\s/g, '');
        const campaignIdx = campaignsTable.findIndex((campaign) => campaign.name === nameInCollection);
        const campaignId = campaignsTable[campaignIdx].id;
        let campaignDataId = null;
        const campaignsDocRef = doc(db, "campaigns", campaignId);
        updateDoc(campaignsDocRef, {
            name: deleteField()
        })
        .then(deleteDoc(doc(db, "campaigns", campaignId)))
        .then(() => {
            const oneCampaignColRef = collection(db, nameasCollection);
            getDocs(oneCampaignColRef)
            .then((resp) => {
                // console.log(resp.docs[0]._document.data.value.mapValue.fields);
                const filtered_data = resp.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                campaignDataId = filtered_data[0].id;
            })
            .then(() => {
                const oneCampaignDocRef = doc(db, nameasCollection, campaignDataId);
                updateDoc(oneCampaignDocRef, {
                name: deleteField(),
                candidates: deleteField(),
                observers: deleteField(),
                officials: deleteField(),
                running: deleteField(),
                voters: deleteField(),
                })
                .then(deleteDoc(doc(db, nameasCollection, campaignDataId)).then(updateCampaignsTable()));
            });
        });
        // const campaignLclStrKey = "campaign" + campaignId;
        // const newCampaignsTable = campaignsTable;
        // newCampaignsTable.splice(campaignIdx, 1);
        // localStorage.setItem("campaignsTable", JSON.stringify(newCampaignsTable));
        // setCampaignsTable(JSON.parse(localStorage.getItem("campaignsTable")));
        // localStorage.removeItem(campaignLclStrKey);
    };

    useEffect(() => {
        // console.log(userObj);
        // console.log(auth);
        // setCampaignsTable(JSON.parse(localStorage.getItem("campaignsTable")));
        // getDocs(campaignsTableRef)
        // .then((resp) => {
        //     // console.log(resp.docs[0]._document.data.value.mapValue.fields);
        //     const filtered_data = resp.docs.map((doc) => ({
        //         ...doc.data(),
        //         id: doc.id,
        //     }));
        //     return filtered_data;
        // })
        // .then((resp) => {
        //     // setCampaignsTable(resp);
        //     // console.log(resp);
        //     setCampaignsTable(resp);
        // })
        updateCampaignsTable();
    }, [userObj]);

    // useEffect(() => {
    //     console.log(campaignsTable);
    // }, [campaignsTable]);

    return(
        <div className='primary-container'>
            <h1>This is the Elections Management Suite. So, what are we voting on today?</h1>
            <div className='home-greeting'>
                <h3>You are logged in as {userObj.name}</h3>
                {userObj.name!=="loggedOut" ? <button className='btn-logout' onClick={logOut} >Logout</button> : <h3>Please register to see the contents of this page. This line should ideally never appear</h3>}
            </div>
            {auth.currentUser!=null && auth.currentUser.emailVerified===false && <div><h5>Email Unverified. Content Unavailable</h5> <button onClick={verify}>Verify</button></div>}
            {auth.currentUser!=null && auth.currentUser.emailVerified===true && setAuthenticated() && campaignsTable.length > 0 && campaignsTable.map((campaign) => (
                <div className='campaign-links' key={campaign.id}>
                    <Link to={`/campaign/${(campaign.name).toLocaleLowerCase().replace(/\s/g, '')}`}>{campaign.name}</Link> {userObj.name === "Admin" && <button className='btn-del' onClick={handleDelete}>Delete</button>}
                </div>
            ))}
        </div>
    );
}

export default Home;