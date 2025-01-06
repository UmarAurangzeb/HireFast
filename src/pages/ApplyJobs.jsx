import React, { useEffect, useState } from "react";
import Navbar from "../components1/navbar.jsx";
import HeroSection from "../components1/heroSection.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "@/hooks/use-toast"
import JobCard from "../components1/jobcard.jsx";
import axios from "axios";
const ApplyJobs = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { authState } = useAuth();
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setfilteredJobs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/getallcompaniesjobs");
        console.log(res.data.data);
        if (res.data.success) {
          setJobData(res.data.data);
          setfilteredJobs(res.data.data);
        }
      } catch (error) {
        console.log("error fetching all jobs", error);
      }
    }
    fetchData();
  }, [])
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    console.log(query);
    setSearchQuery(query);
    const filteredJobs = jobData.filter((job) => {
      return (
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.jobtype.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.requirement.toLowerCase().includes(query) ||
        job.posted_date.toLowerCase().includes(query) ||
        job.closing_date.toLowerCase().includes(query) ||
        job.status.toLowerCase().includes(query)
      );
    });
    setfilteredJobs(filteredJobs);
  };

  return (
    <div className="min-h-screen bg-customWhite justify-center ">
      <div className="py-30 px-10">
        <Navbar />
      </div>
      <HeroSection jobData={jobData} setJobData={setJobData} handleSearchChange={handleSearchChange} searchQuery={searchQuery} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

      {jobData && jobData.length === 0 ? (
        <h6 className='text-center mt-4 font-lato text-customPurple text-md'>
          No jobs Posted yett
        </h6>
      ) : (
        <div className=" w-full max-w-[1200px]  justify-center mx-auto mt-4 flex lg:gap-x-6 flex-wrap">
          {filteredJobs.length > 0 && filteredJobs.filter((jobs) => {
            let matchesFilters;
            if (selectedFilter === '' || selectedFilter === 'all') {
              return true;
            }
            else if (selectedFilter === 'applied' && jobs.students.includes(authState?.id)) {
              matchesFilters = true;
            }
            else if (selectedFilter === 'notapplied' && !jobs.students.includes(authState?.id)) {
              matchesFilters = true;
            }
            else if (selectedFilter === 'onsite' && jobs.jobtype === 'onsite') {
              matchesFilters = true;
            }
            else if (selectedFilter === 'remote' && jobs.jobtype === 'remote') {
              matchesFilters = true;
            }
            else if (selectedFilter === 'open' && jobs.status === 'open') {
              matchesFilters = true;
            }
            else if (selectedFilter === 'closed' && jobs.status === 'closed') {
              matchesFilters = true;
            }
            else if (selectedFilter === 'low-to-high') {
              filteredJobs.sort((a, b) => a.applicant_count - b.applicant_count);
              matchesFilters = true;
            }
            else if (selectedFilter === 'high-to-low') {
              filteredJobs.sort((a, b) => b.applicant_count - a.applicant_count);
              matchesFilters = true;
            }
            return matchesFilters;
          }).map((job) => (
            <div key={job.job_id} className=' my-2'>
              <JobCard
                students={job.students}
                applicant_count={job.applicant_count}
                job_id={job.job_id}
                title={job.title}
                company_id={job.company_id}
                company={job.company_name}
                type={job.jobtype}
                description={job.description}
                requirement={job.requirement}
                posted_date={job.posted_date}
                closing_date={job.closing_date}
                status={job.status}
                setJobData={setJobData}
              />
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default ApplyJobs;
