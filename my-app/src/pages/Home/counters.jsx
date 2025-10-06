import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const Counters = () => {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });


    const counterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.2,
            },
        }),
    };

    return (
        <section
            ref={ref}
            className="flex flex-col lg:flex-row justify-around items-center py-8 sm:py-10 lg:py-10 bg-gray-200 w-full gap-6 lg:gap-0"
        >

            <motion.div
                className="text-center px-4 sm:px-6 lg:pr-20 lg:border-r-4 border-gray-300 mb-6 lg:mb-0 w-full lg:w-auto"
                variants={counterVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={0}
            >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {inView && <CountUp start={0} end={250} duration={1.5} />}+
                </h3>
                <p className="text-base sm:text-lg text-gray-600 lg:text-left">Courses by our best mentors</p>
            </motion.div>


            <motion.div
                className="text-center px-4 sm:px-6 lg:pr-20 lg:border-r-4 border-gray-300 mb-6 lg:mb-0 w-full lg:w-auto"
                variants={counterVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={1}
            >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {inView && <CountUp start={0} end={1000} duration={1.2} />}+
                </h3>
                <p className="text-base sm:text-lg text-gray-600">Happy Students</p>
            </motion.div>


            <motion.div
                className="text-center px-4 sm:px-6 lg:pr-20 lg:border-r-4 border-gray-300 mb-6 lg:mb-0 w-full lg:w-auto"
                variants={counterVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={2}
            >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {inView && <CountUp start={0} end={15} duration={2} />}+
                </h3>
                <p className="text-base sm:text-lg text-gray-600">Expert Mentors</p>
            </motion.div>


            <motion.div
                className="text-center px-4 sm:px-6 w-full lg:w-auto"
                variants={counterVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={3}
            >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {inView && <CountUp start={0} end={2400} duration={1.5} />}+
                </h3>
                <p className="text-base sm:text-lg text-gray-600">Successful Graduates</p>
            </motion.div>
        </section>
    );
};

export default Counters;