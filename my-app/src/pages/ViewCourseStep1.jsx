import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Upload, Bold, Italic, Underline, List, Link, Star, ImageUp, ChevronDown } from "lucide-react";
import axios from "axios";

const ViewCourseStep1 = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { state } = useLocation();
    const course = state?.course || {};
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState({});
    const [instructors, setInstructors] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to fetch categories. Please try again.");
            }
        };

        const fetchLevels = async () => {
            try {
                const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Levels");
                const levelsMap = response.data.reduce((acc, level) => {
                    acc[level.id] = level.title;
                    return acc;
                }, {});
                setLevels(levelsMap);
            } catch (err) {
                console.error("Error fetching levels:", err);
                setError("Failed to fetch levels. Please try again.");
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors");
                const instructorsMap = response.data.reduce((acc, instructor) => {
                    acc[instructor.id] = instructor.name;
                    return acc;
                }, {});
                setInstructors(instructorsMap);
            } catch (err) {
                console.error("Error fetching instructors:", err);
                setError("Failed to fetch instructors. Please try again.");
            }
        };

        fetchCategories();
        fetchLevels();
        fetchInstructors();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b-2 border-[#E2E6EE] mb-4 md:mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">View Course</h1>
                        <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                            <span>Dashboard</span>
                            <span>/</span>
                            <span>Courses</span>
                            <span>/</span>
                            <span>View Course</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">View Course Details</h1>
                        <span className="text-xs md:text-sm font-semibold text-gray-500">Step 1 of 2</span>
                    </div>
                </div>
                <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4 md:mb-6 mt-4 md:mt-6">Course details</h2>
                {error && (
                    <div className="p-3 md:p-4 bg-red-100 text-red-700 rounded-lg mb-4 md:mb-6 text-sm md:text-base">
                        {error}
                    </div>
                )}

                <div className="max-w-4xl space-y-4 md:space-y-6">
                    <div className="w-full border border-gray-300 rounded-lg p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="w-full md:w-[350px] h-[180px] md:h-[215px] border-2 border-gray-300 rounded-lg flex gap-2 items-center justify-center bg-gray-100">
                            {course.imageUrl ? (
                                <img
                                    src={course.imageUrl}
                                    alt={course.name}
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            ) : (
                                <p className="text-gray-600 text-sm">No Image Available</p>
                            )}
                        </div>
                        <div className="flex-1 text-xs md:text-sm text-gray-600 w-full md:w-auto text-center md:text-left">
                            <p className="mb-1 md:mb-2">Size: 700x430 pixels</p>
                            <p className="mb-1 md:mb-2">File Support: .jpg, .jpeg, .png, or .gif</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                        <p className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 min-h-[42px] flex items-center">
                            {course.name || "N/A"}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 min-h-[42px] flex items-center">
                                {categories.find((cat) => cat.id === course.categoryId)?.title || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 min-h-[42px] flex items-center">
                                {levels[course.levelId] || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 min-h-[42px] flex items-center">
                                {instructors[course.instructorId] || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 min-h-[42px] flex items-center">
                                ${course.cost?.toFixed(2) || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Hours</label>
                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 min-h-[42px] flex items-center">
                                {course.totalHours || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                            <div className="flex items-center gap-1 p-2 md:p-3 border border-gray-300 rounded-lg bg-gray-50">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        md:size={16}
                                        className={`${i < course.rate ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <div className="border border-gray-300 rounded-lg bg-gray-50">
                                <div className="px-3 py-2 border-b border-gray-300 bg-gray-100">
                                    <span className="text-xs text-gray-500">Description Content</span>
                                </div>
                                <div className="p-3 min-h-[120px]">
                                    <p className="text-gray-900 whitespace-pre-wrap">
                                        {course.description || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                            <div className="border border-gray-300 rounded-lg bg-gray-50">
                                <div className="px-3 py-2 border-b border-gray-300 bg-gray-100">
                                    <span className="text-xs text-gray-500">Certification Content</span>
                                </div>
                                <div className="p-3 min-h-[120px]">
                                    <p className="text-gray-900 whitespace-pre-wrap">
                                        {course.certification || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-4">
                        <button
                            onClick={() => navigate("/dashboard/courses")}
                            className="px-4 md:px-6 py-2 bg-red-100 text-red-500 font-semibold rounded-lg cursor-pointer hover:scale-105 transition-all hover:bg-red-200 text-sm md:text-base"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => navigate(`/dashboard/view-course/step2/${courseId}`, { state: { course } })}
                            className="px-4 md:px-96 py-2 bg-gray-900 w-full md:w-auto text-white rounded-lg cursor-pointer hover:scale-95 transition-all hover:bg-gray-800 text-sm md:text-base"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCourseStep1;