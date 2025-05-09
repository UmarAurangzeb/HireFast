import React, { useState, useRef, useEffect } from "react";
import { useAuth } from '../context/AuthContext.jsx'
import { IoMdClose } from "react-icons/io";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Jobs from "../components/PostJobs.tsx";
export default function JobCard({
  setjobsToggle,
  students,
  applicant_count,
  cvs,
  job_id,
  title,
  company_id,
  company,
  type,
  salary,
  description,
  requirement,
  posted_date,
  closing_date,
  status,
  hasEmployerOpened,
  setJobData,
  onUpdateJob,
  onViewCVs
}) {
  console.log("closing_date:", closing_date);
  const fileInputRef = useRef(null);
  const { toast } = useToast()
  const { authState } = useAuth();
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isRequirementExpanded, setRequirementExpanded] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appliedAlready, setAppliedAlready] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (students && students.includes(authState.id)) {
      console.log('helloo');
      setAppliedAlready(true);
    }
  }, [])

  const handleDescriptionToggle = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleRequirementToggle = () => {
    setRequirementExpanded(!isRequirementExpanded);
  };

  const handlejobDelete = async () => {
    try {

      const res = await axios.delete(`http://localhost:8000/deletejob/${job_id}`);
      if (res.data.success) {
        setJobData((prev) => {
          return prev.filter((previous) => previous.job_id !== job_id);
        })
        toast({
          title: "yesss!",
          description: 'job deleted successfully',
        })
      }

    } catch (e) {
      console.log("err", e);
      toast({
        title: "Ooops",
        description: 'failed to delete job',
        variant: "destructive"
      })
    }

  };

  const handleApplyNow = () => {
    if (authState.id && authState.role === 'student') {
      fileInputRef.current.click();
    }
    else {
      navigate('/signin');
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('company_id', company_id);
    formData.append('job_id', job_id);
    formData.append('student_id', authState.id);
    console.log(file);
    if (file) {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:8000/uploadcv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          toast({
            title: "Yesss",
            description: 'CV UPLOADED Successfully',
          })
          setLoading(false);
          setAppliedAlready(true);
        }
      } catch (e) {
        console.log("error uploading cv");
        setLoading(false);
      } finally {
        e.target.value = "";
      }
    }
  }

  const extractFileName = (url) => {
    const fullFileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
    return fullFileName.replace(/^\d+-/, "");
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-3xl  p-6 border hover:shadow-2xl transition-shadow duration-300 w-[380px] min-h-[350px] mx-auto relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-Montserrat text-customBlack">
            {title}
          </h2>
          {hasEmployerOpened && <AlertDialog>
            <AlertDialogTrigger className='absolute right-[-15px] mb-16'><IoMdClose className="absolute mb-14 right-5" /></AlertDialogTrigger>
            <AlertDialogContent className='bg-customWhite border-customPurple'>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the job listing
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-customPurple' onClick={handlejobDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
          <div className="flex flex-row">
            <span
              className={`text-sm ${status === 'open' ? 'bg-green-600' : 'bg-red-600'} py-1 rounded-md  text-white px-4  font-Roboto`}
            >
              {status}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-2 font-Roboto">{company}</p>
        <p className="text-gray-500">{'Karachi-Sindh'}</p>
        <p className="text-gray-100 bg-gray-500 w-16 text-center rounded-md py-1 my-1">{type}</p>
        <p className="text-gray-700 mt-4 text-sm font-Roboto">
          <span className="font-bold">number of applicants: </span>
          {applicant_count || 0}
        </p>
        {description ? (
          <p className="text-gray-700 mt-4 text-sm font-Roboto">
            <span className="font-bold">Description:</span>
            {isDescriptionExpanded ? description : description.slice(0, 100)}{" "}
            {description.length > 100 && (
              <button
                onClick={handleDescriptionToggle}
                className="text-customPurple font-medium"
              >
                {isDescriptionExpanded ? "See Less" : "See More"}
              </button>
            )}
          </p>
        ) : (
          <p className="text-gray-700 mt-4 text-sm font-Roboto">
            No description available.
          </p>
        )}

        {/* Requirements Section */}
        {requirement ? (
          <p className="text-gray-700 mt-4 text-sm font-Roboto">
            <span className="font-bold">Requirements:</span>
            {isRequirementExpanded ? requirement : requirement.slice(0, 100)}{" "}
            {requirement.length > 100 && (
              <button
                onClick={handleRequirementToggle}
                className="text-customPurple font-medium"
              >
                {isRequirementExpanded ? "See Less" : "See More"}
              </button>
            )}
          </p>
        ) : (
          <p className="text-gray-700 mt-4 text-sm font-Roboto">
            No requirements listed.
          </p>
        )}

        {hasEmployerOpened ? (
          <>
            <div className="flex flex-row gap-x-2">
              <button
                className="mt-4 bg-customPurple text-white py-2 px-4 rounded hover:bg-purple-700 font-Lato"
                onClick={onUpdateJob}
              >
                Update Job
              </button>
              {applicant_count > 0 && <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-purple-700 font-Lato"
                onClick={onViewCVs}
              >
                View CVs
              </button>}
            </div>
          </>
        ) :
          (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="w-full h-full hidden"
                onChange={(e) => handleFileChange(e)}
              />
              {loading ? <img src={`/loader.svg`} alt="loader.svg" className="w-20" /> :
                <button disabled={appliedAlready} className={`mt-4 ${!appliedAlready ? 'bg-customPurple hover:bg-purple-700' : 'bg-green-800 hover:bg-green-600'} text-white py-2 px-4 rounded  font-Lato`} onClick={handleApplyNow}>
                  {!appliedAlready ? 'Apply Now' : 'Applied!'}
                </button>
              }
            </div>
          )}
      </div >
    </>
  )
}
