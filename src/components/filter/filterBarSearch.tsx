import { Button, ButtonGroup, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ClassNames } from "@emotion/react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


export const FilterBarSearch = () => {
    const [value, setValue] = useState('');
    const handleClear = () => {
        setValue('');
    };
    
    return (
        <div className="flex justify-center">
            <TextField className="w-5/6"
                id="standard-search"
                label="Search"
                variant="standard"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                InputProps={{
                    style: { color: 'white' }, // Sets the text color
                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClear}>
                                <CloseIcon style={{ color: 'white' }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                InputLabelProps={{
                    style: { color: 'white' }, // Sets the label color
                }}

                sx={{
                    borderBottom: '1px solid white',
                    fontStyle: 'italic'
                }}
            />
        </div>)


}