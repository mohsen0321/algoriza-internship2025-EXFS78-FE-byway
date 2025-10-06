import React from 'react';
import { Link } from 'react-router-dom';

export default function Thanks() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
            <div className="flex flex-col items-center text-center max-w-md sm:max-w-lg w-full space-y-6">
                <svg
                    className="w-40 h-40 sm:w-56 sm:h-56"
                    viewBox="0 0 201 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="100.5" cy="100" r="100" fill="#16A34A" />
                    <g clipPath="url(#clip0_2002_1179)">
                        <path
                            d="M137.327 54.0945L89.6734 116.921L61.5 88.7679L48.5 101.768L91.8266 145.094L152.5 67.0945L137.327 54.0945Z"
                            fill="white"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_2002_1179">
                            <rect
                                width="104"
                                height="104"
                                fill="white"
                                transform="translate(48.498 48.0002)"
                            />
                        </clipPath>
                    </defs>
                </svg>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Purchase Complete
                </h1>

                <p className="text-gray-600 font-semibold text-lg sm:text-xl">
                    You will receive a confirmation email soon!
                </p>

                <Link
                    to="/"
                    className="bg-gray-900 text-white py-3 px-10 sm:px-20 rounded-md hover:scale-110 hover:bg-gray-800 transition-all cursor-pointer duration-200 font-medium"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}
