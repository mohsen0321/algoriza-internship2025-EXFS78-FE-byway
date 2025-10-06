import React, { useState, useEffect, useContext } from 'react';
import {
    Star, ChevronRight
} from 'lucide-react';
import {
    FaFacebookF, FaGithub, FaXTwitter
} from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { BsMicrosoft } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import reviewsimaged from '../images/reviewsimages.png';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { setCartCount } = useContext(CartContext);
    const [course, setCourse] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [level, setLevel] = useState(null);
    const [category, setCategory] = useState(null);
    const [contents, setContents] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [instructorImageUrl, setInstructorImageUrl] = useState(null);
    const [categoryImageUrl, setCategoryImageUrl] = useState(null);
    const [instructorCoursesCount, setInstructorCoursesCount] = useState(0);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [totalLectures, setTotalLectures] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${id}`);
                const courseData = courseRes.data;
                setCourse(courseData);

                try {
                    const imageRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${id}/image`, { responseType: 'blob' });
                    setImageUrl(URL.createObjectURL(imageRes.data));
                } catch {
                    setImageUrl('https://picsum.photos/400/225?random=course');
                }

                const instrRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${courseData.instructorId}`);
                setInstructor(instrRes.data);

                try {
                    const instrImageRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${courseData.instructorId}/image`, { responseType: 'blob' });
                    setInstructorImageUrl(URL.createObjectURL(instrImageRes.data));
                } catch {
                    setInstructorImageUrl('https://i.pravatar.cc/80?img=3');
                }

                const allCoursesRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Courses`);
                const instructorCourses = allCoursesRes.data.filter(c => c.instructorId === courseData.instructorId);
                setInstructorCoursesCount(instructorCourses.length);

                const levelRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Levels/${courseData.levelId}`);
                setLevel(levelRes.data);

                const catRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Categories/${courseData.categoryId}`);
                setCategory(catRes.data);

                try {
                    const catImageRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Categories/${courseData.categoryId}/image`, { responseType: 'blob' });
                    setCategoryImageUrl(URL.createObjectURL(catImageRes.data));
                } catch {
                    setCategoryImageUrl(null);
                }

                const contentsRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents?courseId=${id}`);
                const filteredContents = contentsRes.data
                    .filter((content) => content.courseId === parseInt(id))
                    .map((content) => ({
                        id: content.id,
                        name: content.name || "",
                        lectureNumber: content.lectureNumber || "",
                        time: content.time || "",
                    }));
                setContents(filteredContents);
                const totalLecs = filteredContents.reduce((sum, c) => sum + (parseInt(c.lectureNumber) || 0), 0);
                setTotalLectures(totalLecs);

                const allInstructorsRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors`);
                const instructorsMap = allInstructorsRes.data.reduce((map, instr) => {
                    map[instr.id] = instr.name;
                    return map;
                }, {});

                const allLevelsRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Levels`);
                const levelsMap = allLevelsRes.data.reduce((map, lvl) => {
                    map[lvl.id] = lvl.title;
                    return map;
                }, {});

                const allContentsRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents`);
                const lecturesSum = allContentsRes.data.reduce((map, cont) => {
                    if (!map[cont.courseId]) map[cont.courseId] = 0;
                    map[cont.courseId] += parseInt(cont.lectureNumber) || 0;
                    return map;
                }, {});

                const related = allCoursesRes.data
                    .filter(c => c.categoryId === courseData.categoryId && c.id !== courseData.id)
                    .sort((a, b) => b.rate - a.rate)
                    .slice(0, 4);

                const relatedWithData = await Promise.all(related.map(async (c) => {
                    let imgUrl;
                    try {
                        const imgRes = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${c.id}/image`, { responseType: 'blob' });
                        imgUrl = URL.createObjectURL(imgRes.data);
                    } catch {
                        imgUrl = `https://picsum.photos/280/160?random=${c.id}`;
                    }
                    return {
                        id: c.id,
                        title: c.name,
                        instructor: instructorsMap[c.instructorId] || 'Unknown',
                        price: `$${c.cost.toFixed(2)}`,
                        rating: c.rate,
                        reviews: Math.floor(Math.random() * 1500) + 500,
                        hours: c.totalHours,
                        lectures: lecturesSum[c.id] || 0,
                        level: levelsMap[c.levelId] || 'Unknown',
                        image: imgUrl
                    };
                }));

                setRelatedCourses(relatedWithData);

                if (user) {
                    try {
                        const cartRes = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart', {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                        const cartItems = cartRes.data;
                        const isCourseInCart = cartItems.some(item => item.courseId === parseInt(id));
                        setIsInCart(isCourseInCart);
                    } catch { }
                }
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id, user]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await axios.post('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart/add', { courseId: parseInt(id) }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const cartRes = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const cartItems = cartRes.data;
            setIsInCart(cartItems.some(item => item.courseId === parseInt(id)));
            setCartCount(cartItems.length);
            toast.success('Course added to cart successfully!');
        } catch {
            toast.error('the course already added to cart');
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            navigate('/login');
            toast.error('Please log in to proceed to checkout.');
            return;
        }
        try {
            await axios.post('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart/add', { courseId: parseInt(id) }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const cartRes = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Cart', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const cartItems = cartRes.data;
            setIsInCart(cartItems.some(item => item.courseId === parseInt(id)));
            setCartCount(cartItems.length);
            toast.success('Course added to cart successfully!');
            navigate('/cart');
        } catch {
            toast.error('the course already added to cart');
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderStars = (rating, size = 14) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={size}
                className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}
            />
        ));
    };

    const reviews = [
        {
            name: 'Mark Doe',
            date: '22nd March, 2024',
            rating: 5,
            comment: "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding."
        },
    ];

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading course details...</div>;
    }

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Course not found.</div>;
    }

    return (
        <div className="min-h-screen mt-16 bg-white">
            <div className="max-w-8xl sm:ml-6 mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>Home</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span>Courses</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-blue-500 truncate max-w-xs sm:max-w-sm md:max-w-md">{course.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4 truncate">{course.name}</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">{course.description || 'This course is meticulously crafted to provide you with a foundational understanding of the principles, methodologies, and tools that drive exceptional user experiences in the digital landscape.'}</p>

                        <div className="flex flex-wrap items-center gap-6 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">{course.rate.toFixed(1)}</span>
                                <div className="flex">{renderStars(course.rate)}</div>
                            </div>
                            <span className="text-gray-500">{course.totalHours} Total Hours. {totalLectures} Lectures. {level?.title || 'All levels'}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                            <img
                                src={instructorImageUrl || "https://i.pravatar.cc/32?img=3"}
                                alt={instructor?.name || 'Instructor'}
                                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600">
                                Created by <span className="text-blue-500 cursor-pointer hover:underline">{instructor?.name || 'Unknown'}</span>
                            </span>
                        </div>

                        <div className="mb-8 inline-flex items-center gap-4 px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm">
                            {categoryImageUrl ? (
                                <img src={categoryImageUrl} alt={category?.title} className="w-10 h-10 object-cover rounded" />
                            ) : (
                                <span>notfound</span>
                            )}
                            <span>{category?.title || 'UI/UX Design'}</span>
                        </div>
                        <div className="border-b mb-8">
                            <div className="flex flex-wrap gap-4">
                                {['description', 'instructor', 'content', 'reviews'].map((section) => (
                                    <button
                                        key={section}
                                        onClick={() => scrollToSection(section)}
                                        className="pb-3 text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 transition-all"
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <section id="description" className="mb-12 px-2 sm:px-0">
                            <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">{course.description || 'This interactive e-learning course will introduce you to User Experience (UX) design, ...'}</p>

                            <h3 className="text-2xl font-bold mb-4">Certification</h3>
                            <p className="text-gray-600 leading-relaxed">{course.certification || 'At Byway, we understand the significance ...'}</p>
                        </section>
                        <section id="instructor" className="mb-12 px-2 sm:px-0">
                            <h2 className="text-2xl font-bold mb-6">Instructor</h2>
                            <h3 className="text-lg font-semibold text-blue-500 mb-1">{instructor?.name || 'Ronald Richards'}</h3>
                            <p className="text-gray-600 text-sm mb-4">{category?.title || 'UI/UX Designer'}</p>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <img
                                    src={instructorImageUrl || "https://i.pravatar.cc/80?img=3"}
                                    alt={instructor?.name || 'Instructor'}
                                    className="w-20 h-20 rounded-full"
                                />
                                <div className="flex flex-col justify-center gap-2 text-sm">
                                    <span className="text-gray-600 flex items-center gap-2">⭐ 40,445 Reviews</span>
                                    <span className="text-gray-600 flex items-center gap-2">👥 500 Students</span>
                                    <span className="text-gray-600 flex items-center gap-2">▶️ {instructorCoursesCount} Courses</span>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed">{instructor?.description || 'With over a decade of industry experience, Ronald brings...'}</p>
                        </section>
                        <section id="content" className="mb-12 px-2 sm:px-0">
                            <h2 className="text-2xl font-bold mb-6">Content</h2>
                            <div className="space-y-3">
                                {contents.length > 0 ? (
                                    contents.map((content, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <h4 className="font-semibold text-gray-800">{content.name || 'Untitled Content'}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {content.lectureNumber || 'N/A'} Lectures • {content.time || 'N/A'} hours
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <p className="text-gray-600">No content available yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        <section id="reviews" className="mb-12 px-2 sm:px-0">
                            <h2 className="text-2xl font-bold mb-6">Learner Reviews</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-5xl font-bold">{course.rate.toFixed(1)}</span>
                                        <span className="text-gray-500 text-sm">146,951 reviews</span>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        {[{ stars: 5, percentage: 80 }, { stars: 4, percentage: 10 }, { stars: 3, percentage: 5 }, { stars: 2, percentage: 3 }, { stars: 1, percentage: 2 }].map((item) => (
                                            <div key={item.stars} className="flex items-center gap-2">
                                                <div className="flex">{renderStars(item.stars, 12)}</div>
                                                <span className="text-sm text-gray-600">{item.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {Array(3).fill(reviews[0]).map((review, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex gap-3">
                                                <img src={reviewsimaged} alt={review.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center mb-1 space-x-2">
                                                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8.93039 13.2025L12.7104 15.6025C13.1979 15.91 13.7979 15.4525 13.6554 14.89L12.5604 10.585C12.5308 10.4657 12.5355 10.3404 12.574 10.2237C12.6124 10.1069 12.6831 10.0034 12.7779 9.92502L16.1679 7.09752C16.6104 6.73002 16.3854 5.98752 15.8079 5.95002L11.3829 5.66502C11.2622 5.65799 11.1461 5.61595 11.0488 5.54403C10.9516 5.4721 10.8774 5.37341 10.8354 5.26002L9.18539 1.10502C9.14171 0.984946 9.06214 0.881221 8.95749 0.807925C8.85283 0.734629 8.72816 0.695313 8.60039 0.695312C8.47262 0.695312 8.34794 0.734629 8.24329 0.807925C8.13863 0.881221 8.05906 0.984946 8.01539 1.10502L6.36539 5.26002C6.32333 5.37341 6.24916 5.4721 6.15193 5.54403C6.0547 5.61595 5.93862 5.65799 5.81789 5.66502L1.39289 5.95002C0.815387 5.98752 0.590387 6.73002 1.03289 7.09752L4.42289 9.92502C4.51764 10.0034 4.58833 10.1069 4.62681 10.2237C4.66529 10.3404 4.67 10.4657 4.64039 10.585L3.62789 14.575C3.45539 15.25 4.17539 15.7975 4.75289 15.43L8.27039 13.2025C8.36903 13.1398 8.4835 13.1065 8.60039 13.1065C8.71728 13.1065 8.83175 13.1398 8.93039 13.2025Z" fill="#FACC15" />
                                                                </svg>
                                                                <span>{review.rating}</span>
                                                                <span className="text-xs ml-4 text-gray-500">Reviewed on {review.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="mt-6 w-full py-3 border hover:scale-105 cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                                View More Reviews
                            </button>
                        </section>
                        <section className="mt-12 px-2 sm:px-0">
                            <h2 className="text-2xl font-bold mb-6">More Courses Like This</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {relatedCourses.map((course, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        <div className="aspect-video bg-gray-300 relative">
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{course.title}</h3>
                                            <p className="text-xs text-gray-600 mb-2">By {course.instructor}</p>
                                            <div className="flex items-center gap-1 mb-1">
                                                <div className="flex">{renderStars(course.rating, 12)}</div>
                                                <span className="text-xs text-gray-600">({course.reviews.toLocaleString()})</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">
                                                {course.hours} Total Hours. {course.lectures} Lectures. {course.level}
                                            </p>
                                            <p className="font-bold text-base">{course.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                    <div className="lg:col-span-1 self-start px-2 sm:px-0 mt-10 lg:mt-0">
                        <div className="sticky top-20 w-full max-w-sm z-10 mx-auto lg:mx-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="aspect-video bg-gray-200 relative">
                                <img
                                    src={imageUrl}
                                    alt="Course preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold mb-6">${course.cost.toFixed(2)}</div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isInCart}
                                    className={`w-full py-3 rounded-lg font-medium transition-all mb-3 ${isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer hover:scale-105'
                                        }`}
                                >
                                    {isInCart ? 'In Cart' : 'Add To Cart'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all cursor-pointer hover:scale-105"
                                >
                                    Buy Now
                                </button>
                                <div className="border-t border-gray-200 my-6"></div>
                                <div>
                                    <p className="text-lg text-black mb-3 text-left font-bold">Share</p>
                                    <div className="flex flex-wrap justify-start gap-4">
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                            <FaFacebookF className="text-white text-sm" />
                                        </a>
                                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                            <FaGithub className="text-gray-800 text-sm" size={30} />
                                        </a>
                                        <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                            <FcGoogle className="text-white text-sm" size={30} />
                                        </a>
                                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                            <FaXTwitter className="text-white text-sm" />
                                        </a>
                                        <a href="https://www.microsoft.com/ar-eg" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-105">
                                            <BsMicrosoft className="text-white text-sm" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
