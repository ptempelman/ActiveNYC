import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";


export const SingleRating = ({ averageRating, handleRateModalOpen }: { averageRating: number | null, handleRateModalOpen: () => void }) => {
    return (
        <div className="w-32 bg-gray-600 h-8 rounded-lg flex justify-center items-center">
            <div className="flex justify-center items-center" onClick={(e) => {
                e.preventDefault(); handleRateModalOpen()
            }}>
                {averageRating != null ? (
                    <Rating
                        value={averageRating} precision={0.2} readOnly
                        icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                        emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                    />
                ) : (
                    <span>no ratings yet</span>
                )}
            </div>
        </div>
    )
}