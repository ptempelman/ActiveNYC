import { Button, ButtonGroup, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ClassNames } from "@emotion/react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { FilterBarSearch } from "./filterBarSearch";

export const FilterBarCategory = () => {

    function CustomSelectIcon({ open }: { open: boolean }) {
        return open ?
            <IconButton sx={{ color: 'white' }}>
                <ArrowDropUpIcon sx={{ color: 'white' }} />
            </IconButton> :
            <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
                <ArrowDropDownIcon />
            </IconButton>

    }

    const handleClearCategory = () => {
        setSelectedValues([]);
    }

    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setSelectedValues(event.target.value as string[]);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const options = [
        { value: 'Party', label: 'Party' },
        { value: 'Relaxing', label: 'Relaxing' },
        { value: 'Adventure', label: 'Adventure' },
        { value: 'Cultural', label: 'Cultural' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Bar', label: 'Bar' },
        { value: 'Indoor', label: 'Indoor' },
        { value: 'Outdoor', label: 'Outdoor' },
    ];


    return (
        <div className="">
            <FormControl fullWidth>
                <Select
                    labelId="demo-multiple-select-label"
                    id="demo-multiple-select"
                    multiple
                    value={selectedValues}
                    onChange={handleChange}
                    open={open}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    placeholder="Category"
                    displayEmpty
                    renderValue={selected => selected.length === 0 ? <em>Category</em> : selected.join(', ')}
                    IconComponent={() => <CustomSelectIcon open={open} />}
                    sx={{
                        '.MuiSelect-select': {
                            color: 'white',
                            paddingTop: '20px',
                            paddingBottom: '10px', // Adjust padding to control height
                        },
                        '&.MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent', // Hide border
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent', // Hide border on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'transparent', // Hide border on focus
                            },
                        },
                    }}
                    endAdornment={
                        selectedValues.length > 0 ? (
                            <IconButton onClick={handleClearCategory} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        ) : null
                    }
                >
                    {options.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
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
    )
}