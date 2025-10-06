import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

const InstructorCard = ({ instructor, index, direction, inView }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: index * 0.1 },
        },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <motion.div
            key={instructor.id}
            custom={direction}
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            exit="exit"
            className="p-6 border border-gray-300 rounded-lg w-full max-w-[20.55rem] h-[350px] shadow-lg hover:shadow-md transform transition-all duration-300 hover:-translate-y-3 flex-shrink-0 mx-auto sm:mx-5"
        >

            <div className="mb-4">
                <img
                    src={instructor.imageUrl}
                    alt={instructor.name}
                    className="w-full h-44 object-cover rounded-lg"
                    onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
                    }}
                />
            </div>
            <h3 className="text-lg text-center font-bold text-gray-900 mb-1">
                {instructor.name}
            </h3>
            <p className="text-sm text-center text-gray-500 mb-4 border-b-2 pb-4 border-[#E2E8F0]">
                {instructor.categoryTitle}
            </p>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-bold text-gray-900">{instructor.rate}</span>
                </div>
                <span className="text-sm text-gray-600">{instructor.studentCount || "2400 Students"}</span>
            </div>
        </motion.div>
    );
};

const TopInstructors = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [instructors, setInstructors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(0);
    const itemsPerPage = 4;

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoriesResponse = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Categories");
                setCategories(categoriesResponse.data);
                const instructorsResponse = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors");
                const instructorsData = await Promise.all(
                    instructorsResponse.data.map(async (instructor) => {
                        try {
                            const imageResponse = await axios.get(
                                `https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${instructor.id}/image`,
                                { responseType: "blob" }
                            );
                            return {
                                ...instructor,
                                imageUrl: URL.createObjectURL(imageResponse.data),
                                categoryTitle:
                                    categoriesResponse.data.find((c) => c.id === instructor.categoryId)?.title || "Unknown",
                            };
                        } catch {
                            return {
                                ...instructor,
                                imageUrl:
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                                categoryTitle:
                                    categoriesResponse.data.find((c) => c.id === instructor.categoryId)?.title || "Unknown",
                            };
                        }
                    })
                );
                setInstructors(instructorsData.sort((a, b) => b.rate - a.rate));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load Instructors data. Try again.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalSlides = Math.ceil(instructors.length / itemsPerPage);
    const displayInstructors = instructors.slice(
        currentSlide * itemsPerPage,
        (currentSlide + 1) * itemsPerPage
    );

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    return (
        <section ref={ref} className="py-12 bg-white">
            <div className="container mx-auto px-4 sm:px-6 sm:-ml-2 lg:px-8 max-w-[1600px]">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0 sm:ml-6">Top Instructors</h2>
                    <div className="flex items-center space-x-4 sm:mr-16">
                        <div className="flex space-x-2 sm:-mr-14">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="py-2 px-4 bg-[#94A3B8] cursor-pointer rounded-lg hover:scale-110 transition duration-300 disabled:opacity-50"
                            >
                                <ChevronLeft className="text-white" size={25} />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={currentSlide === totalSlides - 1}
                                className="py-2 px-4 bg-[#94A3B8] rounded-lg hover:scale-110 cursor-pointer transition duration-300 disabled:opacity-50"
                            >
                                <ChevronRight className="text-white" size={25} />
                            </button>
                        </div>
                    </div>
                </div>
                {loading && <div className="p-6 text-center text-gray-500">Loading  Top Instructors...</div>}
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-6 mt-6">{error}</div>
                )}
                {!loading && !error && instructors.length > 0 && (
                    <div className="relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:-ml-10 p-4 sm:p-10">
                            <AnimatePresence mode="wait" custom={direction}>
                                {displayInstructors.map((instructor, index) => (
                                    <InstructorCard
                                        key={instructor.id}
                                        instructor={instructor}
                                        index={index}
                                        direction={direction}
                                        inView={inView}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TopInstructors;