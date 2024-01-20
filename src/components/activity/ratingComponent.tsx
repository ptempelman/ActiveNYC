import { useUser } from "@clerk/nextjs";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from "@mui/icons-material/Star";
import StarRateIcon from '@mui/icons-material/StarRate';
import { Backdrop, Button, Fade, IconButton, Modal, Rating } from "@mui/material";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import CheckIcon from '@mui/icons-material/Check';


type Activity = RouterOutputs["activity"]["getAll"][number];
export const RatingComponent = (activity: Activity) => {

    const hasPartyOrBar = activity.categories.some(cat => cat.name === 'Party' || cat.name === 'Bar');
    const hasNeitherPartyNorBar = activity.categories.every(cat => cat.name !== 'Party' && cat.name !== 'Bar');

    return (
        <div>
            {hasPartyOrBar && (
                <>
                    <div>
                        <span>Bar: </span>
                        {activity.averageRatingBarSpeed != null ? (
                            <Rating name="half-rating" value={activity.averageRatingBarSpeed} precision={0.2} readOnly
                                icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                            />
                        ) : (
                            <span>No ratings yet</span>
                        )}
                    </div>
                    <div>
                        <span>Music: </span>
                        {activity.averageRatingMusic != null ? (
                            <Rating name="half-rating" value={activity.averageRatingMusic} precision={0.2} readOnly
                                icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                                emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />} />
                        ) : (
                            <span>No ratings yet</span>
                        )}
                    </div>
                </>
            )}
            {hasNeitherPartyNorBar && (
                <div>
                    <span>Worth It: </span>
                    {activity.averageRatingWorthIt != null ? (
                        <Rating name="half-rating" value={activity.averageRatingWorthIt} precision={0.2} readOnly
                            icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                            emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                        />
                    ) : (
                        <span>No ratings yet</span>
                    )}
                </div>
            )}
            <div>
                <span>Experience: </span>
                {activity.averageRatingExperience != null ? (
                    <Rating name="half-rating" value={activity.averageRatingExperience} precision={0.2} readOnly
                        icon={<StarIcon style={{ color: "gold" }} fontSize="inherit" />}
                        emptyIcon={<StarIcon style={{ opacity: 1, color: "gray" }} fontSize="inherit" />}
                    />
                ) : (
                    <span>No ratings yet</span>
                )}
            </div>
        </div>
    )
}
