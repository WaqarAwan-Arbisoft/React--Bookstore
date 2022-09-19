import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/loader";
import UserProfileInfo from "../components/user-profile-info";

const Profile = () => {
    const authStates = useSelector(states => states.auth)
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
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
            setUser(respData)
            setIsLoaded(true)
        }
    }
    useEffect(() => {
        if (authStates.isAuthenticated) {
            fetchUser();
        }

    }, [])
    return (
        <>
            {!isLoaded && (
                <div className="text-center my-4">
                    <Loader width="180" height="180" />
                </div>
            )}
            {isLoaded && (
                <div className="mx-auto container my-5">
                    <UserProfileInfo fetchUser={fetchUser} user={user} />
                </div>
            )
            }
        </>
    )
}

export default Profile;