import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

const TopCategories = () => {
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

    useEffect(() => {
        let mounted = true;
        const fetchAll = async () => {
            try {
                const [catRes, courseRes] = await Promise.all([
                    axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Categories"),
                    axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Courses"),
                ]);
                if (!mounted) return;
                setCategories(Array.isArray(catRes.data) ? catRes.data : []);
                setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
            } catch (err) {
                console.error("fetch error:", err);
                setError(err.message || "حدث خطأ أثناء جلب البيانات");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchAll();
        return () => {
            mounted = false;
        };
    }, []);

    const countsByCategory = useMemo(() => {
        const map = {};
        for (const c of courses) {
            const id =
                c.CategoryId ??
                c.categoryId ??
                c.CategoryID ??
                c.categoryID ??
                (c.Category && (c.Category.Id ?? c.Category.id));
            if (id == null) continue;
            const key = String(id);
            map[key] = (map[key] || 0) + 1;
        }
        return map;
    }, [courses]);

    const getCategoryId = (cat) =>
        cat.Id ?? cat.id ?? cat.ID ?? cat.categoryId ?? cat.CategoryId ?? null;

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

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (error)
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-16 mt-6">
                have an error : {error}
            </div>
        );
    if (!categories.length)
        return <div className="p-6 text-center">There are no categories to display.</div>;

    return (
        <section ref={ref} className="py-12 bg-[#f7f7f7]">
            <div className="container mx-auto px-4  sm:ml-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Top Categories</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {categories.map((category, idx) => {
                            const catId = getCategoryId(category);
                            const count = countsByCategory[String(catId)] ?? 0;
                            const title =
                                category.Title ??
                                category.title ??
                                category.Name ??
                                category.name ??
                                "Unknown";

                            return (
                                <motion.div
                                    key={catId ?? idx}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                    custom={idx}
                                    className="text-center p-4 border sm:w-86 border-gray-300 rounded-lg shadow-lg hover:shadow-md transform transition-all duration-300 hover:-translate-y-3"
                                >
                                    <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                                        <img
                                            src={`https://mohsenkhaled-001-site1.jtempurl.com/api/Categories/${catId}/image`}
                                            alt={title}
                                            className="w-full h-full object-cover rounded-full"
                                            onError={(e) => {
                                                e.target.src = "/path/to/fallback-image.png";
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700">{title}</h3>
                                    <p className="text-sm font-semibold text-gray-500">
                                        {count} Courses
                                    </p>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default TopCategories;