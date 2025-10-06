export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="text-center">
                {/* رقم 404 */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-indigo-600 mb-2">404</h1>
                    <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* الرسالة */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Page not found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    Sorry, the page you are looking for does not exist or has been moved to another location.
                </p>

                {/* زر العودة للصفحة الرئيسية */}
                <a
                    href="/"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    Return to the home page
                </a>
            </div>
        </div>
    );
}