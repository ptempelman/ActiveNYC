import { type RouterOutputs } from "~/utils/api";
import { SingleRating } from "./singleRating";


type Activity = RouterOutputs["activity"]["getAll"][number];
export const RatingComponent = (activity: Activity) => {

    const hasPartyOrBar = activity.categories.some(cat => cat.name === 'Party' || cat.name === 'Bar');
    const hasNeitherPartyNorBar = activity.categories.every(cat => cat.name !== 'Party' && cat.name !== 'Bar');

    return (
        <div>
            {hasPartyOrBar && (
                <>
                    <SingleRating ratingText="Bar" averageRating={activity.averageRatingBarSpeed} />
                    <SingleRating ratingText="Music" averageRating={activity.averageRatingMusic} />
                </>
            )}
            {hasNeitherPartyNorBar && (
                <SingleRating ratingText="Worth it" averageRating={activity.averageRatingWorthIt} />
            )}
            <SingleRating ratingText="Experience" averageRating={activity.averageRatingExperience} />
        </div>
    )
}
