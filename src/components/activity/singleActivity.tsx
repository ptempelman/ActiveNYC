
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

import { useRef, useState } from "react";
import { ActivityView } from "~/components/activity/activityview";
import { LoadingPage } from "~/components/loading";

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api';


export const SingleActivity = ({ activityId }: { activityId: string }) => {

    const { data, isLoading: postsLoading } = api.activity.getById.useQuery({ activityId: activityId });

    const { isLoaded: mapLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    })
    type Activity = RouterOutputs["activity"]["getAll"][number];
    const [selectedPlace, setSelectedPlace] = useState<Activity | undefined>(undefined);

    const mapRef = useRef<google.maps.Map | null>(null);
    const panMapTo = ({ lat, lng }: { lat: number, lng: number }) => {
        // setMapCenter({ lat, lng }); // Update the center state
        if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
        }
    };
    const [mapCenter, setMapCenter] = useState({ lat: 40.72889197585025, lng: -73.99479733097367 });

    if (postsLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!data) return <div>Something went wrong</div>;

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    return (
        <div className="h-screen w-auto">
            {[data].map((activity) => (  // [...data, ...data, ...data, ...data]
                <ActivityView {...activity} key={activity.id} />
            ))}
            <div className="border border-gray-200 m-auto w-5/6 h-3/6">
                {!mapLoaded && <div>Loading...</div>}
                {mapLoaded &&
                    <GoogleMap
                        mapContainerStyle={containerStyle}

                        center={mapCenter}
                        zoom={13}
                        onLoad={map => {
                            mapRef.current = map;
                        }}
                    >
                        {[data].map((activity) => (
                            <MarkerF
                                key={`${activity.address}-${activity.name}`}
                                onClick={() => {
                                    if (activity === selectedPlace) {
                                        setSelectedPlace(undefined);
                                    } else {
                                        setSelectedPlace(activity);
                                        panMapTo({ lat: activity.latitude, lng: activity.longitude });
                                    }
                                }}
                                position={{ lat: activity.latitude, lng: activity.longitude }}
                            />
                        ))}
                        {selectedPlace && (
                            <InfoWindowF
                                position={{
                                    lat: selectedPlace.latitude,
                                    lng: selectedPlace.longitude
                                }}
                                zIndex={1}
                                options={{
                                    pixelOffset:
                                        // { width: 0, height: -40 },
                                        new google.maps.Size(0, -40),
                                }}
                                onCloseClick={() => setSelectedPlace(undefined)}
                            >
                                <div>
                                    <h3 className="text-black">{selectedPlace.name}</h3>
                                    <p className="text-black">{selectedPlace.address}</p>
                                </div>
                            </InfoWindowF>
                        )}
                    </GoogleMap>
                }
            </div>

        </div>

    );
};