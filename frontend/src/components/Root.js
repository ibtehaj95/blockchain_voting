import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Root(){

    const navigateTo = useNavigate();

    useEffect(() => {
        navigateTo("/login");
    }, [navigateTo]);

    return(
        <div>
            This is just a placeholder page. Please wait while you're redirected
        </div>
    );
}

export default Root;