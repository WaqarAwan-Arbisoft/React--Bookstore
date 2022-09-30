import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/loader";
import NotificationCard from "../components/notification-card";
import RequestCard from "../components/request-card";
import SearchUserModal from "../components/search-user-modal";
import PrimaryBtn1 from "../UI/primary-btn";

const FriendRequests = () => {
    const authStates = useSelector(states => states.auth)
    const [requests, setRequests] = useState([])
    const [requestsLoaded, setRequestsLoaded] = useState(false)
    const [notificationLoaded, setNotificationLoaded] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalClose = () => {
        setModalOpen(false)
    }
    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const fetchFriendRequests = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/fetch-friend-requests/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setRequests([...respData])
            setRequestsLoaded(true)
        }
        else {
            setRequests([])
            setRequestsLoaded(true)
        }
    }
    const fetchFriendshipNotification = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/friendship-notifications/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setNotifications([...respData])
            setNotificationLoaded(true)
        }
        else {
            setNotifications([])
            setNotificationLoaded(true)
        }
    }
    const acceptRequest = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/accept-request/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            },
            body: JSON.stringify({
                initiatedBy: userId
            })
        });
        if (response.ok) {
            let respData = await response.json()
            fetchFriendRequests()
        }
    }
    const declineRequest = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/remove-request/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        });
        if (response.ok) {
            fetchFriendRequests()
        }
    }
    useEffect(() => {
        fetchFriendRequests();
        fetchFriendshipNotification()
    }, [])
    return (
        <>
            <SearchUserModal open={modalOpen} handleClose={handleModalClose} />
            <div className="p-4">
                <h1 className="text-center my-4">Requests</h1>
                <div className="text-center m-4">
                    <PrimaryBtn1 onClick={handleModalOpen}>Search User</PrimaryBtn1>
                </div>
                {!requestsLoaded &&
                    <div className="text-center m-5">
                        <Loader width="100" height="100" />
                    </div>
                }
                <div className="container mx-auto ">
                    {(requestsLoaded && requests.length > 0) &&
                        <>
                            {requests.map((request, index) => (
                                <RequestCard key={index} request={request} acceptRequest={acceptRequest} declineRequest={declineRequest} />
                            ))}
                        </>
                    }
                </div>

                {(requestsLoaded && requests.length === 0) &&
                    <>
                        <h2 className="text-center m-5 text-muted">No Request received.</h2>
                    </>
                }
            </div>

            <div className="p-4">
                <h1 className="text-center my-4">Notifications</h1>
                {!notificationLoaded &&
                    <div className="text-center m-5">
                        <Loader width="100" height="100" />
                    </div>
                }
                <div className="container mx-auto ">
                    {(notificationLoaded && notifications.length > 0) &&
                        <>
                            {notifications.map((notification, index) => (
                                <NotificationCard key={index} notification={notification} />
                            ))}
                        </>
                    }
                </div>

                {(notificationLoaded && notifications.length === 0) &&
                    <>
                        <h2 className="text-center m-5 text-muted">No Request received.</h2>
                    </>
                }
            </div>
        </>


    )
}

export default FriendRequests;