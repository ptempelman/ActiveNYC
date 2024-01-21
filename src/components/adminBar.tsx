import { Button } from "@mui/material"


export const AdminBar = () => {
    return (
        <div className="w-full h-14 border-b border-red">
            <div className="h-full w-full flex justify-center items-center">
                <div className="h-full w-1/4 flex justify-center items-center">
                    <Button className="h-8" size="large" variant="contained">Add activity</Button>
                </div>
                <div className="h-full w-1/4 flex justify-center items-center">
                    <Button className="h-8" size="large" variant="contained">View requests</Button>
                </div>
                <div className="h-full w-1/4 flex justify-center items-center">
                    <Button className="h-8" size="large" variant="contained">View users</Button>
                </div>
                <div className="h-full w-1/4 flex justify-center items-center">
                    <Button className="h-8" size="large" variant="contained">View statistics</Button>
                </div>
            </div>
        </div>
    )
}