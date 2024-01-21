
import dayjs from 'dayjs';

export const Footer = () => {
    return (
        <footer className="w-screen bg-gray-900 text-white py-8">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <a href="/" className="text-xl font-bold">ActiveNYC</a>
                        <p className="mt-2 text-gray-400">AI-powered recs</p>
                    </div>

                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h5 className="text-lg font-bold mb-4">Quick Links</h5>
                        <ul>
                            <li className="mb-2">
                                <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
                            </li>
                            <li className="mb-2">
                                <a href="/services" className="text-gray-400 hover:text-white">Services</a>
                            </li>
                            <li className="mb-2">
                                <a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a>
                            </li>
                            <li className="mb-2">
                                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h5 className="text-lg font-bold mb-4">Follow Us</h5>
                        <div className="flex">
                            {/* Add href links to your social media */}
                            <a href="#" className="mr-4 text-gray-400 hover:text-white">Facebook</a>
                            <a href="#" className="mr-4 text-gray-400 hover:text-white">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-400 mt-10">
                    <p>&copy; {dayjs().year()} ActiveNYC. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};