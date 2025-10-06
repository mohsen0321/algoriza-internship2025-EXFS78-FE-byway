import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Layers, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [counts, setCounts] = useState({ courses: 0, instructors: 0, categories: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonthHighestPrice, setCurrentMonthHighestPrice] = useState(0);
    const [isHighestOverall, setIsHighestOverall] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoriesRes, coursesRes, instructorsRes, pricesRes] = await Promise.all([
                    fetch("https://mohsenkhaled-001-site1.jtempurl.com/api/Categories"),
                    fetch("https://mohsenkhaled-001-site1.jtempurl.com/api/Courses"),
                    fetch("https://mohsenkhaled-001-site1.jtempurl.com/api/Instructors"),
                    fetch("https://mohsenkhaled-001-site1.jtempurl.com/api/Price")
                ]);
                if (!categoriesRes.ok || !coursesRes.ok || !instructorsRes.ok || !pricesRes.ok) {
                    throw new Error(`Failed to fetch data: ${pricesRes.statusText || 'Unknown error'}`);
                }

                const categoriesData = await categoriesRes.json();
                const coursesData = await coursesRes.json();
                const instructorsData = await instructorsRes.json();
                const pricesData = await pricesRes.json();
                console.log('Price API data:', pricesData);
                const { monthlyRevenue, currentMonthHighest, isHighest } = processPriceData(pricesData);
                console.log('Processed monthly data:', monthlyRevenue);
                setCounts({
                    categories: Array.isArray(categoriesData) ? categoriesData.length : 0,
                    courses: Array.isArray(coursesData) ? coursesData.length : 0,
                    instructors: Array.isArray(instructorsData) ? instructorsData.length : 0
                });
                setMonthlyData(monthlyRevenue);
                setCurrentMonthHighestPrice(currentMonthHighest);
                setIsHighestOverall(isHighest);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const processPriceData = (prices) => {
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyPrices = {};
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const currentYear = currentDate.getFullYear();
        let currentMonthHighest = 0;
        let globalHighest = 0;
        if (!Array.isArray(prices) || prices.length === 0) {
            console.log('Price data is empty or not an array');
            return { monthlyRevenue: [], currentMonthHighest: 0, isHighest: false };
        }
        prices.forEach((price, index) => {
            if (!price.amount || !price.createdAt) {
                console.log(`Invalid record at index ${index}:`, price);
                return;
            }

            const date = new Date(price.createdAt);
            if (isNaN(date)) {
                console.log(`Invalid date at record ${index}:`, price.createdAt);
                return;
            }

            const month = date.getMonth();
            const year = date.getFullYear();
            const monthKey = `${monthNames[month]}-${year}`;

            if (!monthlyPrices[monthKey]) {
                monthlyPrices[monthKey] = {
                    month: monthNames[month],
                    year,
                    prices: [],
                    total: 0
                };
            }
            monthlyPrices[monthKey].prices.push(price.amount);
            monthlyPrices[monthKey].total += price.amount;
            if (monthNames[month] === currentMonth && year === currentYear) {
                currentMonthHighest = Math.max(currentMonthHighest, price.amount);
            }
            globalHighest = Math.max(globalHighest, price.amount);
        });
        if (Object.keys(monthlyPrices).length === 0) {
            console.log('No monthly data after processing');
        }
        const isHighest = currentMonthHighest >= globalHighest && currentMonthHighest > 0;
        const monthlyRevenue = Object.values(monthlyPrices)
            .sort((a, b) => new Date(`${a.month} 1, ${a.year}`) - new Date(`${b.month} 1, ${b.year}`))
            .map(item => ({
                month: item.month,
                deposits: item.total,
                withdrawals: 0,
                highestPrice: Math.max(...item.prices, 0)
            }));

        return { monthlyRevenue, currentMonthHighest, isHighest };
    };

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const currentYear = currentDate.getFullYear();
    const currentMonthData = monthlyData.find(
        (data) => data.month === currentMonth && (!data.year || data.year === currentYear)
    );
    const totalRevenue = currentMonthData ? currentMonthData.deposits : 0;

    console.log('Current month:', currentMonth, 'Year:', currentYear, 'Revenue:', totalRevenue);
    console.log('Current month highest price:', currentMonthHighestPrice, 'Is highest overall:', isHighestOverall);

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonthIndex = monthNames.indexOf(currentMonth);
    const monthLabels = [];
    for (let i = -2; i <= 2; i++) {
        let monthIndex = (currentMonthIndex + i + 12) % 12;
        let year = currentYear;
        if (currentMonthIndex + i < 0) year -= 1;
        if (currentMonthIndex + i > 11) year += 1;
        monthLabels.push(monthNames[monthIndex]);
    }

    const totalPie = counts.courses + counts.instructors + counts.categories;
    const pieData = [
        { label: "Courses", value: counts.courses, color: "#3b82f6" },
        { label: "Instructors", value: counts.instructors, color: "#06b6d4" },
        { label: "Categories", value: counts.categories, color: "#8b5cf6" }
    ];

    const createPieSlices = () => {
        if (totalPie === 0) {
            return (
                <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="#e5e7eb"
                    stroke="white"
                    strokeWidth="2"
                />
            );
        }

        let cumulativePercentage = 0;
        const radius = 60;
        const centerX = 100;
        const centerY = 100;

        return pieData.map((slice, index) => {
            const percentage = slice.value / totalPie;
            const startAngle = cumulativePercentage * 2 * Math.PI - Math.PI / 2;
            const endAngle = (cumulativePercentage + percentage) * 2 * Math.PI - Math.PI / 2;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = percentage > 0.5 ? 1 : 0;

            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');

            cumulativePercentage += percentage;

            return (
                <path
                    key={index}
                    d={pathData}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                />
            );
        });
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 mt-10 md:mt-0 bg-gray-50 min-h-screen">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
                    <p className="text-gray-600 max-w-md">
                        Welcome back! Here's what's happening with your courses.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:bg-gray-200 rounded-full transition">
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
                    <Link
                        to="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Instructors"
                    value={counts.instructors}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Categories"
                    value={counts.categories}
                    icon={Layers}
                    color="bg-green-500"
                />
                <StatCard
                    title="Courses"
                    value={counts.courses}
                    icon={BookOpen}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4 flex-wrap">
                        <h2 className="text-gray-900 font-semibold text-lg">Revenue</h2>
                        <div className="flex items-center text-sm text-gray-400 mt-2 lg:mt-0">
                            <Calendar size={16} />
                            <span className="ml-1">This month</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            ${totalRevenue.toFixed(2)}
                        </div>
                        <div className="flex items-center mb-3">
                            <span className="text-sm text-gray-500 mr-2">Wallet Balance</span>
                            <span className="text-emerald-500 text-sm font-medium">+3.48%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">

                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="0.887695" width="16" height="16" rx="8" fill="#05CD99" />
                            <g clip-path="url(#clip0_2041_4207)">
                                <path d="M6.82069 10.6364L5.21653 9.03224C5.03778 8.85349 4.75361 8.85349 4.57486 9.03224C4.39611 9.21099 4.39611 9.49516 4.57486 9.67391L6.49528 11.5943C6.67403 11.7731 6.96277 11.7731 7.14153 11.5943L11.9999 6.74057C12.1786 6.56182 12.1786 6.27766 11.9999 6.09891C11.8211 5.92016 11.5369 5.92016 11.3582 6.09891L6.82069 10.6364Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2041_4207">
                                    <rect width="11" height="11" fill="white" transform="translate(2.69568 3.21094)" />
                                </clipPath>
                            </defs>
                        </svg>




                        <span className="text-emerald-600 text-sm font-medium">On your account</span>
                    </div>

                    <div className="relative mb-4 pl-40">
                        <div className="relative h-32">
                            <svg className="w-full h-full" viewBox="0 0 320 110">
                                <path
                                    d="M20 55 C60 45, 80 40, 120 50 C160 60, 180 30, 220 38 C260 46, 280 52, 300 46"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M20 75 C60 68, 80 82, 120 72 C160 62, 180 75, 220 68 C260 62, 280 65, 300 68"
                                    fill="none"
                                    stroke="#06b6d4"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="220" cy="38" r="3.5" fill="#3b82f6" />
                                <circle cx="220" cy="38" r="1.5" fill="white" />
                            </svg>
                            <div className="absolute top-1 right-16 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
                                ${totalRevenue.toFixed(2)}
                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
                            {monthLabels.map((month, index) => (
                                <span key={index}>{month}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6 mt-4">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-gray-700 text-sm font-medium">Deposits</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                            <span className="text-gray-700 text-sm font-medium">Withdrawals</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-500">Loading...</span>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : (
                        <>
                            <div className="relative w-40 h-40 mb-4">
                                <svg className="w-full h-full" viewBox="0 0 200 200">
                                    {createPieSlices()}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-2xl font-bold text-gray-800">{totalPie}</div>
                                    <div className="text-xs text-gray-500">Total Items</div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 flex-wrap">
                                {pieData.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <div className='flex items-center gap-2 justify-center mb-1'>

                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                            <p className="text-xs text-gray-500 font-bold">{d.label}</p>
                                        </div>

                                        <div className="flex items-center gap-2 mb-1 justify-center">
                                            <span className="text-sm  text-black font-bold">
                                                {totalPie > 0 ? ((d.value / totalPie) * 100).toFixed(1) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;