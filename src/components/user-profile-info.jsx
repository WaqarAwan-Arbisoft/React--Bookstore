import EmailIcon from '@mui/icons-material/Email';
import { TextField } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PrimaryBtn1 from '../UI/primary-btn';
import ErrorAlert from './error-alert';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useEffect } from 'react';

const UserProfileInfo = (props) => {
    const { isSelfProfile } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(props.user.name)
    const [password, setPassword] = useState(props.user.password)
    const [country, setCountry] = useState(props.user.country)
    const [age, setAge] = useState(props.user.age)
    const [profileImage, setProfileImage] = useState(props.user.image);
    const [error, setError] = useState({ status: false, message: '' });
    const [image, setImage] = useState(props.user.image);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const authStates = useSelector(states => states.auth);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isInitiator, setIsInitiator] = useState()
    const onImageChangeHandler = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setIsImageChanged(true);
        setProfileImage(URL.createObjectURL(file))
    }
    const nameChangeHandler = (e) => {
        setName(e.target.value);
    }
    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }
    const countryChangeHandler = (e) => {
        setCountry(e.target.value);
    }
    const ageChangeHandler = (e) => {
        setAge(e.target.value);
    }
    const toggleForm = () => {
        setIsEditing(!isEditing)
    }
    const saveChangeHandler = async (e) => {
        if (password && password.length > 0 && password.length < 5) {
            setError({ status: true, message: "Password should be at least 5 characters long." });
            return;
        }
        if (name.length === 0) {
            setError({ status: true, message: "Name field cannot be empty." });
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        if (password && password.length > 0) {
            formData.append('password', password);
        }
        if (country.length === 0) {
            formData.append('country', 'Pakistan');
        }
        else {
            formData.append('country', country)
        }
        if (age.length === 0) {
            formData.append('age', 18)
        } else {
            formData.append('age', age)
        }
        if (isImageChanged) {
            formData.append('image', image)
        }


        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/update/`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Token ' + authStates.token
            },
            body: formData
        })
        if (response.ok) {
            let respData = await response.json()
            setError({ ...error, status: false })
            setIsEditing(false)
            props.fetchUser();
        }
        else {
            let respData = await response.json()
            setError({ status: true, message: respData.detail })
        }

    }

    const addAsFriendHandler = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/add-as-friend/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            },
            body: JSON.stringify({
                initiatedTowards: userId
            })
        })
        if (response.ok) {
            setIsRequestSent(true);
            setIsFriend(false);
        }
    }
    const removeFromFriendsHandler = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/remove-friend/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            setIsRequestSent(false);
            setIsFriend(false);
        }
    }
    const removeRequestHandler = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/remove-request/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            setIsRequestSent(false);
            setIsFriend(false);
        }
    }
    const requestAcceptHandler = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/accept-request/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            },
            body: JSON.stringify({
                initiatedBy: userId
            })
        })
        if (response.ok) {
            setIsFriend(true);
        }
    }
    const checkIfFriends = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/is-friend/${props.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setIsFriend(true);
            if (respData.initiatedBy.id === authStates.id) {
                setIsInitiator(true)
            }
            else {
                setIsInitiator(false)
            }
        }
        else {
            setIsFriend(false);
            checkIfRequestSent();
        }
    }
    const checkIfRequestSent = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/is-request-sent/${props.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setIsRequestSent(true);
            if (respData.initiatedBy.id === authStates.id) {
                setIsInitiator(true)
            }
            else {
                setIsInitiator(false)
            }
        }
        else {
            setIsRequestSent(false);
        }
    }
    useEffect(() => {
        checkIfFriends();
    }, [])
    return (
        <div className="user-profile-info-card">
            <div className="text-center">
                <h4>User Profile Information</h4>
                {!isEditing && <img src={profileImage} alt="PROFILE_IMAGE" width={150} className='rounded-circle' />}
                {isEditing &&
                    <div className='mx-auto'>
                        <label htmlFor='profile_image'>
                            <img src={profileImage} alt="PROFILE_IMAGE" className='rounded-circle' width={150} />
                        </label>

                        <div className='d-none'>
                            <input className='d-inline' id="profile_image" type='file' accept="image/*" onChange={onImageChangeHandler} />
                        </div>
                    </div>
                }
            </div>
            <div className="my-4">
                {error.status ? (
                    <div className='w-50 mx-auto my-3'>
                        <ErrorAlert message={error.message} />
                    </div>
                ) : ''}
                <div className="fs-4 mt-4">
                    <b>Email:</b>
                    <div className="container">{props.user.email}</div>
                </div>
                <div className="fs-4 mt-3">
                    {isEditing &&
                        <>
                            <b>New Password<sup className='text-danger'> *</sup>:</b>
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                label="New Password"
                                name="password"
                                type="password"
                                id="password"
                                onChange={passwordChangeHandler}
                            />
                            <small className='text-muted mt-0'>Old password will be considered if left unchanged.</small>
                        </>
                    }
                </div>
                <div className="fs-4 mt-3">
                    <b>Name{isEditing && <sup className='text-danger'> *</sup>}:</b>
                    {!isEditing && <div className="container">{props.user.name}</div>}
                    {isEditing && <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        type="text"
                        id="name"
                        onChange={nameChangeHandler}
                        value={name}
                    />}
                </div>
                <div className="fs-4 mt-3">
                    <b>Country:</b>
                    {!isEditing && <div className="container">{props.user.country}</div>}
                    {isEditing && <TextField
                        margin="normal"
                        fullWidth
                        name="country"
                        type="text"
                        id="country"
                        onChange={countryChangeHandler}
                        value={country}
                    />}
                </div>
                <div className="fs-4 mt-3">
                    <b>Age:</b>
                    {!isEditing && <div className="container">{props.user.age}</div>}
                    {isEditing && <TextField
                        margin="normal"
                        fullWidth
                        name="age"
                        type="number"
                        id="age"
                        onChange={ageChangeHandler}
                        value={age}
                    />}
                </div>
                {isSelfProfile && (
                    <div className="fs-4 mt-3">
                        <b>Role:</b>
                        <div className="container">{authStates.admin === false ? 'User' : 'Administrator'}</div>
                    </div>
                )}
                {isSelfProfile ? (
                    <div className='my-3 d-flex justify-content-center'>
                        {!isEditing && <PrimaryBtn1 color={'success'} onClick={toggleForm}>Edit Profile</PrimaryBtn1>}
                        {isEditing &&
                            <div className='text-center'>
                                <div className='my-2'>
                                    <PrimaryBtn1 onClick={saveChangeHandler}>Save Changes</PrimaryBtn1>
                                </div>
                                <div className='my-2'>
                                    <PrimaryBtn1 onClick={() => { setIsEditing(false) }} color='error'>Back</PrimaryBtn1>
                                </div>
                            </div>}

                    </div>
                ) : (
                    <div className='my-3 d-flex justify-content-center'>
                        {isFriend && (
                            <PrimaryBtn1 color={'error'} onClick={() => { removeFromFriendsHandler(props.id) }}>Remove from Friend &nbsp;<NotInterestedIcon /></PrimaryBtn1>
                        )}
                        {!isFriend && isRequestSent && (
                            <>
                                {isInitiator ? (
                                    <PrimaryBtn1 color={'success'} onClick={() => { removeRequestHandler(props.id) }}>Friend Request Sent &nbsp;<ScheduleSendIcon /></PrimaryBtn1>
                                ) : (
                                    <PrimaryBtn1 color={'success'} onClick={() => { requestAcceptHandler(props.id) }}>Accept &nbsp;<ScheduleSendIcon /></PrimaryBtn1>
                                )}
                            </>
                        )}
                        {!isFriend && !isRequestSent && (
                            <PrimaryBtn1 color={'success'} onClick={() => { addAsFriendHandler(props.id) }}>Add as Friend &nbsp;<PersonAddOutlinedIcon /></PrimaryBtn1>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default UserProfileInfo;