import { useEffect, useState } from "react";
import {db} from "../config/firebase";
import {getDocs, addDoc, collection} from "firebase/firestore";
import {createUserWithEmailAndPassword, sendEmailVerification, signOut} from "firebase/auth";
import { auth } from "../config/firebase";

function Register(){

    const [name, setName] = useState("Vorname Nachname");
    const [email, setEmail] = useState("vorname.nachname@outlook.de");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("voter");
    const [usersTable, setUsersTable] = useState([]);

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
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        setName("");
        setEmail("");
        setPassword("");
        setRole("voter");
        
        let emailExists = true;

        const find_res = usersTable.find((entry) => (entry.email === email));

        if(find_res !== undefined ){
            emailExists = false;
        }
        else{
            emailExists = true;
        }

        if (usersTable){
            const find_res = usersTable.find((entry) => (entry.email === email));
            if(find_res){
                emailExists = true;
            }
            else{
                emailExists = false;
            }
        }

        if(emailExists){
            console.log("An account with the email already exists. Please Login");
            alert("An account with the email already exists. Please Login");
        }

        else{

            try{
                await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(auth.currentUser);
                await signOut(auth);
                const user = {
                    name: name,
                    email: email,
                    role: role,
                    approved: false,
                    authenticated: false,
                };
                addDoc(usersTableRef, user);
                updateUsersTable();
                console.log("User Created. Check Mailbox for the verification email (incl. Junk/Spam)");
                alert("User Created. Check Mailbox for the verification email (incl. Junk/Spam)");
            }
            catch{
                console.log("Couldn't create user");
                alert("Couldn't create user");
            }
        }
    
        //     let newUsersTable = [];
    
        //     if(usersTable){
        //         newUsersTable = [
        //             ...usersTable,
        //             user,
        //         ]
        //     }
        //     else{
        //         newUsersTable = [
        //             user,
        //         ]
        //     }
    
        //     // localStorage.setItem("usersTable", JSON.stringify(newUsersTable));
        //     // setUsersTable(JSON.parse(localStorage.getItem("usersTable")));
        //     console.log("User Registered");
        //     alert("User Registered");
        // }

        // const userFB = {
            //     name: name,
            //     email: email,
            //     password: password,
            //     role: role,
            //     approved: false
            // };
            // addDoc(usersTableRef, userFB);
    };

    useEffect(() => {
        // setUsersTable(JSON.parse(localStorage.getItem("usersTable")));
        updateUsersTable();
        logOut();
    }, []);

    // useEffect(() => {
    //     console.log(usersTable);
    // }, [usersTable]);

    return(
        <div>
            <h1>Welcome to the Register Page</h1>
            <h3>Please fill out the form below to register yourself</h3>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input type="text" value={name} onChange={(event) => setName(event.target.value)} pattern="^[a-zA-Z0-9_\s]*$" id="name" size={50} maxLength={50} required></input>

                <br></br>
                <label htmlFor="email">Email: </label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} pattern=".+@outlook\.de" size={50} maxLength={50} id="email" title="Please only use an @outlook.de email" required></input>

                <br></br>
                <label htmlFor="password">Password: </label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} pattern="^[a-zA-Z0-9_\s]*$" size={20} minLength={8} maxLength={20} id="password" title="8 Characters Minimum" required></input>
                
                <br></br>
                <label htmlFor="role">Registering as: </label>
                <select id="role" value={role} onChange={(event) => setRole(event.target.value)} required>
                    <option value="voter" >Voter</option>
                    <option value="candidate" >Candidate</option>
                    <option value="official" >Official</option>
                    <option value="observer" >Observer</option>
                </select>
                <br></br>
                <input type="submit"></input>
            </form>

        </div>
    );
}

export default Register;