
import { api } from "~/utils/api";

import { ActivityView } from "~/components/activity/activityview";
import { LoadingPage } from "~/components/loading";

import { GoogleMapComponent } from "../googleMapComponent";


export const ActivityFeed = ({ selectedCategories, searchValue }: { selectedCategories: string[], searchValue: string }) => {
    // const { data: activities, isLoading: activitiesLoading } = api.activity.getAll.useQuery();
    const { data: activities, isLoading: activitiesLoading } = api.activity.searchActivities.useQuery({ searchText: searchValue, selectedCategoryIds: selectedCategories });


    if (activitiesLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!activities) return <div>Something went wrong</div>;

    return (

        <div className="flex">
            <div className="flex-1 overflow-auto">
                {[...activities].map((activity) => (  // [...data, ...data, ...data, ...data]
                    <ActivityView {...activity} key={activity.id} />
                ))}
            </div>
            <div className="flex-1">
                {/* // top-30 right-5 */}
                <div className="sticky top-10 h-128"> 
                    <GoogleMapComponent activities={activities} />
                </div>
            </div>
        </div>
    );
};