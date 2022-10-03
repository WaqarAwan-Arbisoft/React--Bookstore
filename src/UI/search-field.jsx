import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from "@mui/material";

const SearchField = (props) => {
    return (
        <TextField
            id="input-with-icon-textfield"
            fullWidth
            InputProps={{
                placeholder: props.placeholder,
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            variant="standard"
            onChange={props.onChange}
        />
    )
}

export default SearchField;