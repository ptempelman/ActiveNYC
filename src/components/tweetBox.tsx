import { UserButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

import { Box, Button, CircularProgress, Snackbar, Typography } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { toast } from "react-hot-toast";



export const CreatePostWizard = () => {
    const { user } = useUser();

    const [input, setInput] = useState("");

    const ctx = api.useContext();

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput("");
            void ctx.posts.getAll.invalidate();
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to post! Please try again later.");
            }
        },
    });

    const cirlceSize = 56;

    const [popupText, setPopupText] = useState('');
    const [popupOpen, openPopup] = useState(false);
    const handleOpenPopup = (text: string) => {
        setPopupText(text);
        openPopup(true);
    };
    const handleClosePopup = (event: React.SyntheticEvent | Event, reason?: string) => {
        // if (reason === 'clickaway') {
        //     return;
        // }

        openPopup(false);
    };


    if (!user) return null;


    const { interactionCount, interactionThreshold } = api.profile.getUserInteractionData.useQuery({ userId: user.id }).data ?? { interactionCount: 0, interactionThreshold: 10 };

    const props = {
        value: interactionThreshold === 0 ? 0 : (interactionCount / interactionThreshold) * 100
    };

    const { mutate: increaseThreshold, isLoading: increaseThesholdLoading } = api.profile.increaseTheshold.useMutation({
        onSuccess: () => {
            void ctx.profile.getUserInteractionData.refetch();
        },
    });

    const { mutate: retrain, isLoading: retrainLoading } = api.model.retrainModel.useMutation({
        onSuccess: () => {
            handleOpenPopup('AI Retrained!');
            void increaseThreshold({ userId: user.id });
            void ctx.profile.getUserInteractionData.refetch();
        },
        onError: (e) => {
            if (e instanceof TRPCClientError) {
                if (e.message === "not enough interactions") {
                    handleOpenPopup('Need more data (rate/save places you like)');
                }
            } else {
                handleOpenPopup('Error retraining AI');
            }
        }
    });


    const handleRetrain = async () => {
        // handleOpenPopup('To retrain your AI, give it useful data by rating, liking and saving')

        retrain({ userId: user.id, userInteractions: interactionCount, userInteractionThreshold: interactionThreshold });
    }

    return (
        <div className="flex w-full gap-3">

            <div className="flex items-center">
                <Button onClick={() => handleRetrain()} className="h-8 w-32" variant="contained" sx={{
                    backgroundColor: '#474747', // Set the background color to white
                    '&:hover': {
                        backgroundColor: 'white', // Optional: Change background color slightly on hover
                        color: 'black',
                    }
                }}
                >Retrain AI</Button>

            </div>


            <Box sx={{ position: 'relative', display: 'inline-flex' }} onClick={() => handleOpenPopup('To retrain your AI, give it useful data by rating, liking and saving')}>
                <CircularProgress size={cirlceSize} variant="determinate" {...props} sx={{ color: props.value >= 100 ? 'green' : 'white' }} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'white' }}
                    >{`${Math.round(props.value)}%`}</Typography>
                </Box>
            </Box>

            <UserButton appearance={{
                elements: {
                    userButtonAvatarBox: {
                        width: 56,
                        height: 56
                    }
                }
            }} />
            {/* <input
                placeholder="Type some emojis!"
                className="grow bg-transparent outline-none"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        if (input !== "") {
                            mutate({ content: input });
                        }
                    }
                }}
                disabled={isPosting}
            /> */}
            {/* {input !== "" && !isPosting && (
                <button onClick={() => mutate({ content: input })}>Post</button>
            )} */}
            {/* {isPosting && (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size={20} />
                </div>
            )} */}
            <Snackbar
                open={popupOpen}
                autoHideDuration={6000}
                onClose={handleClosePopup}
                message={popupText}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            />
        </div>
    );
};