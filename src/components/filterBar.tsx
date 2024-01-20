import { Button, ButtonGroup, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ClassNames } from "@emotion/react";

export const FilterBar = () => {
    const [value, setValue] = useState('');
    const handleClear = () => {
        setValue('');
    };

    const [selectedValues, setSelectedValues] = useState([]);

    const handleChange = (event) => {
        setSelectedValues(event.target.value);
    };

    const isSelected = (value) => selectedValues.includes(value);

    const options = [
        { value: 'Party', label: 'Party' },
        { value: 'Bar', label: 'Bar' },
        { value: 'Relaxing', label: 'Relaxing' },
        { value: 'Adventure', label: 'Adventure' },
        { value: 'Indoor', label: 'Indoor' },
        { value: 'Outdoor', label: 'Outdoor' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Cultural', label: 'Cultural' },
    ];

    return (
        <div className="border-slate-400 border-b h-14 w-full">
            <div className="flex flex-wrap -mx-2 h-full">
                <div className="w-full md:w-4/12 px-2 border-r border-slate-400">
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
                            style={{
                                borderBottom: '1px solid white', // Sets the underline color
                            }}
                        />
                    </div>

                </div>
                <div className="w-full md:w-5/12 px-2 border-r border-slate-400">
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-multiple-select-label"
                            id="demo-multiple-select"
                            multiple
                            value={selectedValues}
                            onChange={handleChange}
                            displayEmpty
                            placeholder="Category"
                            renderValue={selected => selected.length === 0 ? <em>Category</em> : selected.join(', ')}
                            sx={{
                                '.MuiSelect-select': {
                                    color: 'white',
                                }
                            }}
                        >
                            <MenuItem disabled value="">
                                Category
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                        backgroundColor: isSelected(option.value) ? 'lightblue' : 'inherit',
                                        '&.Mui-selected': {
                                            backgroundColor: 'black', // Background color for the clicked item
                                            color: 'white', // Text color for the clicked item
                                        },
                                        '&:hover': {
                                            backgroundColor: 'black', // Also maintain the color on hover
                                            color: 'white', // Text color for the clicked item
                                        },
                                    }}

                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="w-full md:w-3/12 px-2">
                </div>
            </div>
        </div >
    )
}