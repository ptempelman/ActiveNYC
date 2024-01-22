import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/layout";

import { Snackbar } from "@mui/material";
import { useState } from "react";
import { AdminBar } from "~/components/adminBar";
import { Footer } from "~/components/footer";
import { TopBar } from "~/components/topBar";
import { CreatePostWizard } from "~/components/tweetBox";



import { Button, FormGroup, TextField } from "@mui/material";
import axios from "axios";

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    lineHeight: '0'
                }
            }
        },
    }
});

const Home: NextPage = () => {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();

    api.signin.createUser.useQuery({ id: user?.id, email: user?.primaryEmailAddress?.emailAddress ?? null });

    // Start fetching asap
    // api.posts.getAll.useQuery();

    const isAdminUser = api.profile.isAdminUser.useQuery({ userId: user?.id }).data?.isAdmin;

    const initialCategories = ["Party", "Relaxing", "Adventure", "Cultural", "Sports", "Bar", "Indoor", "Outdoor"].map(() => false);
    const [categoriesClicked, setCategoriesClicked] = useState(initialCategories);
    const handleCategoryClicked = (index: number) => {
        // Create a new array with the updated value
        const newCategoriesClicked = [...categoriesClicked];
        newCategoriesClicked[index] = !newCategoriesClicked[index];

        // Update the state with the new array
        setCategoriesClicked(newCategoriesClicked);
    };

    const inputStyles = {
        '& .MuiInputLabel-root': { // Label style
            color: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { // Border color
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'white', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white', // Border color when the component is focused
            },
            '& input, & textarea': { // Target both input and textarea
                color: 'white', // Input text color
            },
            '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder text color
            },
        },
    }


    interface GeocodingResponse {
        results: {
            geometry: {
                location: {
                    lat: number;
                    lng: number;
                };
            };
        }[];
        status: string;
    }

    const getLatLng = async (address: string): Promise<{ lat: number; lng: number; } | null> => {
        try {
            const response = await axios.get<GeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                },
            });

            if (response.data.status === "OK" && response.data.results[0]) {
                const { lat, lng } = response.data.results[0].geometry.location;
                return { lat, lng };
            } else {
                throw new Error('Geocoding failed');
            }
        } catch (error) {
            console.error("Error in geocoding: ", error);
            return null;
        }
    };

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebsite(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const createNewActivityMutation = api.activity.createNew.useMutation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { lat, lng } = await getLatLng(address).then((latLng) => latLng ?? { lat: 0, lng: 0 });

        if (name === '') {
            handleOpenPopup("Name cannot be empty");
            return;
        }

        if (address === '') {
            handleOpenPopup("Address cannot be empty");
            return;
        }

        if (website === '') {
            handleOpenPopup("Website cannot be empty");
            return;
        }

        if (description === '') {
            handleOpenPopup("Description cannot be empty");
            return;
        }

        const categories = categoriesClicked.map((clicked, index) => clicked ? ["Party", "Relaxing", "Adventure", "Cultural", "Sports", "Bar", "Indoor", "Outdoor"][index] : null).filter((category) => category !== null) as string[]

        if (categories.length === 0) {
            handleOpenPopup("At least one category must be selected");
            return;
        }

        if (lat === 0 && lng === 0) {
            handleOpenPopup("Invalid address");
            return;
        }

        try {
            await createNewActivityMutation.mutateAsync({
                name: name,
                address: address,
                websiteUrl: website,
                description: description,
                latitude: lat,
                longitude: lng,
                categories: categories,
            });
            setName('');
            setAddress('');
            setWebsite('');
            setDescription('');
            setCategoriesClicked(initialCategories);

            handleOpenPopup("Activity created successfully!");
        } catch (error) {
            handleOpenPopup("Something went wrong. Empty fields?");
        }
    };

    const [popupText, setPopupText] = useState('');
    const [popupOpen, openPopup] = useState(false);
    const handleOpenPopup = (text: string) => {
        setPopupText(text);
        openPopup(true);
    };
    const handleClosePopup = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        openPopup(false);
    };


    // Return empty div if user isn't loaded
    if (!userLoaded) return <div />;
    return (
        <ThemeProvider theme={theme}>
            <PageLayout>
                {isAdminUser && <AdminBar />}
                <div className="flex items-center justify-between border-b border-slate-400 p-4">
                    <TopBar />
                    <div>
                        {!isSignedIn && (
                            <div className="flex justify-center">
                                <SignInButton />
                            </div>
                        )}
                        {isSignedIn && <CreatePostWizard />}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="rounded-xl z-10">
                        <form className="mx-auto my-10 p-6 shadow-md rounded"
                            onSubmit={(event) => { void handleSubmit(event) }}>
                            <h2 className="text-2xl font-bold mb-6 text-gray-200">Add New Activity</h2>
                            <div className="mb-2">
                                <TextField className="w-full" label="Name"
                                    variant="outlined" sx={inputStyles}
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </div>
                            <div className="mb-2">
                                <TextField className="w-full"
                                    label="Address"
                                    variant="outlined"
                                    sx={inputStyles}
                                    value={address}
                                    onChange={handleAddressChange} />
                            </div>
                            <div className="mb-2">
                                <TextField className="w-full"
                                    label="Website"
                                    variant="outlined" sx={inputStyles}
                                    value={website}
                                    onChange={handleWebsiteChange} />
                            </div>
                            <TextField className="w-full mb-4" label="Description" multiline rows={4}
                                variant="outlined"
                                sx={inputStyles} value={description}
                                onChange={handleDescriptionChange} />
                            {/* <TextField className="w-full mb-4" label="Website URL" variant="outlined" /> */}
                            <FormGroup row className="justify-center">
                                {["Party", "Relaxing", "Adventure", "Cultural", "Sports", "Bar", "Indoor", "Outdoor"].map((category, index) => (
                                    <div key={index} className="m-1">
                                        <Button sx={{
                                            color: 'white', // Set text color to white
                                            ...(categoriesClicked[index] ? {} : { borderColor: 'white' }), // Optional: Set border color to white for outlined buttons
                                        }} variant={categoriesClicked[index] ? "contained" : "outlined"} className="h-6" onClick={() => handleCategoryClicked(index)}>{category}</Button>
                                    </div>
                                ))}
                            </FormGroup>
                            <Button type="submit" variant="contained" color="primary" className="w-full mt-6 h-12">
                                Add activity
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="flex items-center justify-between text-xl">
                    <Footer />
                </div>
                <Snackbar
                    open={popupOpen}
                    autoHideDuration={6000}
                    onClose={handleClosePopup}
                    message={popupText}
                />
            </PageLayout>
        </ThemeProvider>
    );
};

export default Home;
