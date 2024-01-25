import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/layout";

import { Button, SelectChangeEvent } from "@mui/material";
import { ReactNode, useState } from "react";
import { ActivityRequestModal } from "~/components/activityRequestModal";
import { FilterBar } from "~/components/filter/filterBar";
import { Footer } from "~/components/footer";
import { TopBar } from "~/components/topBar";
import { CreatePostWizard } from "~/components/tweetBox";
import { RecActivityFeed } from "~/components/activity/recActivityFeed";


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

    const [searchValue, setSearchValue] = useState('');
    const handleClearSearch = () => {
        setSearchValue('');
    };

    const handleClearCategory = () => {
        setSelectedCategories([]);
    }
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const handleChangeCategories = (event: SelectChangeEvent<string[]>, child: ReactNode) => {
        setSelectedCategories(event.target.value as string[]);
    };

    const isAdminUser = api.profile.isAdminUser.useQuery({ userId: user?.id }).data?.isAdmin;
    console.log(isAdminUser)

    // Return empty div if user isn't loaded
    if (!userLoaded) return <div />;
    return (
        <ThemeProvider theme={theme}>
            <PageLayout>

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
                <FilterBar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} handleClearCategory={handleClearCategory} handleChangeCategories={handleChangeCategories} searchValue={searchValue} setSearchValue={setSearchValue} handleClearSearch={handleClearSearch} />
                <ActivityRequestModal />
                <RecActivityFeed selectedCategories={selectedCategories} searchValue={searchValue} />
                {/* <Feed /> */}
                {/* <ActivityFeed selectedCategories={selectedCategories} searchValue={searchValue} /> */}

                
                <div className="flex items-center justify-between text-xl">
                    <Footer />
                </div>
            </PageLayout>
        </ThemeProvider>
    );
};

export default Home;
