import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";
import UserProfileInfo from "../components/user-profile-info";

const Profile = () => {
    const authStates = useSelector(states => states.auth)
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSelfProfile, setIsSelfProfile] = useState(false);
    const id = useParams().id
    const fetchUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-user/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            let respData = await response.json();
            setIsSelfProfile(authStates.id === respData.id)
            setUser(respData)
            setIsLoaded(true)
        }
        else {
            setUser(null)
            setIsLoaded(true)
        }
    }
    useEffect(() => {
        setIsLoaded(false)
        fetchUser();
    }, [])
    return (
        <>
            {!isLoaded && (
                <div className="text-center my-4">
                    <Loader width="180" height="180" />
                </div>
            )}
            {isLoaded && user && (
                <div className="mx-auto container my-5">
                    <UserProfileInfo isSelfProfile={isSelfProfile} fetchUser={fetchUser} user={user} id={id} />
                </div>
            )
            }
            {isLoaded && !user && (
                <h1 className="text-center m-5">
                    No user exists.
                </h1>
            )
            }
        </>
    )
}

export default Profile;