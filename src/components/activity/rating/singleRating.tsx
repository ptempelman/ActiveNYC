import { SignInButton, useUser } from "@clerk/nextjs";
import StarIcon from '@mui/icons-material/Star';
import { Rating } from "@mui/material";

// {
//     !isSignedIn && <SignInButton>
//         const {isLoaded: userLoaded, isSignedIn, user } = useUser();


export const SingleRating = ({ averageRating, handleRateModalOpen }: { averageRating: number | null, handleRateModalOpen: () => void }) => {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    return (


        <div className="w-32 bg-gray-600 h-8 rounded-lg flex justify-center items-center">
            {isSignedIn && <div className="flex justify-center items-center" onClick={(e) => {
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
            </div>}

            {!isSignedIn && <SignInButton>
                <div className="flex justify-center items-center" onClick={(e) => {
                    e.preventDefault();
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
            </SignInButton>
            }
        </div >
    )
}