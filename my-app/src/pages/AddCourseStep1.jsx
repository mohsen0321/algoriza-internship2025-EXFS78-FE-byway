
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Bold, Italic, Underline, List, Link, Star, ImageUp, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';

const AddCourseStep1 = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const location = useLocation();
    const state = location.state || {};
    const isEdit = state?.isEdit || false;
    const initialCourse = state?.course || {};

    const [formData, setFormData] = useState({
        name: initialCourse.name || "",
        categoryId: initialCourse.categoryId?.toString() || "",
        levelId: initialCourse.levelId?.toString() || "",
        instructorId: initialCourse.instructorId?.toString() || "",
        cost: initialCourse.cost?.toString() || "",
        totalHours: initialCourse.totalHours?.toString() || "",
        description: initialCourse.description || "",
        certification: initialCourse.certification || "",
        image: null,
    });
    const [formErrors, setFormErrors] = useState({
        cost: "",
        totalHours: "",
    });
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [allInstructors, setAllInstructors] = useState([]);
    const [filteredInstructors, setFilteredInstructors] = useState([]);
    const [rating, setRating] = useState(initialCourse.rate || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [previewImage, setPreviewImage] = useState(initialCourse.imageUrl || null);
    const [error, setError] = useState(null);
    const decimalRegex = /^\d*\.?\d*$/;
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
                toast.error("Failed to fetch categories. Please try again.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
            }
        };

        const fetchLevels = async () => {
            try {
                const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Levels");
                setLevels(response.data);
            } catch (err) {
                console.error("Error fetching levels:", err);
                toast.error("Failed to fetch levels. Please try again.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await axios.get("https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors");
                setAllInstructors(response.data);
            } catch (err) {
                console.error("Error fetching instructors:", err);
                toast.error("Failed to fetch instructors. Please try again.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
            }
        };

        fetchCategories();
        fetchLevels();
        fetchInstructors();
    }, []);
    useEffect(() => {
        if (!formData.categoryId) {
            setFilteredInstructors([]);
            setFormData((prev) => ({ ...prev, instructorId: "" }));
            return;
        }
        const filtered = allInstructors.filter(
            (instructor) => instructor.categoryId === parseInt(formData.categoryId)
        );
        setFilteredInstructors(filtered);
        if (!filtered.some((instructor) => instructor.id.toString() === formData.instructorId)) {
            setFormData((prev) => ({ ...prev, instructorId: "" }));
        }
    }, [formData.categoryId, allInstructors]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = "";
        if (name === "totalHours") {
            if (value && !/^\d+$/.test(value)) {
                errorMessage = "You must enter a positive integer (e.g. 1, 10).";
            } else if (value && parseInt(value) < 1) {
                errorMessage = "Hours must be greater than or equal to 1";
            }
        } else if (name === "cost") {
            if (value && !decimalRegex.test(value)) {
                errorMessage = "Cost must be a number (e.g., 99 or 99.99).";
            }
        }

        setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "categoryId" && { instructorId: "" }),
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };
    const handleSetRating = (value) => {
        setRating(value);
    };

    const handleMouseEnter = (value) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };
    const handleSubmit = async () => {
        if (formData.totalHours) {
            const totalHours = parseInt(formData.totalHours);
            if (!Number.isInteger(totalHours) || totalHours < 1) {
                setFormErrors((prev) => ({
                    ...prev,
                    totalHours: "يجب إدخال رقم صحيح موجب (أكبر من أو يساوي 1).",
                }));
                toast.error("Please correct the errors in the form before submitting.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "colored"
                });
                return;
            }
        }
        if (
            !formData.name.trim() ||
            !formData.categoryId ||
            !formData.levelId ||
            !formData.instructorId ||
            !formData.cost.trim() ||
            !formData.totalHours.trim() ||
            !formData.description.trim() ||
            !formData.certification.trim() ||
            (!formData.image && !isEdit) ||
            rating === 0
        ) {
            toast.error("Please fill in all required fields, including uploading an image and selecting a rating.", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored"
            });
            return;
        }
        if (formErrors.cost || formErrors.totalHours) {
            toast.error("Please correct the errors in the form before submitting.", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "colored"
            });
            return;
        }

        try {
            if (isEdit) {
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
                const hasPayments = response.data.some(payment => payment.courseId === parseInt(courseId));
                if (hasPayments) {
                    toast.error("This course cannot be updated because it has been purchased.", {
                        position: "bottom-right",
                        autoClose: 5000,
                        theme: "colored"
                    });
                    return;
                }
            }

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

            const data = new FormData();
            data.append("Name", formData.name);
            data.append("CategoryId", formData.categoryId);
            data.append("LevelId", formData.levelId);
            data.append("InstructorId", formData.instructorId);
            data.append("Cost", formData.cost);
            data.append("TotalHours", parseInt(formData.totalHours));
            data.append("Rate", rating);
            data.append("Description", formData.description);
            data.append("Certification", formData.certification);
            if (formData.image) {
                data.append("Image", formData.image);
            }

            let response;
            let currentCourseId = courseId;
            if (isEdit) {
                console.log(`Sending PUT request to: https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${courseId}`);
                response = await axios.put(`https://mohsenkhaled-001-site1.jtempurl.com/api/Courses/${courseId}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                });
                currentCourseId = courseId;
            } else {
                console.log("Sending POST request to: https://mohsenkhaled-001-site1.jtempurl.com/api/Courses");
                response = await axios.post("https://mohsenkhaled-001-site1.jtempurl.com/api/Courses", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                });
                currentCourseId = response.data.id;
            }
            const step2Path = isEdit ? `/dashboard/edit-course/step2/${currentCourseId}` : `/dashboard/add-course/step2`;
            navigate(step2Path, {
                state: {
                    courseId: currentCourseId,
                    isEdit,
                    course: { ...initialCourse, ...formData, rate: rating }
                }
            });
        } catch (err) {
            console.error("Error saving course:", err);
            let errorMessage = "Failed to save course. Please try again.";
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
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
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b-2 border-[#E2E6EE] mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{isEdit ? "Edit Course" : "Add Course"}</h1>
                        <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                            <span>Dashboard</span>
                            <span>/</span>
                            <span>Courses</span>
                            <span>/</span>
                            <span>{isEdit ? "Edit Course" : "Add Course"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{isEdit ? "Edit Course" : "Add Course"}</h1>
                        <span className="text-xs md:text-sm font-semibold text-gray-500">Step 1 of 2</span>
                    </div>
                </div>

                <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4 md:mb-6 mt-4 md:mt-6">Course details</h2>
                {error && (
                    <div className="p-3 md:p-4 bg-red-100 text-red-700 rounded-lg mb-4 md:mb-6 text-sm md:text-base">
                        {error}
                    </div>
                )}

                <div className="max-w-4xl space-y-4 md:space-y-6">
                    <div className="w-full border border-gray-300 rounded-lg p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="w-full md:w-[350px] h-[180px] md:h-[215px] border-2 border-gray-300 rounded-lg flex gap-2 items-center justify-center bg-gray-100 relative">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Course Preview"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            ) : (
                                <>
                                    <ImageUp className="text-gray-400 mb-2" size={24} md:size={32} />
                                    <p className="text-gray-600 text-xs md:text-sm">Upload Image</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="image-upload"
                            />
                        </div>
                        <div className="flex-1 text-xs md:text-sm text-gray-600 w-full md:w-auto">
                            <p className="mb-1 md:mb-2">Size: 700x430 pixels</p>
                            <p className="mb-1 md:mb-2">File Support: .jpg, .jpeg, .png, or .gif</p>
                            <label
                                htmlFor="image-upload"
                                className="mt-2 md:mt-3 px-3 md:px-4 py-1 md:py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-xs md:text-sm cursor-pointer inline-block"
                            >
                                Upload Image
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Write here"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm md:text-base"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <div className="relative">
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-sm md:text-base"
                                >
                                    <option value="">Choose</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute top-1/2 right-2 text-gray-400 transform -translate-y-1/2 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                            <div className="relative">
                                <select
                                    name="levelId"
                                    value={formData.levelId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-sm md:text-base"
                                >
                                    <option value="">Choose</option>
                                    {levels.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            {level.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute top-1/2 right-2 text-gray-400 transform -translate-y-1/2 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                            <div className="relative">
                                <select
                                    name="instructorId"
                                    value={formData.instructorId}
                                    onChange={handleInputChange}
                                    disabled={!formData.categoryId}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    <option value="">
                                        {formData.categoryId ? "Choose" : "Select a category first"}
                                    </option>
                                    {filteredInstructors.map((instructor) => (
                                        <option key={instructor.id} value={instructor.id}>
                                            {instructor.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute top-1/2 right-2 text-gray-400 transform -translate-y-1/2 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                            <input
                                type="text"
                                name="cost"
                                value={formData.cost}
                                onChange={handleInputChange}
                                placeholder="Write here"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm md:text-base ${formErrors.cost ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {formErrors.cost && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">{formErrors.cost}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Hours</label>
                            <input
                                type="text"
                                name="totalHours"
                                value={formData.totalHours}
                                onChange={handleInputChange}
                                placeholder="Write here"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm md:text-base ${formErrors.totalHours ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {formErrors.totalHours && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">{formErrors.totalHours}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                            <div className="flex items-center gap-1 p-2 md:p-3 border border-gray-300 rounded-lg" onMouseLeave={handleMouseLeave}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleSetRating(star)}
                                        onMouseEnter={() => handleMouseEnter(star)}
                                        className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    >
                                        <Star size={14} md:size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <div className="border border-gray-300 rounded-lg">
                                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 border-b border-gray-300 bg-gray-50">
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Bold size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Italic size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Underline size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <List size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Link size={12} md:size={14} />
                                    </button>
                                </div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Write here"
                                    rows="4"
                                    className="w-full px-3 py-2 focus:outline-none resize-none text-sm md:text-base"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                            <div className="border border-gray-300 rounded-lg">
                                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 border-b border-gray-300 bg-gray-50">
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Bold size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Italic size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Underline size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <List size={12} md:size={14} />
                                    </button>
                                    <button className="p-1 rounded transition-colors hover:bg-gray-200">
                                        <Link size={12} md:size={14} />
                                    </button>
                                </div>
                                <textarea
                                    name="certification"
                                    value={formData.certification}
                                    onChange={handleInputChange}
                                    placeholder="Write here"
                                    rows="4"
                                    className="w-full px-3 py-2 focus:outline-none resize-none text-sm md:text-base"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-4">
                        <button
                            onClick={() => navigate("/dashboard/courses")}
                            className="px-4 md:px-6 py-2 bg-red-100 text-red-500 font-semibold rounded-lg cursor-pointer hover:scale-105 transition-all hover:bg-red-200 text-sm md:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 md:px-92 py-2 bg-gray-900 w-full md:w-auto text-white rounded-lg cursor-pointer hover:scale-95 transition-all hover:bg-gray-800 text-sm md:text-base"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourseStep1;