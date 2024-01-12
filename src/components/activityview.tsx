import type { RouterOutputs } from "~/utils/api";

type Activity = RouterOutputs["activity"]["getAll"][number];
export const ActivityView = (activity: Activity) => {
    return (
        <div className="border border-gray-200 rounded-lg shadow-md p-4 max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800">{activity.name}</h3>
            <p className="text-gray-600">{activity.address}</p>
            <div className="mt-2 text-gray-500 text-sm">
                {/* <p>Latitude: {activity.latitude}</p>
                <p>Longitude: {activity.longitude}</p> */}
                {activity.websiteUrl && (
                    <a href={activity.websiteUrl} className="text-blue-600 hover:text-blue-800 transition duration-300">
                        Visit Website
                    </a>
                )}
            </div>
            <div className="mt-4">
                <p className="text-gray-700">Average Ratings:</p>
                <div className="flex justify-between items-center">
                    <span>Bar Speed: {activity.averageRatingBarSpeed ?? 'N/A'}</span>
                    <span>Music: {activity.averageRatingMusic ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Worth It: {activity.averageRatingWorthIt ?? 'N/A'}</span>
                    <span>Experience: {activity.averageRatingExperience ?? 'N/A'}</span>
                </div>
            </div>
        </div>
    );
}