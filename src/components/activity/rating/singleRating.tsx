import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";


export const SingleRating = ({ ratingText, averageRating }: { ratingText: string, averageRating: number | null }) => {
    return (
        <div className="bg-gray-600 h-8 rounded-lg flex justify-center items-center mb-1">
            <div className="ml-2 mr-2 h-full w-6/12 border-r border-gray-400 flex items-center justify-center">
                {ratingText}
            </div>
            <div className="w-6/12 flex justify-center items-center mr-2">
                {averageRating != null ? (
                    <Rating name="half-rating" value={averageRating} precision={0.2} readOnly
                        icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                        emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                    />
                ) : (
                    <span>no ratings</span>
                )}
            </div>
        </div>
    )
}