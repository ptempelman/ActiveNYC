import { Button, ButtonGroup, IconButton, InputAdornment, TextField } from "@mui/material"
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

export const FilterBar = () => {
    const [value, setValue] = useState('');
    const handleClear = () => {
        setValue('');
    };
    const categories = ["Party", "Bar", "Relaxing", "Adventure", "Indoor", "Outdoor", "Sports", "Cultural"];

    const midIndex = Math.ceil(categories.length / 2);
    const firstRowButtons = categories.slice(0, midIndex);
    const secondRowButtons = categories.slice(midIndex);

    interface SelectedCategories {
        [key: string]: boolean;
    }
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({});

    const handleCategoryClick = (category: string) => {
        setSelectedCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

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
                    <div>
                        <div className="flex justify-center">
                            <ButtonGroup className="h-6 mb-1" variant="outlined">
                                {firstRowButtons.map(category => (
                                    <Button
                                        size="large"
                                        variant={selectedCategories[category] ? "contained" : "outlined"}
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                    >{category}</Button>
                                ))}
                            </ButtonGroup>
                        </div>
                        <div className="flex justify-center">
                            <ButtonGroup className="h-6" variant="outlined">
                                {secondRowButtons.map(category => (
                                    <Button
                                        size="large"
                                        variant={selectedCategories[category] ? "contained" : "outlined"}
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                    >{category}</Button>
                                ))}
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/12 px-2">
                </div>
            </div>
        </div>
    )
}