import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Plus, ArrowLeft, Trash2, Edit2 } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';

const AddCourseStep2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId: paramCourseId } = useParams();
    const state = location.state || {};
    const courseId = paramCourseId || state.courseId;
    const isEdit = state?.isEdit || false;

    const [contents, setContents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!courseId) {
            toast.error("No course ID provided. Please complete Step 1 first.");
            setError("No course ID provided. Please complete Step 1 first.");
            setIsLoading(false);
            return;
        }

        const loadContents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents?courseId=${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const courseContents = response.data.filter(content => content.courseId === parseInt(courseId));
                setContents(courseContents.map(content => ({
                    id: content.id,
                    name: content.name || "",
                    lectureNumber: content.lectureNumber?.toString() || "",
                    time: content.time?.toString() || ""
                })));
            } catch (err) {
                console.error("Error loading contents:", err);
                if (!isEdit) {
                    setContents([{ id: Date.now(), name: "", lectureNumber: "", time: "" }]);
                } else {
                    toast.error("Failed to load contents.");
                    setError("Failed to load contents.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (isEdit) {
            loadContents();
        } else {
            setContents([{ id: Date.now(), name: "", lectureNumber: "", time: "" }]);
            setIsLoading(false);
        }
    }, [courseId, isEdit]);
    const handleInputChange = (id, field, value) => {
        setContents(
            contents.map((content) =>
                content.id === id ? { ...content, [field]: value } : content
            )
        );
    };
    const addContent = () => {
        setContents([
            ...contents,
            { id: Date.now(), name: "", lectureNumber: "", time: "" },
        ]);
    };
    const removeContent = async (id) => {
        if (isEdit && contents.length === 1) {
            toast.error("At least one content item is required.");
            return;
        }

        if (isEdit) {
            try {
                const token = localStorage.getItem('token');
                const contentToDelete = contents.find(c => c.id === id);
                if (contentToDelete.id && !isNaN(contentToDelete.id)) {
                    await axios.delete(`https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents/${contentToDelete.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                setContents(contents.filter((content) => content.id !== id));
                toast.success("Content deleted successfully.");
            } catch (err) {
                console.error("Error deleting content:", err);
                toast.error("Failed to delete content.");
            }
        } else {
            setContents(contents.filter((content) => content.id !== id));
        }
    };
    const updateContent = async (content) => {
        if (!isEdit || !content.id || isNaN(content.id)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents/${content.id}`, {
                name: content.name,
                lectureNumber: parseInt(content.lectureNumber),
                time: parseInt(content.time),
                courseId: parseInt(courseId),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Content updated successfully.");
        } catch (err) {
            console.error("Error updating content:", err);
            toast.error("Failed to update content.");
        }
    };
    const handleSaveCourse = async () => {
        setError(null);
        setUpdating(true);
        const isValid = contents.every(
            (content) =>
                content.name.trim() &&
                content.lectureNumber.trim() &&
                !isNaN(content.lectureNumber) &&
                parseInt(content.lectureNumber) > 0 &&
                content.time.trim() &&
                !isNaN(content.time) &&
                parseInt(content.time) > 0
        );

        if (!isValid) {
            toast.error("Please fill in all fields for each content item. Lectures Number and Time must be valid numbers greater than 0.");
            setError("Please fill in all fields for each content item. Lectures Number and Time must be valid numbers greater than 0.");
            setUpdating(false);
            return;
        }

        if (!courseId) {
            toast.error("No course ID provided. Please complete Step 1 first.");
            setError("No course ID provided. Please complete Step 1 first.");
            setUpdating(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("You are not authenticated. Please log in.");
                navigate("/login");
                return;
            }

            if (isEdit) {
                await Promise.all(
                    contents.map((content) => {
                        if (isNaN(content.id)) {
                            return axios.post("https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents", {
                                name: content.name,
                                lectureNumber: parseInt(content.lectureNumber),
                                time: parseInt(content.time),
                                courseId: parseInt(courseId),
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                        } else {
                            return axios.put(`https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents/${content.id}`, {
                                name: content.name,
                                lectureNumber: parseInt(content.lectureNumber),
                                time: parseInt(content.time),
                                courseId: parseInt(courseId),
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                        }
                    })
                );
            } else {
                await Promise.all(
                    contents.map((content) =>
                        axios.post("https://mohsenkhaled-001-site1.jtempurl.com/api/CourseContents", {
                            name: content.name,
                            lectureNumber: parseInt(content.lectureNumber),
                            time: parseInt(content.time),
                            courseId: parseInt(courseId),
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    )
                );
            }

            toast.success(isEdit ? "Course updated successfully!" : "Course contents added successfully!");
            navigate("/dashboard/courses");
        } catch (err) {
            console.error("Error saving course contents:", err);
            if (err.response?.data) {
                console.error("Server error details:", err.response.data);
                toast.error(`Failed to save course contents: ${JSON.stringify(err.response.data)}`);
                setError(`Failed to save course contents: ${JSON.stringify(err.response.data)}`);
            } else {
                toast.error("Failed to save course contents. Please try again.");
                setError("Failed to save course contents. Please try again.");
            }
        } finally {
            setUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">Loading contents...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#E2E6EE] mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Courses</span>
                        <span>/</span>
                        <span>{isEdit ? "Edit Course" : "Add Course"}</span>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg md:shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:scale-105 transition-all hover:text-gray-900 self-start"
                        >
                            <ArrowLeft size={25} />
                        </button>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h2 className="text-lg font-medium text-gray-900">{isEdit ? "Edit Contents" : "Add Content"}</h2>
                            <p className="text-sm text-gray-500">Step 2 of 2</p>
                        </div>
                    </div>
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4 md:space-y-6">
                        {contents.length === 0 && isEdit ? (
                            <p className="text-gray-500 text-center py-4">No contents found for this course. Add new content below.</p>
                        ) : (
                            contents.map((content, index) => (
                                <div
                                    key={content.id}
                                    className="p-4 md:p-6 bg-gray-100 rounded-lg space-y-4 relative"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Write here"
                                            value={content.name}
                                            onChange={(e) =>
                                                handleInputChange(content.id, "name", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lectures Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Write here"
                                                value={content.lectureNumber}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        content.id,
                                                        "lectureNumber",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Time
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Write here"
                                                value={content.time}
                                                onChange={(e) =>
                                                    handleInputChange(content.id, "time", e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    {isEdit && !isNaN(content.id) && (
                                        <button
                                            onClick={() => updateContent(content)}
                                            className="text-blue-500 hover:bg-blue-100 rounded-lg p-1 mt-2 hover:scale-105 transition-all cursor-pointer absolute bottom-0 right-4"
                                        >
                                            <Edit2 size={20} className="md:w-6 md:h-6" />
                                        </button>
                                    )}
                                    {(index > 0 || !isEdit) && (
                                        <button
                                            onClick={() => removeContent(content.id)}
                                            className="text-red-500 hover:bg-red-100 rounded-lg p-1 mt-2 hover:scale-105 transition-all cursor-pointer absolute bottom-0 left-4"
                                        >
                                            <Trash2 size={20} className="md:w-6 md:h-6" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={addContent}
                        className="w-full p-3 md:p-4 hover:scale-105 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition-all cursor-pointer"
                    >
                        <Plus size={20} />
                        Add Content
                    </button>
                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                        <button
                            onClick={() => navigate("/dashboard/courses")}
                            className="px-4 py-2 md:px-6 md:py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:scale-105 transition-all hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCourse}
                            disabled={updating}
                            className={`px-4 py-2 md:px-86 md:py-2 bg-gray-900 w-full sm:w-auto text-white rounded-lg cursor-pointer hover:scale-95 transition-all hover:bg-gray-800 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {updating ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update' : 'Add')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourseStep2;