import React from 'react'
import HeroSection from './Home/HeroSection'
import Counters from './Home/counters'
import TopCategories from './Home/topCategories'
import TopCourses from './Home/topCourses'
import TopInstructors from './Home/topInstructors'
import Testimonials from './Home/Testimonials'
import BecomeInstructor from './Home/becomeinstrucor'
import EducationSection from './Home/EducationSection.JSX'

const Home = () => {
    return (
        <div className=''>
            <HeroSection />
            <Counters />
            <TopCategories />
            <TopCourses />
            <TopInstructors />
            <Testimonials />
            <BecomeInstructor />
            <EducationSection />
        </div>
    )
}

export default Home