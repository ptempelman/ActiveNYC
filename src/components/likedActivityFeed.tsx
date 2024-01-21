import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

import { ActivityView } from "~/components/activity/activityview";
import { LoadingPage } from "~/components/loading";


export const LikedActivityFeed = () => {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    if (!isSignedIn) return <div />;

    const { data, isLoading: postsLoading } = api.activity.getAllBookmarks.useQuery({ userId: user.id });

    if (postsLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!data) return <div>Something went wrong</div>;

    return (
        <div className="flex grow flex-col overflow-y-scroll">
            {[...data].map((activity) => (  // [...data, ...data, ...data, ...data]
                <ActivityView {...activity} key={activity.id} />
            ))}
        </div>
    );
};