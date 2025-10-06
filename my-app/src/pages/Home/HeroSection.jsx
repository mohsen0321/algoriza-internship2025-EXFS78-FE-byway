import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Hero from "../Homeimages/Hero.jpeg";
import { Link } from "react-router-dom";

export default function HeroSection() {

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });


    const textVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: "easeOut", delay: 0.2 },
        },
    };


    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
        },
    };

    return (
        <section
            ref={ref}
            className="bg-white py-18 sm:py-12 lg:py-20"
        >

            <div className="mx-auto sm:-ml-8 ml-0 px-4 sm:px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">

                <motion.div
                    className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2"
                    variants={imageVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <img
                        src={Hero}
                        alt="Byway preview"
                        className="max-w-full h-auto  -ml-16 sm:w-3/4 lg:w-full lg:ml-12 object-cover"
                    />
                </motion.div>

                <motion.div
                    className="w-full lg:w-[592px] flex flex-col justify-center gap-6 text-center lg:text-left order-2 lg:order-1"
                    variants={textVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
                        Unlock Your Potential <br /> with Byway
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Welcome to Byway, where learning knows no bounds. We believe that education is the key to personal and professional growth, and we're here to guide you on your journey to success.
                    </p>

                    <motion.div
                        variants={buttonVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                    >
                        <Link
                            to="/login"
                            className="bg-[#3B82F6] transition-all cursor-pointer hover:scale-105 hover:bg-blue-700 text-white font-medium py-3 sm:py-4 px-6 rounded-md w-fit mx-auto lg:mx-0"
                        >
                            Start your journey
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}