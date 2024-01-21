import { FilterBarSearch } from "./filterBarSearch";
import { FilterBarCategory } from "./filterBarCategory";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";
import { SelectChangeEvent } from "@mui/material";


export const FilterBar = ({ selectedCategories, setSelectedCategories, handleClearCategory, handleChangeCategories, searchValue, setSearchValue, handleClearSearch }: { selectedCategories: string[], setSelectedCategories: Dispatch<SetStateAction<string[]>>, handleClearCategory: () => void, handleChangeCategories: (event: SelectChangeEvent<string[]>, child: ReactNode) => void, searchValue: string, setSearchValue: (e: string) => void, handleClearSearch: () => void }) => {

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
                </div>
            </div>
        </div >
    )
}