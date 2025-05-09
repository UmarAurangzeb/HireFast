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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { authState } = useAuth();
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setfilteredJobs] = useState([]);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/getallcompaniesjobs");
        if (res.data.success) {
          setJobData(res.data.data);
          setfilteredJobs(res.data.data);
        }
      } catch (error) {
        console.log("error fetching all jobs", error);
        toast({
          title: "Error",
          description: "Failed to fetch jobs. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchError("Please enter at least 2 characters to search.");
    } else {
      setSearchError("");
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-8">
            <HeroSection
              jobData={jobData}
              setJobData={setJobData}
              handleSearchChange={handleSearchChange}
              searchQuery={searchQuery}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
            {searchError && (
              <div className="text-red-600 text-center mt-2">{searchError}</div>
            )}
          </div>

          {/* Jobs Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Positions</h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customPurple"></div>
              </div>
            ) : jobData && jobData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No jobs posted yet</p>
                <p className="text-gray-400 mt-2">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs
                  .filter((jobs) => {
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
                  })
                  .map((job) => (
                    <div key={job.job_id} className="transform transition-all duration-200 hover:scale-[1.03] focus:scale-[1.03] outline-none focus:ring-2 focus:ring-customPurple rounded-xl" tabIndex={0} aria-label={`View details for job ${job.title}`}>
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
        </div>
      </div>
    </div>
  );
};

export default ApplyJobs;
