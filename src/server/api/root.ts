import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { signinRouter } from "./routers/signin";
import { activityRouter } from "./routers/activity";
import { ratingRouter } from "./routers/rating";
import { likeRouter } from "./routers/like";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  profile: profileRouter,
  signin: signinRouter,
  activity: activityRouter,
  rating: ratingRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
