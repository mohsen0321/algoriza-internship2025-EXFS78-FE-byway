import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Star,
    ChevronDown,
    RefreshCw,
    Menu,
    X
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteModal = ({ onClose, onDelete, selectedCourse }) => (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-4">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Are you sure you want to delete this?</h3>
                <p className="text-gray-400 mb-6">
                    Course <span className="font-bold text-black">{selectedCourse?.name}</span>?
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border cursor-pointer hover:scale-105 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 px-4 py-2 cursor-pointer hover:scale-105 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);
const Courses = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [instructors, setInstructors] = useState({});
    const [levels, setLevels] = useState({});
    const [lectureNumbers, setLectureNumbers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const coursesPerPage = 6;
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coursesResponse = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Courses");
                const coursesData = coursesResponse.data;
                const categoriesResponse = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Categories");
                setCategories(categoriesResponse.data);
                const instructorIds = [...new Set(coursesData.map((course) => course.instructorId))];
                const levelIds = [...new Set(coursesData.map((course) => course.levelId))];

                const instructorPromises = instructorIds.map((id) =>
                    axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${id}`)
                );
                const levelPromises = levelIds.map((id) =>
                    axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Levels/${id}`)
                );

                const instructorResponses = await Promise.all(instructorPromises);
                const levelResponses = await Promise.all(levelPromises);

                const instructorsMap = instructorResponses.reduce((acc, res) => {
                    acc[res.data.id] = res.data.name;
                    return acc;
                }, {});
                const levelsMap = levelResponses.reduce((acc, res) => {
                    acc[res.data.id] = res.data.title;
                    return acc;
                }, {});

                setInstructors(instructorsMap);
                setLevels(levelsMap);
                const lectureNumbersMap = {};
                const lectureNumberPromises = coursesData.map(async (course) => {
                    try {
                        const response = await axios.get(
                            `https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents?courseId=${course.id}`
                        );
                        const lectureNumbers = response.data
                            .filter(content => content.courseId === course.id)
                            .map(content => content.lectureNumber)
                            .filter(number => number !== null && number !== undefined && number !== "");

                        lectureNumbersMap[course.id] = lectureNumbers;
                    } catch (err) {
                        console.error(`Error fetching lecture numbers for course ${course.id}:`, err);
                        lectureNumbersMap[course.id] = [];
                    }
                });

                await Promise.all(lectureNumberPromises);
                setLectureNumbers(lectureNumbersMap);
                const coursesWithImages = await Promise.all(
                    coursesData.map(async (course) => {
                        try {
                            const imageResponse = await axios.get(
                                `https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${course.id}/image`,
                                { responseType: "blob" }
                            );
                            return {
                                ...course,
                                imageUrl: URL.createObjectURL(imageResponse.data),
                            };
                        } catch (err) {
                            console.error(`Error fetching image for course ${course.id}:`, err);
                            return { ...course, imageUrl: null };
                        }
                    })
                );

                setCourses(coursesWithImages);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load courses. Please try again.");
                toast.error("Failed to load courses. Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const openDeleteModal = async (course) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("You are not authenticated. Please log in.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                navigate("/login");
                return;
            }
            const response = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Payment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const hasPayments = response.data.some(payment => payment.courseId === course.id);
            if (hasPayments) {
                toast.error('This course cannot be deleted because it has been purchased.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                return;
            }
            setSelectedCourse(course);
            setIsDeleteModalOpen(true);
        } catch (err) {
            console.error('Error checking payments:', err);
            toast.error('Failed to verify course payments. Please try again.', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored"
            });
        }
    };
    const openEditCourse = async (course) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("You are not authenticated. Please log in.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                navigate("/login");
                return;
            }
            const response = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Payment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const hasPayments = response.data.some(payment => payment.courseId === course.id);
            if (hasPayments) {
                toast.error('This course cannot be updated because it has been purchased.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                return;
            }
            navigate(`/dashboard/edit-course/step1/${course.id}`, {
                state: { course, isEdit: true }
            });
        } catch (err) {
            console.error('Error checking payments for edit:', err);
            toast.error('Failed to verify course payments. Please try again.', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored"
            });
        }
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedCourse(null);
    };
    const handleDelete = async () => {
        if (!selectedCourse) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("You are not authenticated. Please log in.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                navigate("/login");
                return;
            }
            await axios.delete(`https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${selectedCourse.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses((prev) => prev.filter((course) => course.id !== selectedCourse.id));
            setIsDeleteModalOpen(false);
            setSelectedCourse(null);
            toast.success('Course deleted successfully!', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored"
            });
            const filteredCourses = courses.filter((course) => {
                const searchLower = searchTerm.toLowerCase();
                const categoryTitle = categories.find((cat) => cat.id === course.categoryId)?.title || "";
                const matchesSearch =
                    course.name.toLowerCase().includes(searchLower) ||
                    categoryTitle.toLowerCase().includes(searchLower) ||
                    course.rate.toString().includes(searchLower) ||
                    course.cost.toString().toLowerCase().includes(searchLower);
                const matchesCategory = selectedCategory
                    ? course.categoryId === parseInt(selectedCategory)
                    : true;
                return matchesSearch && matchesCategory;
            });
            const totalPages = Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage));
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            } else if (totalPages === 0) {
                setCurrentPage(1);
            }
        } catch (err) {
            console.error("Error deleting course:", err);
            let errorMessage = "Failed to delete course. Please try again.";
            if (err.response) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.status === 401) {
                    errorMessage = "You are not authorized. Please log in.";
                    navigate("/login");
                }
            }
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored"
            });
            setError(errorMessage);
            setIsDeleteModalOpen(false);
        }
    };
    const filteredCourses = courses
        .filter((course) => {
            const searchLower = searchTerm.toLowerCase();
            const categoryTitle = categories.find((cat) => cat.id === course.categoryId)?.title || "";

            const matchesSearch =
                course.name.toLowerCase().includes(searchLower) ||
                categoryTitle.toLowerCase().includes(searchLower) ||
                course.rate.toString().includes(searchLower) ||
                course.cost.toString().toLowerCase().includes(searchLower);

            const matchesCategory = selectedCategory
                ? course.categoryId === parseInt(selectedCategory)
                : true;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => b.rate - a.rate);
    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage));
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const CourseCard = ({ course }) => {
        const courseLectureNumbers = lectureNumbers[course.id] || [];

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 bg-gradient-to-br from-amber-50 to-orange-100">
                    <img
                        src={
                            course.imageUrl ||
                            "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop"
                        }
                        alt={course.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {categories.find((cat) => cat.id === course.categoryId)?.title || "Unknown"}
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{course.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                        By {instructors[course.instructorId] || "Unknown"}
                    </p>

                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={`${i < course.rate ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                        <span className="line-clamp-2">
                            {courseLectureNumbers.length > 0 ? (
                                <>
                                    Total Hours {course.totalHours} • Lectures: {courseLectureNumbers.join(", ")} • {levels[course.levelId] || "Unknown"} level
                                </>
                            ) : (
                                <>
                                    No lectures • Total Hours {course.totalHours} • {levels[course.levelId] || "Unknown"} level
                                </>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${course.cost.toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() =>
                                    navigate(`/dashboard/view-course/step1/${course.id}`, {
                                        state: { course },
                                    })
                                }
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View Course"
                            >
                                <Eye size={14} />
                            </button>
                            <button
                                onClick={() => openEditCourse(course)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Edit Course"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={() => openDeleteModal(course)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete Course"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const MobileFilters = () => (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden">
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Filters</h3>
                        <button
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="flex items-center gap-4 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 appearance-none cursor-pointer"
                                required
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Courses</h1>
                        <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                            <span>Dashboard</span>
                            <span>/</span>
                            <span>Courses</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <svg
                            width="78"
                            height="78"
                            viewBox="0 0 78 78"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hidden md:block"
                        >
                            <g filter="url(#filter0_d_2041_5242)">
                                <rect
                                    x="15"
                                    y="11"
                                    width="48"
                                    height="48"
                                    rx="24"
                                    fill="white"
                                    shapeRendering="crispEdges"
                                />
                                <path
                                    d="M40.8476 43.0088C40.4504 43.6062 39.7711 44 38.9998 44C38.2286 44 37.5493 43.6062 37.152 43.0088M39.0005 27C41.8578 27.0003 44.1736 29.3169 44.1736 32.1741V33.4463C44.1736 34.6934 45.0375 35.7962 45.4743 36.9643C45.5893 37.2719 45.6522 37.6049 45.6522 37.9526C45.652 39.3148 44.6785 40.4836 43.3291 40.6708C41.9889 40.8566 40.3138 41.0438 38.9994 41.0438C37.6852 41.0437 36.0109 40.8566 34.6709 40.6708C33.3215 40.4837 32.348 39.3148 32.3478 37.9526C32.3478 37.605 32.4106 37.272 32.5256 36.9645C32.9623 35.7962 33.8264 34.6933 33.8264 33.446V32.1741C33.8264 29.3167 36.1431 27 39.0005 27Z"
                                    stroke="#96A0B6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle cx="45.5" cy="30" r="4" fill="#E45F5F" stroke="white" />
                            </g>
                            <defs>
                                <filter
                                    id="filter0_d_2041_5242"
                                    x="0"
                                    y="0"
                                    width="78"
                                    height="78"
                                    filterUnits="userSpaceOnUse"
                                    colorInterpolationFilters="sRGB"
                                >
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix
                                        in="SourceAlpha"
                                        type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                        result="hardAlpha"
                                    />
                                    <feOffset dy="4" />
                                    <feGaussianBlur stdDeviation="7.5" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix
                                        type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in2="BackgroundImageFix"
                                        result="effect1_dropShadow_2041_5242"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in="SourceGraphic"
                                        in2="effect1_dropShadow_2041_5242"
                                        result="shape"
                                    />
                                </filter>
                            </defs>
                        </svg>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hidden md:block"
                        >
                            <circle cx="20" cy="20" r="20" fill="#334155" />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="bold"
                                fill="white"
                            >
                                A
                            </text>
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-medium text-gray-900 hidden md:block">
                            Courses ({filteredCourses.length})
                        </h2>
                        <button
                            onClick={() => navigate("/dashboard/add-course/step1")}
                            className="bg-gray-900 text-white px-4 cursor-pointer hover:scale-105 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium w-full md:w-auto"
                        >
                            Add Course
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="md:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter size={16} className="text-gray-400" />
                        </button>
                        <div className="hidden md:flex items-center gap-3">
                            <div className="relative w-48 lg:w-64">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="flex items-center gap-4 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
                                />
                            </div>

                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Filter size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="md:hidden mt-2">
                    <h2 className="text-sm font-medium text-gray-600">
                        {filteredCourses.length} courses found
                    </h2>
                </div>
            </div>
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 md:mx-6 mt-4 md:mt-6">
                    {error}
                </div>
            )}
            {loading && (
                <div className="p-6 text-center text-gray-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                    <p>Loading courses...</p>
                </div>
            )}
            {isDeleteModalOpen && (
                <DeleteModal
                    onClose={closeDeleteModal}
                    onDelete={handleDelete}
                    selectedCourse={selectedCourse}
                />
            )}
            {isMobileFiltersOpen && <MobileFilters />}
            {!loading && !error && (
                <div className="p-4 md:p-6">
                    {filteredCourses.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p className="text-lg">No courses found.</p>
                            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                            {currentCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-gray-800"
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, index) => index + 1)
                                    .filter(pageNumber => {
                                        if (totalPages <= 5) return true;
                                        return (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        );
                                    })
                                    .map((pageNumber, index, array) => {
                                        const showEllipsis = index > 0 && pageNumber - array[index - 1] > 1;
                                        return (
                                            <React.Fragment key={pageNumber}>
                                                {showEllipsis && (
                                                    <span className="px-2 text-gray-500">...</span>
                                                )}
                                                <button
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${currentPage === pageNumber
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${currentPage === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-gray-800"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Courses;