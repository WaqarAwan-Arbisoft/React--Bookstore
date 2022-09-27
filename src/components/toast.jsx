
import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

const AppToast = (props) => {
    const [show, setShow] = useState(props.show ? true : false);
    const delayTime = 4000;
    return (

        <Toast onClose={() => setShow(false)} show={show} autohide delay={delayTime} bg={props.bg ? props.bg : 'danger'}>
            <Toast.Header>
                {props.success ? (
                    <>
                        <ThumbUpAltOutlinedIcon />&nbsp;
                    </>
                ) : <>
                    <ErrorOutlineOutlinedIcon />&nbsp;
                </>}

                <strong className="me-auto">{props.title ? props.title : 'Failure'}</strong>
            </Toast.Header>
            <Toast.Body className='text-white'>{props.message}</Toast.Body>
        </Toast>

    );
}

export default AppToast;