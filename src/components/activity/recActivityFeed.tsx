
import { useUser } from "@clerk/nextjs";
import { Button } from "@mui/material";
import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { LoadingPage } from "../loading";
import { ActivityView } from "./activityview";


type Activity = RouterOutputs["activity"]["getAll"][number];
export const RecActivityFeed = ({ selectedCategories, searchValue }: { selectedCategories: string[], searchValue: string }) => {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const { data: activities, isLoading: activitiesLoading } = api.activity.searchActivitiesPreferNonLiked.useQuery({ userId: user?.id, searchText: searchValue, selectedCategoryIds: selectedCategories });
    const [currentIndex, setCurrentIndex] = useState(0);


    const { mutate: createLike, isLoading: likeLoading } = api.like.createLikeDislike.useMutation({
        onSuccess: () => {
        }
    });

    if (activitiesLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!activities || currentIndex >= activities.length) return <div>Something went wrong</div>;

    const handleNextActivity = (liked: boolean) => {

        createLike({ userId: user?.id, activityId: activities[currentIndex]?.id, liked: liked });

        if (currentIndex < activities.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-1/2">
                {/* Display current activity */}

                {activities[currentIndex]?.categories && activities[currentIndex]?.savedByUsers && (
                    <ActivityView {...activities[currentIndex] as Activity} />
                )}

            </div>
            <div className="flex justify-center items-center w-full h-12 mb-10">
                <Button variant="contained" color="error" className="w-1/6 h-full" onClick={() => handleNextActivity(false)}>Dislike</Button>
                <div className="w-1/12"></div>
                <Button variant="contained" color="success" className="w-1/6 h-full" onClick={() => handleNextActivity(true)}>Like</Button>
            </div>
        </div>
    );
}
