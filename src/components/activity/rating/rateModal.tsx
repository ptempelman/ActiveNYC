import { useUser } from "@clerk/nextjs";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from "@mui/icons-material/Star";
import StarRateIcon from '@mui/icons-material/StarRate';
import { Backdrop, Button, Fade, IconButton, Modal, Rating } from "@mui/material";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import CheckIcon from '@mui/icons-material/Check';
import { RatingComponent } from "./ratingComponent";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const RateModal = ({ activity, rateModalOpen, handleRateModalOpen, handleRateModalClose }:
    { activity: Activity, rateModalOpen: boolean, handleRateModalOpen: () => void, handleRateModalClose: () => void }) => {

    const hasPartyOrBar = activity.categories.some(cat => cat.name === 'Party' || cat.name === 'Bar');
    const hasNeitherPartyNorBar = activity.categories.every(cat => cat.name !== 'Party' && cat.name !== 'Bar');

    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(0);
    const [rating3, setRating3] = useState(0);
    const [rating4, setRating4] = useState(0);

    const ctx = api.useContext();

    const { mutate: createRating, isLoading: ratingLoading } = api.rating.create.useMutation({
        onSuccess: () => {
            void ctx.activity.getAll.refetch();
        }
    });

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
                    <div className="h-auto w-1/4 bg-white rounded-xl z-10">
                        <form className="p-6" onSubmit={(e) => {
                            e.preventDefault();
                            createRating(
                                {
                                    activityId: activity.id,
                                    barSpeed: rating1,
                                    music: rating2,
                                    worthIt: rating3,
                                    experience: rating4
                                }
                            )
                        }}
                        >
                            {hasPartyOrBar && (
                                <>
                                    <div>
                                        <span className="text-gray-600">Bar: </span>
                                        <Rating name="rating1"
                                            value={rating1}
                                            onChange={(event, newValue) => {
                                                setRating1(newValue ?? 0);
                                            }}
                                            icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                            emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Music: </span>
                                        <Rating name="rating2"
                                            value={rating2}
                                            onChange={(event, newValue) => {
                                                setRating2(newValue ?? 0);
                                            }}
                                            icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                            emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                        />
                                    </div>
                                </>
                            )}
                            {hasNeitherPartyNorBar && (
                                <div>
                                    <span className="text-gray-600">Worth it: </span>
                                    <Rating name="rating3" value={rating3}
                                        onChange={(event, newValue) => {
                                            setRating3(newValue ?? 0);
                                        }}
                                        icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                        emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                    />
                                </div>
                            )}
                            <div>
                                <span className="text-gray-600">Experience: </span>
                                <Rating name="rating4" value={rating4}
                                    onChange={(event, newValue) => {
                                        setRating4(newValue ?? 0);
                                    }}
                                    icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                    emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />} />
                            </div>
                            <div className="mt-4 h-12 flex">
                                <div className="h-full w-12">
                                    <IconButton onClick={(e) => { handleRateModalClose() }} size="large" className="h-full w-12">
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                                <div className="ml-3 w-5/6">
                                    <Button type="submit" onClick={(e) => { handleRateModalClose() }} variant="contained" color="primary" className="w-full m-2 h-full">
                                        Submit Rating
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}