import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../utils/UserContext";
import {db} from "../config/firebase";
import {getDocs,addDoc, collection} from "firebase/firestore";
import { auth } from "../config/firebase";

function NewCampaign(){

    const [cName, setCname] = useState("Campaign Name");
    const [campaignsTable, setCampaignsTable] = useState([]);

    const {userObj} = React.useContext(userContext);
    const navigateTo = useNavigate();

    const campaignsTableRef = collection(db, "campaigns");

    const updateCampaignsTable = () => {

        getDocs(campaignsTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const campaigns_data = resp.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            return campaigns_data
        })
        .then((resp) => {
            // setCampaignsTable(resp);
            // console.log(resp);
            setCampaignsTable(resp);
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setCname("");

        let campaignExists = true;

        const find_res = campaignsTable.find((campaign) => (campaign.name === cName));

        if(find_res === undefined){
            campaignExists = false;
        }

        if(campaignExists){
            console.log("Error: A campaign with the given name already exists");
            alert("Error: A campaign with the given name already exists");
        }
        else{

            const campaign = {
                name: cName,
            };

            addDoc(campaignsTableRef, campaign);
            updateCampaignsTable();

            const campaignDetails = {
                name: cName,
                voters: [],
                candidates: [],
                observers: [],
                officials: [],
                running: false,
                changesFixed: false,
                blockChainIndex: 0,
                campaignEnded: false,
                campaignEthAcc: "",
            }

            const cDBName = cName.toLocaleLowerCase().replace(/\s/g, '');
            const campaignDetailsRef = collection(db, cDBName);
            addDoc(campaignDetailsRef, campaignDetails);

            console.log("Campaign Created");
            alert("Campaign Created");
        }
    }

    useEffect(()=>{
        if (userObj.role !== "admin"){
            navigateTo("/home", {replace: true});
        }
    }, [userObj, navigateTo]);

    // useEffect(()=>{
    //     console.log(campaignsTable);
    // }, [campaignsTable]);

    useEffect(()=>{
        // setCampaignsTable(JSON.parse(localStorage.getItem("campaignsTable")));
        updateCampaignsTable();
    }, []);

    return(
        <div className='primary-container'>
            {auth.currentUser!=null && auth.currentUser.emailVerified===true && (
                <>
                    <h1>Welcome to the Campaign Creation Page</h1>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="cname">Campaign Name: </label>
                        <input type="text" value={cName} onChange={(event) => setCname(event.target.value)} pattern="^[a-zA-Z0-9_\s\-]*$" id="cname" size={50} maxLength={50} required></input>
                        <input type="submit"></input>
                    </form>  
                </>
            )}
        </div>
    );
}

export default NewCampaign;