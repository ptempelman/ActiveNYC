import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/layout";

import { ActivityFeed } from "~/components/activityfeed";
import { ActivityRequestModal } from "~/components/activityRequestModal";
import { CreatePostWizard } from "~/components/tweetBox";
import { TopBar } from "~/components/topBar";
import { Footer } from "~/components/footer";
import { FilterBar } from "~/components/filterBar";

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
  api.posts.getAll.useQuery();

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
        <FilterBar />
        <ActivityRequestModal />
        {/* <Feed /> */}
        <ActivityFeed />
        <div className="flex items-center justify-between text-xl">
          <Footer />
        </div>
      </PageLayout>
    </ThemeProvider>
  );
};

export default Home;
