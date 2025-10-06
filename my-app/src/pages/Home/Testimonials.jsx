import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import testominals from '../Homeimages/testominals.jpg';

const TestimonialCard = ({ testimonial, index, direction, inView }) => {
    const itemVariants = {
        hidden: (dir) => ({
            opacity: 0,
            x: dir > 0 ? 60 : -60,
            y: 20,
        }),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.35, delay: index * 0.06 },
        },
        exit: (dir) => ({
            opacity: 0,
            x: dir > 0 ? -60 : 60,
            y: -20,
        }),
    };

    return (
        <motion.div
            key={testimonial.id}
            custom={direction}
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            exit="exit"
            className="bg-white rounded-lg p-4 sm:p-6 mx-2 sm:mx-4 my-4 sm:my-6 shadow-sm border border-gray-100 transition-all hover:scale-105 hover:shadow-xl"
        >
            <div className="mb-3 sm:mb-4">
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 49 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 sm:w-10 sm:h-10"
                >
                    <path
                        d="M9.666 34.642C7.606 32.454 6.5 30 6.5 26.022C6.5 19.022 11.414 12.748 18.56 9.646L20.346 12.402C13.676 16.01 12.372 20.692 11.852 23.644C12.926 23.088 14.332 22.894 15.71 23.022C19.318 23.356 22.162 26.318 22.162 30C22.162 31.8565 21.4245 33.637 20.1117 34.9497C18.799 36.2625 17.0185 37 15.162 37C14.1353 36.991 13.1207 36.7779 12.1771 36.3731C11.2336 35.9683 10.38 35.3798 9.666 34.642ZM29.666 34.642C27.606 32.454 26.5 30 26.5 26.022C26.5 19.022 31.414 12.748 38.56 9.646L40.346 12.402C33.676 16.01 32.372 20.692 31.852 23.644C32.926 23.088 34.332 22.894 35.71 23.022C39.318 23.356 42.162 26.318 42.162 30C42.162 31.8565 41.4245 33.637 40.1117 34.9497C38.799 36.2625 37.0185 37 35.162 37C34.1353 36.991 33.1207 36.7779 32.1771 36.3731C31.2336 35.9683 30.38 35.3798 29.666 34.642Z"
                        fill="#3B82F6"
                    />
                </svg>
            </div>
            <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-4 sm:line-clamp-none">
                {testimonial.text}
            </p>
            <div className="flex items-center">
                <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3"
                />
                <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Testimonials = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

    const getItemsPerPage = () => {
        if (typeof window === 'undefined') return 3;
        const width = window.innerWidth;
        if (width < 640) return 1;
        if (width < 768) return 2;
        if (width < 1024) return 2;
        return 3;
    };

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(getItemsPerPage());
            setCurrentPage(0);
        };

        window.addEventListener('resize', handleResize);
        setItemsPerPage(getItemsPerPage());
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const testimonials = [
        {
            id: 1,
            text: "Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
            name: "Jane Doe",
            role: "Designer",
            avatar: testominals,
        },
        {
            id: 2,
            text: "I love how interactive and engaging the lessons are. It feels less like studying and more like an exciting journey into tech.",
            name: "John Smith",
            role: "Developer",
            avatar: testominals,
        },
        {
            id: 3,
            text: "The flexibility and clarity of Byway's courses make it easy to balance learning with my work schedule.",
            name: "Emily Brown",
            role: "Project Manager",
            avatar: testominals,
        },
        {
            id: 4,
            text: "Honestly, one of the best learning experiences I've had online. Highly recommend!",
            name: "Michael Lee",
            role: "Data Analyst",
            avatar: testominals,
        },
        {
            id: 5,
            text: "Clear explanations, practical examples, and great support. Exactly what I needed.",
            name: "Sarah Connor",
            role: "Engineer",
            avatar: testominals,
        },
    ];

    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setDirection(1);
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setDirection(-1);
            setCurrentPage((prev) => prev - 1);
        }
    };

    const startIndex = currentPage * itemsPerPage;
    const currentTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div ref={ref} className="bg-gray-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 px-4 sm:px-0">
                    <div className="text-center sm:text-right mb-6 ml-3 sm:mb-0">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            What Our Customers Say
                        </h2>
                        <h3 className="text-xl sm:text-2xl sm:text-left lg:text-3xl font-bold text-gray-900">About Us</h3>
                    </div>
                    <div className="flex space-x-2 sm:mr-4">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            aria-label="Previous testimonials"
                            className="p-2 sm:py-2 sm:px-4  cursor-pointer bg-[#94A3B8] rounded-lg hover:scale-110 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4  sm:w-5 sm:h-5 text-white" />
                        </button>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages - 1}
                            aria-label="Next testimonials"
                            className="p-2 sm:py-2 sm:px-4 cursor-pointer bg-[#94A3B8] rounded-lg hover:scale-110 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4  h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                    </div>
                </div>
                <div className="relative overflow-hidden">
                    <div className={`grid grid-cols-1 ${itemsPerPage >= 2 ? 'sm:grid-cols-2' : ''} ${itemsPerPage >= 3 ? 'lg:grid-cols-3' : ''} gap-4 sm:gap-6 lg:gap-8`}>
                        <AnimatePresence custom={direction}>
                            {currentTestimonials.map((t, idx) => (
                                <TestimonialCard
                                    key={t.id}
                                    testimonial={t}
                                    index={idx}
                                    direction={direction}
                                    inView={inView}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (index === currentPage) return;
                                    setDirection(index > currentPage ? 1 : -1);
                                    setCurrentPage(index);
                                }}
                                aria-label={`Go to page ${index + 1}`}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentPage ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Testimonials;