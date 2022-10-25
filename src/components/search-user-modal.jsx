import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { InputAdornment, Pagination, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SearchedUserCard from './searched-user-card';
import { USER_SEARCH_LIMIT } from '../constant/paginations';


const SearchUserModal = (props) => {
    const [users, setUsers] = useState([])
    const [count, setCount] = useState(0);
    const authStates = useSelector(states => states.auth)
    const searchUserHandler = async (e) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-all/?search=${e === undefined ? '' : e.target.value}&limit=${USER_SEARCH_LIMIT}&offset=0`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + authStates.token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            let respData = await response.json();
            setUsers([...respData.results])
            setCount(Math.ceil(respData.count / USER_SEARCH_LIMIT))
        }
        else {
            setUsers([])
            setCount(0)
        }

    }
    useEffect(() => {
        searchUserHandler();
    }, [])

    const paginationHandler = async (e) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-all/?offset=${USER_SEARCH_LIMIT * (parseInt(e.target.innerText) - 1)}&limit=${USER_SEARCH_LIMIT}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authStates.token
            }
        })
        let respData;
        if (response.ok) {
            respData = await response.json();
            setUsers([...respData.results])
            setCount(Math.ceil(respData.count / USER_SEARCH_LIMIT))
        }
        else {
            setUsers([...respData.results])
            setCount(0)
        }
    }
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
                            placeholder: "Search user by name or email...",
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
                {users.length === 0 && <h3 className='text-muted text-center my-3'>
                    No user found.
                </h3>}
                <div className="d-flex justify-content-center my-4">
                    {count !== 0 && <Pagination hideNextButton={true} hidePrevButton={true} count={count} onClick={paginationHandler} />}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SearchUserModal;