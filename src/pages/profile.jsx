import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/loader";

const Profile = () => {
    const authStates = useSelector(states => states.auth)
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-user/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authStates.token}`
                }
            })
            if (response.ok) {
                let respData = await response.json();
                console.log(respData);
                setUser(respData)
                setIsLoaded(true)
            }
        }
        fetchUser();
    }, [])
    return (
        <>
            {!isLoaded && (
                <div className="text-center my-4">
                    <Loader width="180" height="180" />
                </div>
            )}
            {isLoaded && (
                <h1>USER LOADED</h1>
            )}
        </>
    )
}

export default Profile;