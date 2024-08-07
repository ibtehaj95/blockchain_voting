import React, { useEffect } from "react";
import userContext from '../utils/UserContext';
import { Outlet, useNavigate } from "react-router-dom";

function PrivateRoutes(){
    const {userObj} = React.useContext(userContext);
    const navigateTo = useNavigate();
    // console.log(userObj.name);
    // console.log(userObj.name==="loggedOut"?"loggedOut":"legitUser");
    // <Navigate to="/login"></Navigate>;
    //this could also have been used in the ternary in the return statement
    //Would have also been simpler. 
    //But the React team suggests useNavigate in functional components

    useEffect(() => {
        userObj.name==="loggedOut" && navigateTo("/login");
    },[userObj.name, navigateTo]);

    return (
        userObj.name!=="loggedOut" && <Outlet></Outlet>
    );
}

export default PrivateRoutes;