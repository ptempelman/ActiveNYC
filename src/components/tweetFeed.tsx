
import { api } from "~/utils/api";

import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";


export const Feed = () => {
    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
    if (postsLoading)
        return (
            <div className="flex grow">
                <LoadingPage />
            </div>
        );

    if (!data) return <div>Something went wrong</div>;

    return (
        <div className="flex grow flex-col">
            {[...data].map((fullPost) => (  // [...data, ...data, ...data, ...data]
                <PostView {...fullPost} key={fullPost.post.id} />
            ))}
        </div>
    );
};