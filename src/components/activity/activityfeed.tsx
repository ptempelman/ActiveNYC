
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

import { useRef, useState } from "react";
import { ActivityView } from "~/components/activity/activityview";
import { LoadingPage } from "~/components/loading";

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { GoogleMapComponent } from "../googleMapComponent";


export const ActivityFeed = () => {
    const { data, isLoading: activitiesLoading } = api.activity.getAll.useQuery();

    if (activitiesLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!data) return <div>Something went wrong</div>;

    return (

        <div className="flex">
            <div className="flex-1">
                {[...data].map((activity) => (  // [...data, ...data, ...data, ...data]
                    <ActivityView {...activity} key={activity.id} />
                ))}
            </div>
            <div className="flex-1">

                <GoogleMapComponent activities={data} />
            </div>
        </div>
    );
};