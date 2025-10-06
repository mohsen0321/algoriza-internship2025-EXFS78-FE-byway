// import React, { useState, useEffect } from "react";
// import { X, Plus, ChevronDown, Star } from "lucide-react";
// import axios from "axios";

// const InstructorForm = ({ mode, onClose, onSubmitSuccess, categories, selectedInstructor }) => {
//     const isUpdate = mode === "update";
//     const [formData, setFormData] = useState({
//         name: "",
//         categoryId: "",
//         description: "",
//         image: null,
//     });
//     const [previewImage, setPreviewImage] = useState(null);
//     const [rating, setRating] = useState(0);
//     const [hoverRating, setHoverRating] = useState(0);
//     const [errors, setErrors] = useState({});

//     // تحميل البيانات عند التعديل
//     useEffect(() => {
//         if (isUpdate && selectedInstructor) {
//             setFormData({
//                 name: selectedInstructor.name || "",
//                 categoryId: selectedInstructor.categoryId || "",
//                 description: selectedInstructor.description || "",
//                 image: null,
//             });
//             setPreviewImage(selectedInstructor.imageUrl || null);
//             setRating(selectedInstructor.rate || 0);
//         }
//     }, [isUpdate, selectedInstructor]);

//     // تغيير البيانات
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//     };

//     // اختيار صورة
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setFormData((prev) => ({ ...prev, image: file }));
//         setPreviewImage(file ? URL.createObjectURL(file) : previewImage);
//         setErrors((prev) => ({ ...prev, image: "" }));
//     };

//     // اختيار تقييم
//     const handleSetRating = (value) => {
//         setRating(value);
//         setErrors((prev) => ({ ...prev, rating: "" }));
//     };

//     // submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const newErrors = {};
//         if (!formData.name) newErrors.name = "Name required";
//         if (!formData.categoryId) newErrors.categoryId = "Category required";
//         if (!formData.description) newErrors.description = "Description required";
//         if (!formData.image && !previewImage) newErrors.image = "Image required";
//         if (rating === 0) newErrors.rating = "Rating required";
//         if (Object.keys(newErrors).length) return setErrors(newErrors);

//         const data = new FormData();
//         data.append("Name", formData.name);
//         data.append("CategoryId", formData.categoryId);
//         data.append("Rate", rating);
//         data.append("Description", formData.description);
//         if (formData.image) data.append("Image", formData.image);

//         try {
//             let response;
//             if (isUpdate) {
//                 response = await axios.put(
//                     `https://localhost:7280/api/Instructors/${selectedInstructor.id}`,
//                     data,
//                     { headers: { "Content-Type": "multipart/form-data" } }
//                 );
//             } else {
//                 response = await axios.post(
//                     "https://localhost:7280/api/Instructors",
//                     data,
//                     { headers: { "Content-Type": "multipart/form-data" } }
//                 );
//             }

//             const categoryTitle = categories.find(c => c.id === parseInt(formData.categoryId))?.title;
//             onSubmitSuccess({ ...response.data, categoryTitle });
//             onClose();
//         } catch (err) {
//             setErrors({ general: `Failed to ${isUpdate ? "update" : "add"} instructor.` });
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-gray-900">
//                         {isUpdate ? "Update Instructor" : "Add Instructor"}
//                     </h2>
//                     <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
//                         <X size={20} className="text-gray-500" />
//                     </button>
//                 </div>

//                 {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

//                 {/* صورة المدرب */}
//                 <div className="flex justify-center mb-6">
//                     <div className="relative">
//                         <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
//                             {previewImage ? (
//                                 <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
//                             ) : (
//                                 <span className="text-gray-500 text-lg">+</span>
//                             )}
//                         </div>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="absolute bottom-0 right-0 w-8 h-8 opacity-0 cursor-pointer"
//                             id="image-upload"
//                         />
//                         <label
//                             htmlFor="image-upload"
//                             className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600"
//                         >
//                             <Plus size={16} className="text-white" />
//                         </label>
//                     </div>
//                 </div>
//                 {errors.image && <p className="text-red-500 text-sm text-center mb-2">{errors.image}</p>}

//                 {/* الفورم */}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-1">Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             placeholder="Enter instructor name"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                         />
//                         {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-1">Category</label>
//                         <div className="relative">
//                             <select
//                                 name="categoryId"
//                                 value={formData.categoryId}
//                                 onChange={handleInputChange}
//                                 className="w-full p-3 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="">Select category</option>
//                                 {categories.map((c) => (
//                                     <option key={c.id} value={c.id}>{c.title}</option>
//                                 ))}
//                             </select>
//                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         </div>
//                         {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-1">Rating</label>
//                         <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <button
//                                     key={star}
//                                     type="button"
//                                     onClick={() => handleSetRating(star)}
//                                     onMouseEnter={() => setHoverRating(star)}
//                                     className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}
//                                 >
//                                     <Star size={24} />
//                                 </button>
//                             ))}
//                         </div>
//                         {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 mb-1">Description</label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleInputChange}
//                             placeholder="Enter description"
//                             className="w-full p-3 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500"
//                         />
//                         {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
//                     </div>

//                     <div className="flex gap-3 mt-6">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="flex-1 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             {isUpdate ? "Update" : "Add"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default InstructorForm;
