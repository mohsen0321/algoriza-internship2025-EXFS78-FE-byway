import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const ViewCourseStep2 = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { state } = useLocation();
    const course = state?.course || {};
    const [contents, setContents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContents = async () => {
            if (!courseId) {
                setError("No course ID provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents?courseId=${courseId}`
                );
                const filteredContents = response.data
                    .filter((content) => content.courseId === parseInt(courseId))
                    .map((content) => ({
                        id: content.id,
                        name: content.name || "",
                        lectureNumber: content.lectureNumber || "",
                        time: content.time || "",
                    }));
                setContents(filteredContents);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching course contents:", err);
                setError("Failed to load course contents. Please try again.");
                setLoading(false);
            }
        };

        fetchContents();
    }, [courseId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#E2E6EE] mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Courses</span>
                        <span>/</span>
                        <span>View Course</span>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg md:shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <button
                            onClick={() =>
                                navigate(`/dashboard/view-course/step1/${courseId}`, {
                                    state: { course },
                                })
                            }
                            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:scale-105 transition-all hover:text-gray-900 self-start"
                        >
                            <ArrowLeft size={25} />
                        </button>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h2 className="text-lg font-medium text-gray-900">View Content</h2>
                            <p className="text-sm text-gray-500">Step 2 of 2</p>
                        </div>
                    </div>
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="p-4 text-center text-gray-500">
                            Loading contents...
                        </div>
                    )}
                    {!loading && !error && (
                        <div className="space-y-4 md:space-y-6">
                            {contents.length === 0 ? (
                                <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg">
                                    No contents available for this course.
                                </div>
                            ) : (
                                contents.map((content) => (
                                    <div
                                        key={content.id}
                                        className="p-4 md:p-6 bg-gray-100 rounded-lg space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                                <p className="text-gray-900">
                                                    {content.name || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Lectures Number
                                                </label>
                                                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                                    <p className="text-gray-900">
                                                        {content.lectureNumber || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Time
                                                </label>
                                                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                                    <p className="text-gray-900">
                                                        {content.time || "N/A"} {content.time ? "minutes" : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {!loading && (
                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                            <button
                                onClick={() =>
                                    navigate(`/dashboard/view-course/step1/${courseId}`, {
                                        state: { course },
                                    })
                                }
                                className="px-4 py-2 md:px-6 md:py-2 bg-red-100 text-red-500 font-semibold rounded-lg cursor-pointer hover:scale-105 transition-all hover:bg-red-200"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/courses")}
                                className="px-4 py-2 md:px-8 md:py-2 bg-gray-900 w-full sm:w-auto text-white rounded-lg cursor-pointer hover:scale-95 transition-all hover:bg-gray-800"
                            >
                                Finish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewCourseStep2;