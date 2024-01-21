import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/layout";

import { useRouter } from "next/router";
import { SingleActivity } from "~/components/activity/singleActivity";
import { Footer } from "~/components/footer";
import { TopBar } from "~/components/topBar";
import { CreatePostWizard } from "~/components/tweetBox";

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
    const router = useRouter();
    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id

    const { isLoaded: userLoaded, isSignedIn, user } = useUser();

    api.signin.createUser.useQuery({ id: user?.id, email: user?.primaryEmailAddress?.emailAddress ?? null });

    // Start fetching asap
    // api.posts.getAll.useQuery();

    if (!id) return <div>404</div>;

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
                {/* <ActivityRequestModal /> */}
                {/* <Feed /> */}
                <SingleActivity activityId={id} />
                <div className="flex items-center justify-between text-xl">
                    <Footer />
                </div>
            </PageLayout>
        </ThemeProvider>
    );
};

export default Home;
