import Link from "next/link";

export const TopBar = () => {
    return (
        <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-0 hover:text-gray-400 transition duration-300">ActiveNYC</Link>
            <Link href="/find" className="text-gray-0 hover:text-gray-400 transition duration-300">Find</Link>
            <Link href="/recs" className="text-gray-0 hover:text-gray-400 transition duration-300">Recs</Link>
            <Link href="/saved" className="text-gray-0 hover:text-gray-400 transition duration-300">Saved</Link>
            {/* <a onClick={handleOpen} className="text-gray-0 hover:text-gray-400 transition duration-300">Request</a> */}
        </div>
    )
};
