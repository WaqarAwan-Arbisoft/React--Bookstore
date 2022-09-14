import { Alert } from "@mui/material";

const ErrorAlert = (props) => {
    return (
        <Alert className='mt-3' variant="filled" severity="error">
            {props.message}
        </Alert>
    );
}

export default ErrorAlert;