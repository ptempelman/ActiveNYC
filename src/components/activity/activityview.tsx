import { useUser } from "@clerk/nextjs";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import CheckIcon from '@mui/icons-material/Check';
import StarRateIcon from '@mui/icons-material/StarRate';
import { Button } from "@mui/material";
import { Cross1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { RateModal } from "./rating/rateModal";
import { RatingComponent } from "./rating/ratingComponent";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const ActivityView = (activity: Activity) => {
    // console.log(activity.address)

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

    return (
        <div className="border border-gray-200 rounded-lg shadow-md m-4 p-4 w-10/12 mx-auto bg-gray-800 text-white">
            <Link href={`/a/${activity.id}`}>

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
                        <a href={activity.websiteUrl} onClick={(e) => { e.stopPropagation() }} className="text-blue-400 hover:text-blue-300 transition duration-300">
                            Visit Website
                        </a>
                    )}
                </div>
                <div className="mt-2 text-gray-400 text-sm">
                    <p>{activity.description}</p>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="w-auto">
                        <RatingComponent {...activity} />
                    </div>
                    <div className="w-auto">
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

                </div>
            </Link>
            <RateModal {...{ activity, rateModalOpen, handleRateModalOpen, handleRateModalClose }} />
        </div >
    );
};
