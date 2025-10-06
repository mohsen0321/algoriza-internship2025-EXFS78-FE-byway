import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Edit, Trash2, Star, Plus, X, ChevronDown, Menu } from 'lucide-react';
import { toast } from 'react-toastify';

const validateForm = (formData, rating, hasImage) => {
    const errors = {};
    if (!formData.name) errors.name = 'Instructor name is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!hasImage) errors.image = 'Image is required';
    if (rating === 0) errors.rating = 'Rating is required';
    return errors;
};

const ImageUpload = ({ previewImage, formData, handleImageChange, errors }) => (
    <div className="flex items-center mb-8">
        <div className="relative mr-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                    <span className="text-gray-600 text-sm font-medium">
                        {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : '+'}
                    </span>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute bottom-0 right-0 w-8 h-8 opacity-0 cursor-pointer"
                id="image-upload"
            />
            <label
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
                <Plus size={16} className="text-white" />
            </label>
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
        </div>
    </div>
);

const StarRating = ({ rating, hoverRating, setRating, setHoverRating, errors }) => (
    <div>
        <label className="block mb-2 text-base font-medium text-gray-900">Rating</label>
        <div className="flex gap-1 mt-2" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className={`w-6 h-6 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                >
                    <Star size={20} />
                </button>
            ))}
        </div>
        {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
    </div>
);
const InstructorForm = ({ onClose, onSubmit, categories, initialData = {}, isUpdate = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        categoryId: initialData.categoryId || '',
        description: initialData.description || '',
        image: null,
    });
    const [previewImage, setPreviewImage] = useState(initialData.imageUrl || null);
    const [rating, setRating] = useState(initialData.rate || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isUpdate) {
            setFormData({
                name: initialData.name || '',
                categoryId: initialData.categoryId || '',
                description: initialData.description || '',
                image: null,
            });
            setRating(initialData.rate || 0);
            setPreviewImage(initialData.imageUrl || null);
        }
    }, [initialData, isUpdate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: '' }));
        setPreviewImage(file ? URL.createObjectURL(file) : isUpdate ? initialData.imageUrl : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData, rating, previewImage || formData.image);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = new FormData();
        data.append('Name', formData.name);
        data.append('CategoryId', formData.categoryId);
        data.append('Rate', rating);
        data.append('Description', formData.description);
        if (formData.image) data.append('Image', formData.image);

        try {
            const response = await axios({
                method: isUpdate ? 'put' : 'post',
                url: `https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors${isUpdate ? `/${initialData.id}` : ''}`,
                data,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSubmit({
                ...response.data,
                categoryTitle: categories.find((c) => c.id === parseInt(formData.categoryId))?.title,
            });
            toast.success(`Instructor ${isUpdate ? 'updated' : 'added'} successfully!`);
            onClose();
        } catch (err) {
            console.error(`Error ${isUpdate ? 'updating' : 'adding'} instructor:`, err);
            setErrors({ general: `Failed to ${isUpdate ? 'update' : 'add'} instructor. Please try again.` });
            toast.error(`Failed to ${isUpdate ? 'update' : 'add'} instructor.`);
        }
    };

    const handleCancel = () => {
        setPreviewImage(null);
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-4 md:p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{isUpdate ? 'Update Instructor' : 'Add Instructor'}</h2>
                    <button
                        onClick={handleCancel}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

                <ImageUpload
                    previewImage={previewImage}
                    formData={formData}
                    handleImageChange={handleImageChange}
                    errors={errors}
                />

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 text-base font-medium text-gray-900">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 text-base font-medium text-gray-900">Job Title</label>
                            <div className="relative">
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Select</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute top-1/2 right-2 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
                        </div>

                        <StarRating
                            rating={rating}
                            hoverRating={hoverRating}
                            setRating={setRating}
                            setHoverRating={setHoverRating}
                            errors={errors}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-base font-medium text-gray-900">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter description"
                            className="w-full min-h-[120px] p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                            required
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
                        >
                            {isUpdate ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const ViewInstructor = ({ onClose, selectedInstructor }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Instructor Details</h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-400" />
                </button>
            </div>

            <div className="flex items-center mb-6 md:mb-8">
                <div className="relative mr-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        {selectedInstructor?.imageUrl ? (
                            <img
                                src={selectedInstructor.imageUrl}
                                alt="Instructor"
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${selectedInstructor.id}/image`;
                                }}
                            />
                        ) : (
                            <span className="text-gray-600 text-sm font-medium">
                                {selectedInstructor.name ? selectedInstructor.name.split(' ').map(n => n[0]).join('') : '+'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-gray-900">Name</label>
                <p className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700">{selectedInstructor.name}</p>
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-gray-900">Job Title</label>
                <p className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700">{selectedInstructor.categoryTitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block mb-2 text-base font-medium text-gray-900">Rating</label>
                    <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={20}
                                className={`${star <= selectedInstructor.rate ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-gray-900">Description</label>
                <p className="w-full min-h-[120px] p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700">{selectedInstructor.description || 'No description'}</p>
            </div>
        </div>
    </div>
);
const DeleteModal = ({ onClose, onDelete, selectedInstructor }) => (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-4">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Are you sure you want to delete this?</h3>
                <p className="text-gray-400 mb-6">Instructor <span className='font-bold text-black'>{selectedInstructor?.name}</span>?</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border cursor-pointer hover:scale-105 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 px-4 py-2 cursor-pointer hover:scale-105 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);
const InstructorCard = ({ instructor, setModal }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {instructor.imageUrl ? (
                        <img
                            src={instructor.imageUrl}
                            alt="Instructor"
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${instructor.id}/image`;
                            }}
                        />
                    ) : (
                        <span className="text-gray-600 text-sm font-medium">
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="font-medium text-gray-800">{instructor.name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {instructor.categoryTitle}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={`${star <= instructor.rate ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        </div>
        <div className="flex items-center justify-end gap-2">
            <button
                onClick={() => setModal({ type: 'view', instructor })}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <Eye size={16} />
            </button>
            <button
                onClick={() => setModal({ type: 'update', instructor })}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
                <Edit size={16} />
            </button>
            <button
                onClick={() => setModal({ type: 'delete', instructor })}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
);
const Instructors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ type: null, instructor: null });
    const [instructors, setInstructors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const instructorsPerPage = 5;

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors');
                setInstructors(
                    response.data.map((instructor) => ({
                        ...instructor,
                        imageUrl: `https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${instructor.id}/image`,
                        categoryTitle: categories.find((c) => c.id === instructor.categoryId)?.title || instructor.categoryTitle,
                    }))
                );
            } catch (err) {
                console.error('Error fetching instructors:', err);
                setError('Failed to fetch instructors.');
                toast.error('Failed to fetch instructors.');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to fetch categories.');
                toast.error('Failed to fetch categories.');
            }
        };

        fetchCategories();
        fetchInstructors();
    }, [categories]);

    const handleAddInstructor = (newInstructor) => {
        setInstructors((prev) => [...prev, newInstructor]);
        setCurrentPage(1);
        setModal({ type: null, instructor: null });
    };

    const handleUpdateInstructor = (updatedInstructor) => {
        setInstructors((prev) =>
            prev.map((instructor) => (instructor.id === updatedInstructor.id ? updatedInstructor : instructor))
        );
        setModal({ type: null, instructor: null });
    };

    const handleDeleteInstructor = async () => {
        try {
            const allCoursesResponse = await axios.get('https://mohsenkhaled-001-site1.jtempurl.com/api/Courses');
            const associatedCourses = allCoursesResponse.data.filter(course => course.instructorId === modal.instructor.id);

            if (associatedCourses.length > 0) {
                setError('Cannot delete instructor because they are associated with one or more courses.');
                toast.error('Cannot delete instructor because they are associated with one or more courses.');
                setModal({ type: null, instructor: null });
                return;
            }
            await axios.delete(`https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${modal.instructor.id}`);
            setInstructors((prev) => prev.filter((instructor) => instructor.id !== modal.instructor.id));
            const filteredInstructors = instructors.filter(
                (instructor) =>
                    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    instructor.categoryTitle?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            } else if (totalPages === 0) {
                setCurrentPage(1);
            }
            setModal({ type: null, instructor: null });
            toast.success(`Instructor ${modal.instructor.name} deleted successfully!`);
        } catch (err) {
            console.error('Error deleting instructor:', err);
            setError('Failed to delete instructor.');
            toast.error('Failed to delete instructor.');
        }
    };

    const filteredInstructors = instructors
        .filter(
            (instructor) =>
                instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                instructor.categoryTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.rate - a.rate);

    const totalPages = Math.max(1, Math.ceil(filteredInstructors.length / instructorsPerPage));
    const indexOfLastInstructor = currentPage * instructorsPerPage;
    const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
    const currentInstructors = filteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-2 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Instructors</span>
                    </div>

                    <button className="relative">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13.8477 20.0088C13.4505 20.6062 12.7712 21 11.9999 21C11.2287 21 10.5494 20.6062 10.1521 20.0088M12.0007 4C14.8579 4.00026 17.1737 6.31685 17.1737 9.17413V10.4463C17.1737 11.6934 18.0376 12.7962 18.4744 13.9643C18.5894 14.2719 18.6523 14.6049 18.6523 14.9526C18.6522 16.3148 17.6786 17.4836 16.3292 17.6708C14.9891 17.8566 13.3139 18.0438 11.9996 18.0438C10.6853 18.0437 9.011 17.8566 7.671 17.6708C6.32159 17.4837 5.34809 16.3148 5.3479 14.9526C5.3479 14.605 5.41075 14.272 5.52571 13.9645C5.96242 12.7962 6.82654 11.6933 6.82654 10.446V9.17413C6.82654 6.31669 9.14323 4 12.0007 4Z"
                                stroke="#96A0B6"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="18.5" cy="7" r="4" fill="#E45F5F" stroke="white" />
                        </svg>
                    </button>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Instructors</h1>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">Instructors ({filteredInstructors.length})</h2>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setModal({ type: 'add', instructor: null })}
                            className="bg-gray-900 cursor-pointer hover:scale-105 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all font-medium order-2 md:order-1"
                        >
                            Add Instructor
                        </button>
                        <div className="relative order-1 md:order-2">
                            <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search "
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors order-3 hidden md:block">
                            <Filter size={20} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>


            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F1F5FF] border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 font-medium text-gray-700">Name</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-700">Job Title</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-700">Rating</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentInstructors.length > 0 ? (
                                currentInstructors.map((instructor) => (
                                    <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {instructor.imageUrl ? (
                                                        <img
                                                            src={instructor.imageUrl}
                                                            alt="Instructor"
                                                            className="w-10 h-10 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = `https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors/${instructor.id}/image`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600 text-sm font-medium">
                                                            {instructor.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-800">{instructor.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                                {instructor.categoryTitle}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={`${star <= instructor.rate ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setModal({ type: 'view', instructor })}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setModal({ type: 'update', instructor })}
                                                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setModal({ type: 'delete', instructor })}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No Instructors Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="md:hidden">
                {currentInstructors.length > 0 ? (
                    currentInstructors.map((instructor) => (
                        <InstructorCard
                            key={instructor.id}
                            instructor={instructor}
                            setModal={setModal}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
                        No Instructors Found
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                    Next
                </button>
            </div>

            {modal.type === 'add' && (
                <InstructorForm
                    onClose={() => setModal({ type: null, instructor: null })}
                    onSubmit={handleAddInstructor}
                    categories={categories}
                />
            )}
            {modal.type === 'update' && (
                <InstructorForm
                    onClose={() => setModal({ type: null, instructor: null })}
                    onSubmit={handleUpdateInstructor}
                    categories={categories}
                    initialData={modal.instructor}
                    isUpdate
                />
            )}
            {modal.type === 'view' && (
                <ViewInstructor
                    onClose={() => setModal({ type: null, instructor: null })}
                    selectedInstructor={modal.instructor}
                />
            )}
            {modal.type === 'delete' && (
                <DeleteModal
                    onClose={() => setModal({ type: null, instructor: null })}
                    onDelete={handleDeleteInstructor}
                    selectedInstructor={modal.instructor}
                />
            )}
        </div>
    );
};

export default Instructors;