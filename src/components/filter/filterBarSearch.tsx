import CloseIcon from '@mui/icons-material/Close';
import { IconButton, InputAdornment, TextField } from "@mui/material";


export const FilterBarSearch = ({ searchValue, setSearchValue, handleClearSearch }: { searchValue: string, setSearchValue: (e: string) => void, handleClearSearch: () => void }) => {

    return (
        <div className="flex justify-center">
            <TextField className="w-5/6"
                id="standard-search"
                label="Search"
                variant="standard"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                InputProps={{
                    style: { color: 'white' }, // Sets the text color
                    endAdornment: searchValue && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClearSearch}>
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