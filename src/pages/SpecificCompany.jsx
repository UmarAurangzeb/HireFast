import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FaPlus } from "react-icons/fa";
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
    const idd = '1f461ddb-c5be-4512-87da-8cb0bc0ac5ff';
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/getonecompany/${id}`);
                console.log("found company:", res.data);
                setCompanyData(res.data.company);
                console.log(res.data.jobs);
                setJobData(res.data.jobs);
                setHasEmployerOpened(authState.id === res.data.company.employer_id);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        }
        fetchData();
    }, [authState, id])

    useEffect(() => {
        if (jobToggle) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
        return () => {
            document.body.style.overflow = 'auto'; // Ensure it's reset when the component is unmounted
        };
    }, [jobToggle]);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await axios.get(`http://localhost:8000/getalljobs/${id}`);
    //             console.log("jobs posted:", res.data);
    //             // setCompanyData(res.data);

    //         } catch (error) {
    //             console.error("Error fetching jobs:", error);
    //         }
    //     }
    //     fetchData();
    // }, [authState, id])
    const handleupdateClick = () => {
        navigate(`/Company/Add/${id}`);
    }

    const handlejobsClick = () => {
        console.log("toggling jobs");
        setjobsToggle(prev => !prev);
    }
    if (companyData.length === 0 && jobData.length === 0) {
        return (
            <>
                loading...
            </>
        )
    }

    return (
        <>
            <section className='flex mt-[68px] justify-between w-full  '>
                <div className='flex  '>
                    <div className=' ml-6'>
                        <Avatar className="w-40 h-40 object-contain">
                            <AvatarImage src={`${companyData.imageurl}`} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-2xl mt-14 ml-4'>{companyData.company_name}</h1>
                        <p className='text-gray-400 ml-4'>number of employees: {1}</p>
                    </div>
                </div>
                {hasEmployerOpened && <Button className="bg-customPurple mt-16 mr-8" onClick={handleupdateClick}><FaPlus />Update Profile</Button>
                }            </section>
            <Separator className="mt-6" />

            <section className='mt-4 '>
                <div className='border-[1px] md:mx-auto rounded-lg px-4 py-6   '>
                    <h1 className=' text-xl font-bold text-gray-800  mb-2 font-Montserrat '>About Us</h1>
                    <p className=" break-words word-wrap text-wrap text-justify text-sm pl-2 text-gray-600">
                        {companyData.description}
                    </p>
                </div>
                <div className='mt-10 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 px-4 py-6 rounded-lg'>
                    <div className='flex justify-between '>
                        <h1 className=' text-xl font-bold text-gray-800 text-center mb-2 font-Montserrat'>Available Jobs</h1>
                        {hasEmployerOpened && <Button className=" bg-customPurple relative bottom- " onClick={() => handlejobsClick()}><FaPlus />Post Job</Button>
                        }
                    </div>
                    {jobData && jobData.length === 0 ? (
                        <h6 className='text-center mt-4 font-lato text-gray-600 text-sm'>
                            Company has no recent Openings
                        </h6>
                    ) : (
                        <div className=" max-w-[1200px] justify-center mx-auto mt-4 flex gap-x-6 flex-wrap">
                            {jobData.length > 0 && jobData.map((job) => (
                                <div key={job.job_id} className='my-2'>
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
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {jobToggle && <Jobs
                        onClose={() => { setjobsToggle(false) }}
                        company_id={id}
                        setJobData={setJobData}

                    />}

                </div>

            </section>
        </>

    )
}
