

import { useState } from "react";

import { Backdrop, Button, Fade, FormGroup, Modal, TextField } from "@mui/material";


export const ActivityRequestModal = () => {
    const [requestModalOpen, openRequestModal] = useState<boolean>(false);;
    const handleOpen = () => openRequestModal(true);
    const handleClose = () => openRequestModal(false);
    const initialCategories = ["Party", "Bar", "Relaxing", "Adventure", "Indoor", "Outdoor", "Sports", "Cultural"].map(() => false);
    const [categoriesClicked, setCategoriesClicked] = useState(initialCategories);

    const handleCategoryClicked = (index: number) => {
        // Create a new array with the updated value
        const newCategoriesClicked = [...categoriesClicked];
        newCategoriesClicked[index] = !newCategoriesClicked[index];

        // Update the state with the new array
        setCategoriesClicked(newCategoriesClicked);
    };

    return (
        <Modal
            open={requestModalOpen}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={requestModalOpen}>
                <div className="flex justify-center items-center h-screen w-screen">
                    <div className="h-3/4 w-2/6 bg-white rounded-xl z-10">
                        <form className="mx-auto my-10 p-6 bg-white shadow-md rounded">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Request New Activity</h2>
                            <div className="mb-2"><TextField className="w-full" label="Name" variant="outlined" /></div>
                            <div className="mb-2"><TextField className="w-full" label="Address" variant="outlined" /></div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField label="Latitude" type="number" variant="outlined" />
                                <TextField label="Longitude" type="number" variant="outlined" />
                            </div>
                            <TextField className="w-full mb-4" label="Description" multiline rows={4} variant="outlined" />
                            {/* <TextField className="w-full mb-4" label="Website URL" variant="outlined" /> */}
                            <FormGroup row className="justify-center">
                                {["Party", "Bar", "Relaxing", "Adventure", "Indoor", "Outdoor", "Sports", "Cultural"].map((category, index) => (
                                    <div className="m-1">
                                        <Button variant={categoriesClicked[index] ? "contained" : "outlined"} className="h-6" key={index} onClick={() => handleCategoryClicked(index)}>{category}</Button>
                                    </div>
                                ))}
                            </FormGroup>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField label="Avg. Rating Bar Speed" type="number" variant="outlined" />
                                <TextField label="Avg. Rating Music" type="number" variant="outlined" />
                                <TextField label="Avg. Rating Worth It" type="number" variant="outlined" />
                                <TextField label="Avg. Rating Experience" type="number" variant="outlined" />
                            </div>
                            <Button variant="contained" color="primary" className="w-full mt-6 h-12">
                                Submit Request
                            </Button>
                        </form>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
};