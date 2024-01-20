import { FilterBarSearch } from "./filterBarSearch";
import { FilterBarCategory } from "./filterBarCategory";

export const FilterBar = () => {

    return (
        <div className="border-slate-400 border-b h-14 w-full">
            <div className="flex flex-wrap -mx-2 h-full">
                <div className="w-full md:w-4/12 px-2 border-r border-slate-400">
                    <FilterBarSearch />
                </div>
                <div className="w-full md:w-4/12 px-2 border-r border-slate-400">
                    <FilterBarCategory />
                </div>
                <div className="w-full md:w-4/12 px-2">
                </div>
            </div>
        </div >
    )
}