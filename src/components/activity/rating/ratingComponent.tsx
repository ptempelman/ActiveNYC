import { type RouterOutputs } from "~/utils/api";
import { SingleRating } from "./singleRating";


type Activity = RouterOutputs["activity"]["getAll"][number];
export const RatingComponent = ({ activity, handleRateModalOpen }: { activity: Activity, handleRateModalOpen: () => void }) => {

    return (
        <SingleRating averageRating={activity.averageRating} handleRateModalOpen={handleRateModalOpen} />
    )
}
