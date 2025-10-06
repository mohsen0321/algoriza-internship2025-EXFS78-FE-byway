import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Educationimage from '../Homeimages/educationimage.png';
import { ArrowRight } from 'lucide-react';

const EducationSection = () => {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });


    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };


    const textVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 },
        },
    };

    return (
        <div ref={ref} className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">

                    <motion.div
                        className="w-full lg:w-1/2 mb-6 lg:mb-0 order-1 lg:order-2"
                        variants={imageVariants}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                    >
                        <div className="relative">
                            <img
                                src={Educationimage}
                                alt="Person with laptop"
                                className="w-full max-w-[300px] sm:max-w-[400px] h-auto object-cover rounded-[20px] bg-blue-200 mx-auto"
                                style={{ objectPosition: 'center top' }}
                            />
                        </div>
                    </motion.div>


                    <motion.div
                        className="w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1"
                        variants={textVariants}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                    >
                        <div className="max-w-md text-center lg:text-left">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                Transform your life through education
                            </h2>
                            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                                Learners around the world are launching new careers, advancing in their fields, and enriching their lives.
                            </p>
                            <motion.button
                                className="bg-gray-900 cursor-pointer hover:scale-105 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center space-x-2 mx-auto lg:mx-0"
                                variants={buttonVariants}
                                initial="hidden"
                                animate={inView ? 'visible' : 'hidden'}
                            >
                                <span>Checkout Courses</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EducationSection;