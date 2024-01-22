
import type { RouterOutputs } from "~/utils/api";

import { useRef, useState } from "react";

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import Link from "next/link";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const GoogleMapComponent = ({ activities }: { activities: Activity[] }) => {

    const containerStyle = {
        width: '100%',
        height: '100%',
    };

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

    return (
        <div className="m-5 w-100% h-full">
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
                    {[...activities].map((activity) => (
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
                                <Link href={`/a/${selectedPlace.id}`}>
                                    <h3 className="text-black">{selectedPlace.name}</h3>
                                    <p className="text-black">{selectedPlace.address}</p>
                                </Link>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            }
        </div>
    )
}