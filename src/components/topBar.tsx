export const TopBar = () => {
    return (
        <div className="flex items-center gap-4">
            <a href="/" className="text-gray-0 hover:text-gray-400 transition duration-300">ActiveNYC</a>
            <a href="/find" className="text-gray-0 hover:text-gray-400 transition duration-300">Find</a>
            <a href="/swipe" className="text-gray-0 hover:text-gray-400 transition duration-300">Swipe</a>
            <a href="/saved" className="text-gray-0 hover:text-gray-400 transition duration-300">Saved</a>
            {/* <a onClick={handleOpen} className="text-gray-0 hover:text-gray-400 transition duration-300">Request</a> */}

        </div>
    )
};
