import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    UsersIcon,
    CheckBadgeIcon,
    BuildingOfficeIcon,
    HeartIcon,
    StarIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    DevicePhoneMobileIcon,
    FaceSmileIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function AboutIndex({ statistics, teamMembers, values, milestones, mission, vision }) {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Helper function to get the appropriate icon component
    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'star':
                return <StarIcon className="w-10 h-10 text-amber-500" />;
            case 'shield-check':
                return <ShieldCheckIcon className="w-10 h-10 text-amber-500" />;
            case 'badge-check':
                return <CheckBadgeIcon className="w-10 h-10 text-amber-500" />;
            case 'emoji-happy':
                return <FaceSmileIcon className="w-10 h-10 text-amber-500" />;
            case 'device-mobile':
                return <DevicePhoneMobileIcon className="w-10 h-10 text-amber-500" />;
            case 'users':
                return <UserGroupIcon className="w-10 h-10 text-amber-500" />;
            default:
                return <CheckBadgeIcon className="w-10 h-10 text-amber-500" />;
        }
    };

    return (
        <GuestLayout>
            <Head title="About Rapid Handy Work" />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-50 opacity-70"></div>
                    <div className="absolute rounded-full -right-20 -top-20 w-80 h-80 bg-amber-200 opacity-30"></div>
                    <div className="absolute bottom-0 w-64 h-64 rounded-full left-1/4 bg-amber-300 opacity-20"></div>
                </div>

                <div className="relative z-10 px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                        >
                            About <span className="text-amber-600">Rapid Handy Work</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-3xl mx-auto mt-6 text-xl text-gray-600"
                        >
                            Connecting skilled professionals with customers for all their service needs since 2018.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Mission and Vision Section */}
            <section className="py-12 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="p-8 bg-amber-50 rounded-xl"
                        >
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Mission</h2>
                            <p className="text-lg text-gray-700">{mission}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="p-8 bg-gray-50 rounded-xl"
                        >
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Vision</h2>
                            <p className="text-lg text-gray-700">{vision}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-amber-500">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white">Our Impact</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-amber-100">
                            We're proud of the difference we've made in connecting service providers with customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-12 text-center md:grid-cols-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="px-6 py-8 bg-white rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100">
                                <UsersIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{statistics.providers}+</div>
                            <div className="mt-1 text-sm font-medium text-gray-600">Professional Providers</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="px-6 py-8 bg-white rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100">
                                <CheckBadgeIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{statistics.completedJobs}+</div>
                            <div className="mt-1 text-sm font-medium text-gray-600">Jobs Completed</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="px-6 py-8 bg-white rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100">
                                <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{statistics.serviceAreas}</div>
                            <div className="mt-1 text-sm font-medium text-gray-600">Service Areas</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="px-6 py-8 bg-white rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100">
                                <HeartIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{statistics.customerSatisfaction}%</div>
                            <div className="mt-1 text-sm font-medium text-gray-600">Customer Satisfaction</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-16 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-gray-600">
                            The core principles that guide everything we do at Rapid Handy Work.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex flex-col items-start p-6 transition duration-300 rounded-lg bg-gray-50 hover:shadow-md"
                            >
                                <div className="flex items-center justify-center p-2 mb-4 rounded-full bg-amber-100">
                                    {getIconComponent(value.icon)}
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Our Leadership Team</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-gray-600">
                            Meet the dedicated professionals working to make Rapid Handy Work the best service platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 mt-12 sm:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="overflow-hidden text-center bg-white rounded-lg shadow-md"
                            >
                                <div className="px-6 pt-6 pb-4">
                                    <div className="mx-auto mb-4 overflow-hidden rounded-full w-28 h-28">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                    <p className="mt-1 text-sm font-medium text-amber-600">{member.position}</p>
                                    <p className="mt-3 text-gray-600">{member.bio}</p>
                                </div>
                                <div className="px-6 py-4 mt-2 border-t border-gray-100">
                                    <div className="flex justify-center space-x-4">
                                        <a href="#" className="text-gray-400 hover:text-amber-500">
                                            <span className="sr-only">LinkedIn</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-amber-500">
                                            <span className="sr-only">Twitter</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story/Milestones Section */}
            <section className="py-16 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-gray-600">
                            The key milestones that have shaped Rapid Handy Work into what it is today.
                        </p>
                    </div>

                    <div className="relative mt-12">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-amber-300"></div>
                        </div>

                        <div className="relative flex justify-center">
                            <span className="px-3 text-lg font-medium bg-white text-amber-600">Our Timeline</span>
                        </div>
                    </div>

                    <div className="mt-10 space-y-8">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center`}
                            >
                                <div className={`flex items-center justify-center w-24 h-24 mx-auto mb-4 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} text-xl font-bold text-white bg-amber-500 rounded-full md:mx-0 md:mb-0`}>
                                    {milestone.year}
                                </div>
                                <div className={`flex-1 p-6 bg-gray-50 rounded-lg ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                    <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                                    <p className="mt-2 text-gray-600">{milestone.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-amber-500">
                <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white">Ready to experience our services?</h2>
                    <p className="max-w-xl mx-auto mt-4 text-amber-100">
                        Join thousands of satisfied customers who trust Rapid Handy Work for their service needs.
                    </p>
                    <div className="mt-8">
                        <a
                            href="/services"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-white border border-transparent rounded-md shadow-sm text-amber-600 hover:bg-amber-50"
                        >
                            Explore Our Services
                        </a>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
