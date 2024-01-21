
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

import { useRef, useState } from "react";
import { ActivityView } from "~/components/activity/activityview";
import { LoadingPage } from "~/components/loading";

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { GoogleMapComponent } from "../googleMapComponent";


export const ActivityFeed = ({ selectedCategories, searchValue }: { selectedCategories: string[], searchValue: string }) => {
    // const { data: activities, isLoading: activitiesLoading } = api.activity.getAll.useQuery();
    const { data: activities, isLoading: activitiesLoading } = api.activity.searchActivities.useQuery({searchText: searchValue, selectedCategoryIds: selectedCategories});


    if (activitiesLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!activities) return <div>Something went wrong</div>;

    return (

        <div className="flex h-screen">
            <div className="flex-1">
                {[...activities].map((activity) => (  // [...data, ...data, ...data, ...data]
                    <ActivityView {...activity} key={activity.id} />
                ))}
            </div>
            <div className="flex-1 h-3/4">
                <GoogleMapComponent activities={activities} />
            </div>
        </div>
    );
};