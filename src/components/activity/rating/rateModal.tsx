import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from "@mui/icons-material/Star";
import { Backdrop, Box, Button, Fade, IconButton, Modal, Rating } from "@mui/material";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const RateModal = ({ activity, rateModalOpen, handleRateModalOpen, handleRateModalClose }:
    { activity: Activity, rateModalOpen: boolean, handleRateModalOpen: () => void, handleRateModalClose: () => void }) => {

    const [hover, setHover] = useState(-1);
    const [rating, setRating] = useState(3);

    const ctx = api.useContext();

    const { mutate: createRating, isLoading: ratingLoading } = api.rating.create.useMutation({
        onSuccess: () => {
            void ctx.activity.searchActivities.refetch();
            void ctx.activity.getById.refetch();
        }
    });

    const labels: { [index: string]: string } = {
        0.5: 'Worst ever',
        1: 'Terrible',
        1.5: 'Bad',
        2: 'Not good',
        2.5: 'Decent',
        3: 'Good',
        3.5: 'Great',
        4: 'Amazing',
        4.5: 'Perfect',
        5: 'Best ever',
    };

    function getLabelText(value: number) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }


    return (
        <Modal
            open={rateModalOpen}
            onClose={handleRateModalClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={rateModalOpen}>
                <div className="flex justify-center items-center h-screen w-screen">
                    <div className="h-auto w-1/4 bg-black border rounded-xl z-10">
                        <form className="p-6" onSubmit={(e) => {
                            e.preventDefault();
                            createRating(
                                {
                                    activityId: activity.id,
                                    rating: rating,
                                }
                            )
                        }}
                        >
                            <div className="flex">
                                <div className="flex-1">
                                    <Rating
                                        name="rating"
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue ?? 0);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setHover(newHover);
                                        }}
                                        icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                        emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                        getLabelText={getLabelText}
                                        precision={0.5}
                                    />
                                </div>
                                <div className="flex-1">
                                    {rating !== null && (
                                        <Box sx={{ color: 'white', ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 h-12 flex">
                                <div className="h-full w-12">
                                    <IconButton onClick={(e) => { handleRateModalClose() }} size="large" className="h-full w-12" style={{ color: "white" }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                                <div className="ml-3 w-5/6">
                                    <Button type="submit" onClick={(e) => { handleRateModalClose() }} variant="contained" color="primary" className="w-full m-2 h-full">
                                        Submit
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </Fade>
        </Modal >
    )
}