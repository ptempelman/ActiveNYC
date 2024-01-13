import { Button, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { api, type RouterOutputs } from "~/utils/api";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useUser } from "@clerk/nextjs";
import { Cross1Icon } from "@radix-ui/react-icons";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const ActivityView = (activity: Activity) => {
    console.log(activity.address)

    const hasPartyOrBar = activity.categories.some(cat => cat.name === 'Party' || cat.name === 'Bar');
    const hasNeitherPartyNorBar = activity.categories.every(cat => cat.name !== 'Party' && cat.name !== 'Bar');

    const ctx = api.useContext();

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

    return (
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
                    <a href={activity.websiteUrl} className="text-blue-400 hover:text-blue-300 transition duration-300">
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
                                    <Rating name="half-rating" value={activity.averageRatingBarSpeed} precision={0.1} readOnly emptyIcon={<StarIcon style={{ opacity: 0.9, color: "gray" }} fontSize="inherit" />} />
                                ) : (
                                    <span>N/A</span>
                                )}
                            </div>
                            <div>
                                <span>Music: </span>
                                {activity.averageRatingMusic != null ? (
                                    <Rating name="half-rating" value={activity.averageRatingMusic} precision={0.1} readOnly emptyIcon={<StarIcon style={{ opacity: 0.9, color: "gray" }} fontSize="inherit" />} />
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
                                <Rating name="half-rating" value={activity.averageRatingWorthIt} precision={0.1} readOnly emptyIcon={<StarIcon style={{ opacity: 0.9, color: "gray" }} fontSize="inherit" />} />
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    )}
                    <div>
                        <span>Experience: </span>
                        {activity.averageRatingExperience != null ? (
                            <Rating name="half-rating" value={activity.averageRatingExperience} precision={0.1} readOnly emptyIcon={<StarIcon style={{ opacity: 0.9, color: "gray" }} fontSize="inherit" />} />
                        ) : (
                            <span>N/A</span>
                        )}
                    </div>
                </div>
                {/* Column for Buttons */}
                <div className="flex flex-col items-start gap-2 mt-auto">
                    {isSignedIn && isBookmarked &&
                        // onClick={() => unbookmark({ userId: user.id, activityId: activity.id })}
                        <Button onClick={() => unbookmark({ userId: user.id, activityId: activity.id })} variant="contained" startIcon={<Cross1Icon />}>
                            Remove
                        </Button>
                    }

                    {isSignedIn && !isBookmarked &&
                        // onClick={() => bookmark({ userId: user.id, activityId: activity.id })}
                        <Button onClick={() => bookmark({ userId: user.id, activityId: activity.id })} variant="contained" startIcon={<BookmarkAddIcon />}>
                            Save
                        </Button>
                    }

                    <Button variant="contained" startIcon={<StarRateIcon />}>
                        Rate
                    </Button>
                </div>
            </div>
        </div >

    );
};
