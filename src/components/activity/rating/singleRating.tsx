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
import LocalBarIcon from '@mui/icons-material/LocalBar';


export const SingleRating = ({ ratingText, averageRating }: { ratingText: string, averageRating: number | null}) => {
    return (
        <div className="bg-gray-600 h-8 rounded-lg flex justify-center items-center m-1">
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
                    <span>No ratings</span>
                )}
            </div>
        </div>
    )
}