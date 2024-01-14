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
import { A } from "@upstash/redis/zmscore-fa7fc9c8";
import Link from "next/link";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const ActivityView = (activity: Activity) => {
    console.log(activity.address)

    const hasPartyOrBar = activity.categories.some(cat => cat.name === 'Party' || cat.name === 'Bar');
    const hasNeitherPartyNorBar = activity.categories.every(cat => cat.name !== 'Party' && cat.name !== 'Bar');

    const ctx = api.useContext();

    const [isHovered, setIsHovered] = useState(false);
    const [ratingIsHovered, setRatingIsHovered] = useState(false);


    const [rateModalOpen, openRateModal] = useState<boolean>(false);;
    const handleRateModalOpen = () => openRateModal(true);
    const handleRateModalClose = () => openRateModal(false);

    const { mutate: bookmark, isLoading: bookmarkLoading } = api.activity.bookmark.useMutation({
        onSuccess: () => {
            void ctx.activity.isBookmarked.refetch();
        }
    });
    const { mutate: unbookmark, isLoading: unbookmarkLoading } = api.activity.unbookmark.useMutation({
        onSuccess: () => {
            void ctx.activity.isBookmarked.refetch();
            void ctx.activity.getAllBookmarks.refetch()
        }
    });

    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const isBookmarked = api.activity.isBookmarked.useQuery({ userId: user?.id, activityId: activity?.id }).data?.bookmarked;
    const isRated = api.rating.isRated.useQuery({ userId: user?.id, activityId: activity?.id }).data?.rated;

    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(0);
    const [rating3, setRating3] = useState(0);
    const [rating4, setRating4] = useState(0);

    const { mutate: createRating, isLoading: isRating } = api.rating.create.useMutation();

    const handleSubmit = (event: any) => {
        event.preventDefault(); // Prevents the default form submission behavior

        activityId: activity?.id,
            rating1,
            rating2,
            rating3,
            rating4

        api.rating.create.useMutation({

        })
    };


    return (
        <a href={`/a/${activity.id}`}>
            <div className="border border-gray-200 rounded-lg shadow-md m-4 p-4 w-10/12 mx-auto bg-gray-800 text-white">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{activity.name}</h3>
                    <div className="flex gap-2">
                        {activity.categories.map((category, index) => (
                            <div key={index} className="bg-gray-500 rounded px-2 py-1 text-sm">
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-gray-300">{activity.address}</p>
                <div className="mt-2 text-gray-400 text-sm">
                    {activity.websiteUrl && (
                        <a href={activity.websiteUrl} onClick={(e) => {e.preventDefault(); e.stopPropagation()}} className="text-blue-400 hover:text-blue-300 transition duration-300">
                            Visit Website
                        </a>
                    )}
                </div>
                <div className="mt-2 text-gray-400 text-sm">
                    <p>{activity.description}</p>
                </div>
                <div className="flex justify-between mt-4">
                    <div>
                        {hasPartyOrBar && (
                            <>
                                <div>
                                    <span>Bar Speed: </span>
                                    {activity.averageRatingBarSpeed != null ? (
                                        <Rating name="half-rating" value={activity.averageRatingBarSpeed} precision={0.2} readOnly
                                            icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                            emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                        />
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                                <div>
                                    <span>Music: </span>
                                    {activity.averageRatingMusic != null ? (
                                        <Rating name="half-rating" value={activity.averageRatingMusic} precision={0.2} readOnly
                                            icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                            emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />} />
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                            </>
                        )}
                        {hasNeitherPartyNorBar && (
                            <div>
                                <span>Worth It: </span>
                                {activity.averageRatingWorthIt != null ? (
                                    <Rating name="half-rating" value={activity.averageRatingWorthIt} precision={0.2} readOnly
                                        icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                        emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                    />
                                ) : (
                                    <span>N/A</span>
                                )}
                            </div>
                        )}
                        <div>
                            <span>Experience: </span>
                            {activity.averageRatingExperience != null ? (
                                <Rating name="half-rating" value={activity.averageRatingExperience} precision={0.2} readOnly
                                    icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                    emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                                />
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    </div>
                    {/* Column for Buttons */}
                    <div className="flex flex-col items-start gap-2 mt-auto">
                        {isSignedIn && isBookmarked &&
                            <Button onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)} size="large" color="success" className="w-full h-9" onClick={(e) => { e.preventDefault(); e.stopPropagation(); unbookmark({ userId: user.id, activityId: activity.id }); }} variant="contained" startIcon={isHovered ? <Cross1Icon /> : <CheckIcon />}
                                sx={(theme) => ({
                                    '&:hover': {
                                        backgroundColor: theme.palette.error.light,
                                        color: 'white'
                                    },
                                })}>
                                {isHovered ? 'Remove' : 'Saved'}
                            </Button>
                        }

                        {isSignedIn && !isBookmarked &&
                            <Button size="large" className="w-full h-9" onClick={(e) => { e.preventDefault(); e.stopPropagation(); bookmark({ userId: user.id, activityId: activity.id }) }} variant="contained" startIcon={<BookmarkAddIcon />}>
                                Save
                            </Button>
                        }
                        {isSignedIn &&
                            <Button onMouseEnter={() => setRatingIsHovered(true)}
                                onMouseLeave={() => setRatingIsHovered(false)} color={isRated ? 'success' : 'primary'} size="large" className="w-full h-9" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRateModalOpen() }} variant="contained" startIcon={isRated ? (ratingIsHovered ? <StarRateIcon /> : <CheckIcon />) : <StarRateIcon />}>
                                {isRated ? (ratingIsHovered ? 'Update' : 'Rated') : 'Rate'}
                            </Button>
                        }
                    </div>
                </div>
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
                                <form className="p-6" onSubmit={() => createRating(
                                    {
                                        activityId: activity.id,
                                        barSpeed: rating1,
                                        music: rating2,
                                        worthIt: rating3,
                                        experience: rating4
                                    }
                                )}
                                >
                                    {hasPartyOrBar && (
                                        <>
                                            <div>
                                                <span className="text-gray-600">Bar Speed: </span>
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
                                            <IconButton onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRateModalClose() }} size="large" className="h-full w-12">
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                        <div className="ml-3 w-5/6">
                                            <Button type="submit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRateModalClose() }} variant="contained" color="primary" className="w-full m-2 h-full">
                                                Submit Rating
                                            </Button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div >
        </a>
    );
};
