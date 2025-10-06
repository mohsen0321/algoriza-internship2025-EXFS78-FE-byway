import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { Link } from "react-router-dom";

const TopCourses = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState({});
    const [levels, setLevels] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 4;

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

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

                const instructorResponses = await Promise.all(
                    instructorIds.map((id) => axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${id}`))
                );
                const levelResponses = await Promise.all(
                    levelIds.map((id) => axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Levels/${id}`))
                );

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

                const coursesWithImages = await Promise.all(
                    coursesData.map(async (course) => {
                        try {
                            const imageResponse = await axios.get(
                                `https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${course.id}/image`,
                                { responseType: "blob" }
                            );
                            return { ...course, imageUrl: URL.createObjectURL(imageResponse.data) };
                        } catch {
                            return {
                                ...course,
                                imageUrl:
                                    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop",
                            };
                        }
                    })
                );

                const topCourses = coursesWithImages.sort((a, b) => b.rate - a.rate).slice(0, itemsPerPage);
                setCourses(topCourses);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load top courses. Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
            },
        }),
    };

    return (
        <section ref={ref} className="py-12 bg-white">
            <div className="container mx-auto px-4 sm:ml-4">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Top Courses</h2>
                    <Link
                        to="/coursespage"
                        className="text-blue-500 sm:mr-4 hover:scale-105 transition-all hover:underline font-medium"
                    >
                        See All
                    </Link>
                </div>
                {loading && <div className="p-6 text-center text-gray-500">Loading top courses...</div>}
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-6 mt-6">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                    custom={index}
                                    className="p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-md transform transition-all duration-300 hover:-translate-y-3"
                                >
                                    <img
                                        src={course.imageUrl}
                                        alt={course.name}
                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                    />
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                                        {categories.find((cat) => cat.id === course.categoryId)?.title || "Unknown"}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-700 mt-2">{course.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {instructors[course.instructorId] || "Unknown"}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < course.rate ? "text-yellow-400" : "text-gray-300"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {course.totalHours} Total Hours · {levels[course.levelId] || "Unknown"} level
                                    </p>
                                    <p className="text-lg font-bold text-gray-800 mt-2">
                                        ${course.cost.toFixed(2)}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TopCourses;