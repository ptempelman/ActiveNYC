import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FilterBarCategory } from "./filterBarCategory";
import { FilterBarSearch } from "./filterBarSearch";


export const FilterBar = ({ selectedCategories, setSelectedCategories, handleClearCategory, handleChangeCategories, searchValue, setSearchValue, handleClearSearch }: { selectedCategories: string[], setSelectedCategories: Dispatch<SetStateAction<string[]>>, handleClearCategory: () => void, handleChangeCategories: (event: SelectChangeEvent<string[]>, child: ReactNode) => void, searchValue: string, setSearchValue: (e: string) => void, handleClearSearch: () => void }) => {

    function CustomSelectIcon({ open }: { open: boolean }) {
        return open ?
            <IconButton sx={{ color: 'white' }}>
                <ArrowDropUpIcon sx={{ color: 'white' }} />
            </IconButton> :
            <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
                <ArrowDropDownIcon />
            </IconButton>

    }

    const options = [
        { value: 'New York', label: 'New York' },
    ];

    const [selectedCity, setSelectedCity] = useState<string>('');
    const handleChangeCity = (event: SelectChangeEvent<string>, child: ReactNode) => {
        setSelectedCity(event.target.value as string);
    };

    const handleClearCity = () => { 
        setSelectedCity('');
    }
    
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="border-slate-400 border-b h-14 w-full">
            <div className="flex flex-wrap -mx-2 h-full">
                <div className="w-full md:w-4/12 px-2 border-r border-slate-400">
                    <FilterBarSearch searchValue={searchValue} setSearchValue={setSearchValue} handleClearSearch={handleClearSearch} />
                </div>
                <div className="w-full md:w-4/12 px-2 border-r border-slate-400">
                    <FilterBarCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} handleClearCategory={handleClearCategory} handleChangeCategories={handleChangeCategories} />
                </div>
                <div className="w-full md:w-4/12 px-2">
                    <div className="">
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-multiple-select-label"
                                id="demo-multiple-select"
                                value={selectedCity}
                                onChange={handleChangeCity}
                                open={open}
                                onOpen={handleOpen}
                                onClose={handleClose}
                                placeholder="City"
                                displayEmpty
                                renderValue={selected => selected === '' ? <em>City</em> : <em>{selected}</em>}
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
                                    selectedCity !== '' ? (
                                        <IconButton onClick={handleClearCity} sx={{ color: 'white' }}>
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
                </div>
            </div>
        </div >
    )
}