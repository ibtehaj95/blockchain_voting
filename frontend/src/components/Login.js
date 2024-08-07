import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../utils/UserContext";
import {getDocs, collection} from "firebase/firestore";
import {db} from "../config/firebase";
import {signInWithEmailAndPassword, sendEmailVerification, signOut} from "firebase/auth";
import { auth } from "../config/firebase";

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usersTable, setUsersTable] = useState([]);
    const {setUserObj} = React.useContext(userContext);
    const navigateTo = useNavigate();

    const usersTableRef = collection(db, "users");

    const logOut = async () => {
        await signOut(auth);
    }

    const updateUsersTable = () => {
        getDocs(usersTableRef)
        .then((resp) => {
            // console.log(resp.docs[0]._document.data.value.mapValue.fields);
            const users_data = resp.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setUsersTable(users_data);
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const resp = await signInWithEmailAndPassword(auth, email, password);
            // console.log(resp);
            const find_res = usersTable.find((entry) => (entry.email === resp.user.email));
            if(find_res !== undefined){
                // console.log(find_res);
                // console.log(`Logged In. Welcome ${find_res.name}`);
                // alert(`Logged In. Welcome ${find_res.name}`);
                setUserObj({
                    name: find_res.name,
                    role: find_res.role,
                    email: find_res.email,
                    docID: find_res.id,
                });
                if(find_res.role === "admin" && resp.user.emailVerified === false){
                    await sendEmailVerification(auth.currentUser);
                    navigateTo("/home");
                }
                else{
                    navigateTo("/home");
                }
            }
        }
        catch{
            console.log("User Not Found / Password Incorrect");
            alert("User Not Found / Password Incorrect");
        }
        finally{
            setEmail("");
            setPassword("");
        }
    }

    useEffect(() => {
        // setUsersTable(JSON.parse(localStorage.getItem("usersTable")));
        updateUsersTable();
        logOut();
    }, []);

    // useEffect(() => {
    //     console.log(usersTable);
    // }, [usersTable]);

    return(
        <div className="primary-container">
            <h1>Log Yourself In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email: </label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} pattern=".+@outlook\.de" size={50} maxLength={50} id="email" title="Please only use an @outlook.de email" required></input>
                <br></br>
                <label htmlFor="password">Password: </label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} pattern="^[a-zA-Z0-9_\s]*$" size={20} minLength={8} maxLength={20} id="password" title="8 Characters Minimum" required></input>
                <br></br>
                <input type="submit"></input>
            </form>
        </div>
    );
}

export default Login;