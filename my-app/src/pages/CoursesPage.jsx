import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CoursesPage() {
    const [sortBy, setSortBy] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isRatingOpen, setIsRatingOpen] = useState(true);
    const [isLecturesOpen, setIsLecturesOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedLectures, setSelectedLectures] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState({});
    const [levels, setLevels] = useState({});
    const [lectureNumbers, setLectureNumbers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coursesResponse = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Courses');
                const coursesData = coursesResponse.data;

                const categoriesResponse = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Categories');
                setCategories(categoriesResponse.data);

                const instructorIds = [...new Set(coursesData.map((c) => c.instructorId))];
                const levelIds = [...new Set(coursesData.map((c) => c.levelId))];

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
                            .filter((content) => content.courseId === course.id)
                            .map((content) => content.lectureNumber)
                            .filter((number) => number !== null && number !== undefined && number !== '');
                        lectureNumbersMap[course.id] = lectureNumbers;
                    } catch {
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
                                { responseType: 'blob' }
                            );
                            return {
                                ...course,
                                imageUrl: URL.createObjectURL(imageResponse.data),
                            };
                        } catch {
                            return { ...course, imageUrl: null };
                        }
                    })
                );
                setCourses(coursesWithImages);
                setLoading(false);
            } catch (err) {
                setError('Failed to load courses. Please try again.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRating, selectedLectures, priceRange, selectedCategories, sortBy]);
    const filteredCourses = courses
        .filter((course) => {
            const categoryTitle = categories.find((cat) => cat.id === course.categoryId)?.title || '';
            const courseLectureNumbers = lectureNumbers[course.id] || [];
            return (
                (selectedRating ? course.rate === selectedRating : true) &&
                (selectedLectures && selectedLectures !== 'All'
                    ? courseLectureNumbers.some((lectureNumber) =>
                        selectedLectures === '1-15'
                            ? lectureNumber >= 1 && lectureNumber <= 15
                            : selectedLectures === '16-30'
                                ? lectureNumber >= 16 && lectureNumber <= 30
                                : selectedLectures === '31-45'
                                    ? lectureNumber >= 31 && lectureNumber <= 45
                                    : lectureNumber > 45
                    )
                    : true) &&
                (course.cost >= priceRange[0] && course.cost <= priceRange[1]) &&
                (selectedCategories.length > 0 ? selectedCategories.includes(categoryTitle) : true)
            );
        })
        .sort((a, b) => {
            if (sortBy === 'Highest price') return b.cost - a.cost;
            if (sortBy === 'Lowest price') return a.cost - b.cost;
            if (sortBy === 'The latest') return b.id - a.id;
            if (sortBy === 'The oldest') return a.id - b.id;
            return b.rate - a.rate;
        });

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const currentCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderStars = (rating, isFilter = false) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${isFilter ? 'cursor-pointer' : ''
                    } transition-colors ${isFilter
                        ? i < rating && selectedRating === rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        : i < rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                    } ${isFilter && selectedRating === rating ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={isFilter ? () => setSelectedRating(selectedRating === rating ? null : rating) : undefined}
            />
        ));

    const CourseCard = ({ course }) => {
        const navigate = useNavigate();
        const courseLectureNumbers = lectureNumbers[course.id] || [];
        const categoryTitle = categories.find((cat) => cat.id === course.categoryId)?.title || 'Unknown';

        return (
            <div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
            >
                <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-orange-50 to-orange-100">
                        <img
                            src={
                                course.imageUrl ||
                                'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop'
                            }
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full border border-blue-200">
                                {categoryTitle}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">{course.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">By {instructors[course.instructorId] || 'Unknown'}</p>
                    <div className="flex items-center gap-1 mb-2">{renderStars(course.rate)}</div>
                    <p className="text-xs text-gray-500 mb-2">
                        {courseLectureNumbers.length > 0
                            ? `${course.totalHours} Total Hours, Lectures: ${courseLectureNumbers.join(', ')}, ${levels[course.levelId] || 'Unknown'
                            }`
                            : `No lectures, ${course.totalHours} Total Hours, ${levels[course.levelId] || 'Unknown'}`}
                    </p>
                    <div className="text-sm font-semibold text-gray-900">${course.cost.toFixed(2)}</div>
                </div>
            </div>
        );
    };

    const handlePriceChange = (index, value) => {
        const newRange = [...priceRange];
        newRange[index] = Math.max(0, Math.min(1000, Number(value)));
        if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
        if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];
        setPriceRange(newRange);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    return (
        <div className="min-h-screen mt-[72px] bg-white">
            <div className="max-w-8xl sm:ml-6 mx-auto p-4 sm:p-6">
                <div className="mb-6 px-2 sm:px-0">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Design Courses</h1>
                    <p className="text-sm text-gray-600">All Development Courses</p>
                </div>
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6 mx-2 sm:mx-0">{error}</div>
                )}
                {loading && <div className="p-6 text-center text-gray-500">Loading courses...</div>}
                {!loading && !error && (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-56 flex-shrink-0 px-2 sm:px-0">
                            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm hover:bg-gray-50 w-full">
                                <Filter className="w-4 h-4 text-gray-600" />
                                <span>Filter</span>
                            </button>
                            <div className="mb-4">
                                <div
                                    className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
                                    onClick={() => setIsRatingOpen(!isRatingOpen)}
                                >
                                    <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transform transition-transform ${isRatingOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>
                                {isRatingOpen && (
                                    <div className="pl-1 pt-3 space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center gap-2">
                                                {renderStars(rating, true)}
                                                <span className="text-sm text-gray-700">
                                                    {rating} Star{rating !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        ))}
                                        <button
                                            className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                                            onClick={() => setSelectedRating(null)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div
                                    className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
                                    onClick={() => setIsLecturesOpen(!isLecturesOpen)}
                                >
                                    <h3 className="text-sm font-medium text-gray-900">Number of Lectures</h3>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transform transition-transform ${isLecturesOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>
                                {isLecturesOpen && (
                                    <div className="space-y-2 text-sm pt-3">
                                        {['All', '1-15', '16-30', '31-45', 'More than 45'].map((range) => (
                                            <label key={range} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="lectures"
                                                    className="mr-2 w-3 h-3"
                                                    checked={selectedLectures === range}
                                                    onChange={() => setSelectedLectures(range)}
                                                />
                                                <span className="text-gray-700">{range}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div
                                    className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
                                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                                >
                                    <h3 className="text-sm font-medium text-gray-900">Price</h3>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transform transition-transform ${isPriceOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>
                                {isPriceOpen && (
                                    <div className="px-1 pt-3">
                                        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                        <div className="relative mb-3">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                                    style={{
                                                        width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`,
                                                        marginLeft: `${(priceRange[0] / 1000) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceChange(0, e.target.value)}
                                                className="absolute top-0 w-full h-2 opacity-0 cursor-pointer hover:opacity-100"
                                                style={{ zIndex: 3 }}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceChange(1, e.target.value)}
                                                className="absolute top-0 w-full h-2 opacity-0 cursor-pointer hover:opacity-100"
                                                style={{ zIndex: 4 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div
                                    className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    <h3 className="text-sm font-medium text-gray-900">Category</h3>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>
                                {isCategoryOpen && (
                                    <div className="space-y-2 text-sm pt-3 max-h-64 overflow-auto">
                                        {categories.map((category) => (
                                            <label key={category.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 w-3 h-3 text-blue-600 rounded"
                                                    checked={selectedCategories.includes(category.title)}
                                                    onChange={() => handleCategoryChange(category.title)}
                                                />
                                                <span className="text-gray-700">{category.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 px-2 sm:px-0">
                            <div className="flex justify-end mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">Sort By</span>
                                    <div className="relative">
                                        <select
                                            className="appearance-none bg-white border border-gray-200 rounded px-3 py-1 pr-7 text-sm focus:outline-none focus:border-blue-500"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option>Highest price</option>
                                            <option>Lowest price</option>
                                            <option>The latest</option>
                                            <option>The oldest</option>
                                            <option>ALL</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {currentCourses.length > 0 ? (
                                    currentCourses.map((course) => <CourseCard key={course.id} course={course} />)
                                ) : (
                                    <div className="col-span-3 text-center py-8 text-gray-500">
                                        No courses found matching your criteria.
                                    </div>
                                )}
                            </div>

                            {filteredCourses.length > 0 && (
                                <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNumber
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
