import * as React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AppToast = (props) => {
    return (
        <Snackbar open={props.open} autoHideDuration={props.autoHideDuration ? props.autoHideDuration : 800} onClose={props.onClose}>
            <Alert severity={props.severity ? props.severity : 'success'} sx={{ width: '100%' }}>
                {props.message}
            </Alert>
        </Snackbar>
    )
}

export default AppToast;