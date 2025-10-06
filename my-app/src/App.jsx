import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Instructors from './pages/Instructors';
import AddCourseStep1 from './pages/AddCourseStep1';
import AddCourseStep2 from './pages/AddCourseStep2';
import ViewCourseStep1 from './pages/ViewCourseStep1';
import ViewCourseStep2 from './pages/ViewCourseStep2';
import CoursesPage from './pages/CoursesPage';
import SignUpPage from './pages/SignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import CourseDetails from './pages/CourseDetails';
import ShoppingCart from './pages/ShoppingCart ';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutPage from './pages/CheckoutPage';
import Thanks from './pages/Thanks';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="courses" element={<CoursesWrapper />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="add-course/step1" element={<AddCourseStep1 />} />
          <Route path="add-course/step2" element={<AddCourseStep2 />} />
          <Route path="view-course/step1/:courseId" element={<ViewCourseStep1 />} />
          <Route path="view-course/step2/:courseId" element={<ViewCourseStep2 />} />
          <Route path="edit-course/step1/:courseId" element={<AddCourseStep1 />} />
          <Route path="edit-course/step2/:courseId" element={<AddCourseStep2 />} />
          <Route path='*' element={< NotFound />} />
        </Routes>
      </div>
    </div>
  );
};
const CoursesWrapper = () => {
  const navigate = useNavigate();
  return <Courses onAddCourse={() => navigate('add-course/step1')} />;
};
const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="w-full min-h-screen flex flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <div className='overflow-hidden'>


      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signuppage" element={<SignUpPage />} />
                <Route path="/google-callback" element={<GoogleCallbackPage />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/coursespage" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkoutpage" element={<CheckoutPage />} />
                <Route path="/thanks" element={<Thanks />} />
                <Route path='*' element={< NotFound />} />
              </Routes>
            </Layout>
            <ToastContainer position="bottom-right" autoClose={3000} />
          </Router>
        </CartProvider>
      </AuthProvider>
    </div>
  );
};

export default App;