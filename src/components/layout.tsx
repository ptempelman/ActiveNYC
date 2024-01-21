import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex justify-center">
      <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-7xl min-h-screen">
        {props.children}
      </div>
    </main>
  );
};
