import React from "react";
import TextField from '@mui/material/TextField';

function Input(props){
    console.log(props);
    return(
        <div>
            <TextField type={props.type}   fullWidth label="fullWidth" id="fullWidth" variant="outlined" />
        </div>
    )

}
export default Input;