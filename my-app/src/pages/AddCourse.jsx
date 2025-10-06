import React, { useState } from "react";

const AddCourse = () => {
    const [step, setStep] = useState(1);
    const [courseData, setCourseData] = useState({
        name: "",
        category: "",
        level: "",
        hours: "",
        instructor: "",
        price: "",
        description: "",
        certificate: false,
        image: null,
        modules: [],
    });

    const [newModule, setNewModule] = useState("");
    const [newLesson, setNewLesson] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setCourseData({ ...courseData, [name]: checked });
        } else if (type === "file") {
            setCourseData({ ...courseData, image: files[0] });
        } else {
            setCourseData({ ...courseData, [name]: value });
        }
    };

    const validateStep1 = () => {
        if (!courseData.name || !courseData.category || !courseData.level || !courseData.hours || !courseData.instructor || !courseData.price) {
            alert("Please fill all required fields before continuing.");
            return false;
        }
        return true;
    };

    const handleAddModule = () => {
        if (!newModule) return;
        setCourseData({
            ...courseData,
            modules: [...courseData.modules, { title: newModule, lessons: [] }],
        });
        setNewModule("");
    };

    const handleAddLesson = (index) => {
        if (!newLesson) return;
        const updatedModules = [...courseData.modules];
        updatedModules[index].lessons.push(newLesson);
        setCourseData({ ...courseData, modules: updatedModules });
        setNewLesson("");
    };

    const handleSubmit = () => {
        console.log("Final Course Data:", courseData);
        alert("Course added successfully!");
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>

            {step === 1 && (
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Course Image</label>
                        <input type="file" accept="image/*" onChange={handleChange} />
                        {courseData.image && (
                            <img
                                src={URL.createObjectURL(courseData.image)}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-cover rounded-md"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Course Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={courseData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Category *</label>
                        <input
                            type="text"
                            name="category"
                            value={courseData.category}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Level *</label>
                        <select
                            name="level"
                            value={courseData.level}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Select level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Hours *</label>
                        <input
                            type="number"
                            name="hours"
                            value={courseData.hours}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Instructor *</label>
                        <input
                            type="text"
                            name="instructor"
                            value={courseData.instructor}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={courseData.price}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            name="description"
                            value={courseData.description}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="certificate"
                            checked={courseData.certificate}
                            onChange={handleChange}
                        />
                        <label>Certificate Available</label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                if (validateStep1()) setStep(2);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Course Content</h3>

                    <div>
                        <label className="block font-medium">Add Module</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newModule}
                                onChange={(e) => setNewModule(e.target.value)}
                                className="flex-1 border px-3 py-2 rounded"
                            />
                            <button
                                onClick={handleAddModule}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {courseData.modules.map((module, index) => (
                        <div key={index} className="border rounded p-3">
                            <h4 className="font-medium">{module.title}</h4>

                            <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    value={newLesson}
                                    onChange={(e) => setNewLesson(e.target.value)}
                                    className="flex-1 border px-3 py-2 rounded"
                                    placeholder="Add lesson"
                                />
                                <button
                                    onClick={() => handleAddLesson(index)}
                                    className="bg-blue-600 text-white px-3 py-2 rounded"
                                >
                                    Add Lesson
                                </button>
                            </div>

                            <ul className="list-disc ml-5 mt-2 text-gray-700">
                                {module.lessons.map((lesson, i) => (
                                    <li key={i}>{lesson}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(1)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Add Course
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCourse;