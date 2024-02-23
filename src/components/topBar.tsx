import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const TopBar = () => {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    return (
        <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-0 hover:text-gray-400 transition duration-300">AIRecs</Link>
            <Link href="/find" className="text-gray-0 hover:text-gray-400 transition duration-300">Find</Link>
            {isSignedIn && (<Link href="/recs" className="text-gray-0 hover:text-gray-400 transition duration-300">Recs</Link>)}
            {!isSignedIn && <SignInButton><Link href="/recs" className="text-gray-0 hover:text-gray-400 transition duration-300">Recs</Link></SignInButton>}
            {isSignedIn && (<Link href="/saved" className="text-gray-0 hover:text-gray-400 transition duration-300">Saved</Link>)}
            {!isSignedIn && <SignInButton><Link href="/saved" className="text-gray-0 hover:text-gray-400 transition duration-300">Saved</Link></SignInButton>}

            {/* <a onClick={handleOpen} className="text-gray-0 hover:text-gray-400 transition duration-300">Request</a> */}
        </div>
    )
};
