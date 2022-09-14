import { Button } from "@mui/material";

const PrimaryBtn1 = (props) => {
    return (
        <Button variant="contained" color={props.color ? props.color : 'primary'} onClick={props.onClick} className={props.className}>{props.children}</Button>
    )
}

export default PrimaryBtn1;