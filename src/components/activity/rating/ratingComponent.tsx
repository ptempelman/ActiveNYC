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
