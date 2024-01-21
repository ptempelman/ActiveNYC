import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

export const FilterBarCategory = ({ selectedCategories, setSelectedCategories, handleClearCategory, handleChangeCategories }: { selectedCategories: string[], setSelectedCategories: Dispatch<SetStateAction<string[]>>, handleClearCategory: () => void, handleChangeCategories: (event: SelectChangeEvent<string[]>, child: ReactNode) => void }) => {

    function CustomSelectIcon({ open }: { open: boolean }) {
        return open ?
            <IconButton sx={{ color: 'white' }}>
                <ArrowDropUpIcon sx={{ color: 'white' }} />
            </IconButton> :
            <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
                <ArrowDropDownIcon />
            </IconButton>

    }

    const [open, setOpen] = useState<boolean>(false);
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
                    value={selectedCategories}
                    onChange={handleChangeCategories}
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
                        selectedCategories.length > 0 ? (
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