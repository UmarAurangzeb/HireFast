import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FaPlus, FaBuilding, FaUsers } from "react-icons/fa";
import { Separator } from "@/components/ui/separator"
import axios from 'axios';
import { useNavigate } from "react-router";
import { useAuth } from '../context/AuthContext.jsx'
import Jobs from '../components/PostJobs.tsx'
import JobCard from '../components1/jobcard.jsx';

export default function SpecificCompany() {
    const [companyData, setCompanyData] = useState({});
    const [jobData, setJobData] = useState([{}]);
    const { authState } = useAuth();
    const { id } = useParams();
    const [hasEmployerOpened, setHasEmployerOpened] = useState(false);
    const [jobToggle, setjobsToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);
    const [showUpdateJob, setShowUpdateJob] = useState(false);
    const [selectedCVs, setSelectedCVs] = useState([]);
    const [showCVsModal, setShowCVsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:8000/getonecompany/${id}`);
                setCompanyData(res.data.company);
                setJobData(res.data.jobs);
                setHasEmployerOpened(authState.id === res.data.company.employer_id);
            } catch (error) {
                console.error("Error fetching company data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [authState, id])

    useEffect(() => {
        if (jobToggle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [jobToggle]);

    const handleupdateClick = () => {
        navigate(`/Company/Add/${id}`);
    }

    const handlejobsClick = () => {
        setjobsToggle(prev => !prev);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customPurple"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Company Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <Avatar className="w-40 h-40 border-4 border-white shadow-xl">
                            <AvatarImage
                                src={companyData.imageurl}
                                className="w-full h-full object-cover"
                            />
                            <AvatarFallback className="bg-customPurple text-white text-4xl">
                                {companyData.company_name?.charAt(0) || "C"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {companyData.company_name}
                            </h1>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaBuilding className="text-customPurple" />
                                    <span>Technology</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaUsers className="text-customPurple" />
                                    <span>{companyData.employee_count || "1-50"} employees</span>
                                </div>
                            </div>

                            {hasEmployerOpened && (
                                <Button
                                    className="bg-customPurple hover:bg-customPurple/90 mt-4 px-6 py-2 rounded-full transition-all duration-200"
                                    onClick={handleupdateClick}
                                >
                                    <FaPlus className="mr-2" />
                                    Update Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {companyData.description || "No description available."}
                    </p>
                </div>

                {/* Jobs Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Available Positions</h2>
                        {hasEmployerOpened && (
                            <Button
                                className="bg-customPurple hover:bg-customPurple/90 px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                onClick={() => { setSelectedJob(null); setShowUpdateJob(true); }}
                            >
                                <FaPlus className="mr-2" />
                                Post New Job
                            </Button>
                        )}
                    </div>

                    {jobData && jobData.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No open positions at the moment</p>
                            <p className="text-gray-400 mt-2">Check back later for new opportunities</p>
                            {hasEmployerOpened && (
                                <Button
                                    className="bg-customPurple hover:bg-customPurple/90 px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                                    onClick={handlejobsClick}
                                >
                                    <FaPlus className="mr-2" />
                                    Post New Job
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobData.map((job) => (
                                <div key={job.job_id} className="transform transition-all duration-200 hover:scale-[1.03] focus:scale-[1.03] outline-none focus:ring-2 focus:ring-customPurple rounded-xl" tabIndex={0} aria-label={`View details for job ${job.title}`}>
                                    <JobCard
                                        students={job.students}
                                        setjobsToggle={setjobsToggle}
                                        applicant_count={job.applicant_count}
                                        cvs={job.cvs}
                                        job_id={job.job_id}
                                        title={job.title}
                                        company_id={companyData.company_id}
                                        company={companyData.company_name}
                                        type={job.jobtype}
                                        description={job.description}
                                        requirement={job.requirement}
                                        posted_date={job.posted_date}
                                        closing_date={job.closing_date}
                                        status={job.status}
                                        hasEmployerOpened={hasEmployerOpened}
                                        setJobData={setJobData}
                                        onUpdateJob={() => { setSelectedJob(job); setShowUpdateJob(true); }}
                                        onViewCVs={() => { setSelectedCVs(job.cvs || []); setShowCVsModal(true); }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showUpdateJob && (
                    <Jobs
                        updateJob={!!selectedJob}
                        setJobData={setJobData}
                        company_id={companyData.company_id}
                        job_id={selectedJob?.job_id}
                        title={selectedJob?.title || ""}
                        company={companyData.company_name}
                        type={selectedJob?.jobtype || "onsite"}
                        salary={selectedJob?.salary || ""}
                        description={selectedJob?.description || ""}
                        requirement={selectedJob?.requirement || ""}
                        status={selectedJob?.status || "open"}
                        closingDate={selectedJob?.closing_date || ""}
                        onClose={() => { setShowUpdateJob(false); setSelectedJob(null); }}
                    />
                )}

                {showCVsModal && (
                    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
                        <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setShowCVsModal(false)}></div>
                        <div className="fixed w-full max-w-lg max-h-[80vh] overflow-y-auto bg-customWhite border-2 rounded-2xl z-[1250] border-customPurple top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 shadow-2xl flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-customPurple">CVs</h2>
                                <Button className='bg-customPurple px-4 py-1' onClick={() => setShowCVsModal(false)}>Close</Button>
                            </div>
                            <div className="space-y-3">
                                {selectedCVs.length === 0 ? (
                                    <p className="text-gray-500">No CVs uploaded yet.</p>
                                ) : (
                                    selectedCVs.map((cv, idx) => (
                                        <div key={idx} className="w-full bg-gray-100 flex justify-between py-2 items-center shadow-sm rounded-md px-3">
                                            <p className="truncate max-w-xs">{cv && decodeURIComponent(cv.substring(cv.lastIndexOf("/") + 1)).replace(/^\d+-/, "")}</p>
                                            <Button className="bg-customPurple"><a href={cv} target="_blank" rel="noopener noreferrer" download>Download CV</a></Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
