import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SearchedUserCard from './searched-user-card';


const SearchUserModal = (props) => {
    const [users, setUsers] = useState([])
    const authStates = useSelector(states => states.auth)
    const searchUserHandler = async (e) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-all/?search=${e === undefined ? '' : e.target.value}`, {
            method: "GET",
            headers: {
                'Authorization': 'Token ' + authStates.token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            let respData = await response.json();
            setUsers([...respData])
        }

    }
    useEffect(() => {
        searchUserHandler();
    }, [])
    return (
        <Modal

            show={props.open}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" className='w-75 mx-auto py-3'>

                    <TextField
                        id="input-with-icon-textfield"
                        fullWidth
                        InputProps={{
                            placeholder: "Search user by name...",
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        onChange={searchUserHandler}
                    />

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {users.map((user) => (
                    <SearchedUserCard key={user.id} user={user} />
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SearchUserModal;