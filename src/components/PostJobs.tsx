import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from 'axios';
import { Button } from './ui/button';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import { format } from 'date-fns';
type JobData = {
    job_id: string | null;
    company_id: string | null;
    title: string;
    description: string;
    requirement: string
    jobtype: string;
    closing_date: string;
    status: string;
};

const JobSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }).max(100, { message: "Title must not exceed 100 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long" }).max(1000, { message: "Description must not exceed 1000 characters" }),
    requirement: z.string().min(10, { message: "requirement must be at least 10 characters long" }).max(1000, { message: "requirement must not exceed 1000 characters" }),
    jobtype: z.enum(["onsite", "remote"], { message: "Job type must be 'onsite' or 'remote'" }),
    closing_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Closing date must be a valid date" }),
    status: z.enum(["open", "closed"], { message: "Status must be 'open' or 'closed'" }),
});

const Jobs: React.FC = ({
    company_id,
    setJobData,
    updateJob,
    job_id,
    title,
    company,
    type,
    salary,
    description,
    requirement,
    status,
    closingDate,
    onClose

}: any) => {
    const { toast } = useToast()
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JobData>({
        resolver: zodResolver(JobSchema),
        defaultValues: {
            title: "",
            description: "",
            requirement: "",
            jobtype: "onsite",
            closing_date: "",
            status: "open",
        },
    });
    useEffect(() => {
        if (updateJob) {
            reset({
                title,
                description,
                requirement,
                jobtype: type,
                closing_date: closingDate ? format(new Date(closingDate), 'yyyy-MM-dd') : '',
                status: status,
            });
        }
    }, [updateJob, reset, title, description, requirement, type, closingDate, status]);
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<JobData> = async (data) => {
        try {
            const res = await axios.post('http://localhost:8000/postjob', {
                job_id: job_id || undefined,
                company_id: company_id,
                title: data.title,
                description: data.description,
                requirement: data.requirement,
                jobtype: data.jobtype,
                closing_date: data.closing_date,
                status: data.status
            });

            if (res.data.success) {
                if (!job_id) {
                    const newJob = { ...data, job_id: res.data.data.job_id };
                    setJobData((prev: any) => [...prev, newJob]);
                } else {
                    setJobData((prev: any) => {
                        return prev.map((prevData) => {
                            if (prevData.job_id === job_id) {
                                return {
                                    ...prevData,
                                    ...data,
                                    job_id: prevData.job_id
                                };
                            }
                            return prevData;
                        });
                    });
                }

                toast({
                    title: "Success!",
                    description: res.data.message,
                });
                onClose();
            }

        } catch (err) {
            console.log("Error posting job", err);
            toast({
                title: "Oops",
                description: 'Job posting failed',
                variant: "destructive",
            });
        }
    };
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-[1000]" onClick={onClose}></div>
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white border-4 border-customPurple rounded-3xl z-[1100] p-10 shadow-2xl flex flex-col mx-auto">
                <Button className='bg-customPurple px-6 mb-4 self-end' onClick={onClose}>Close</Button>
                <h1 className="text-3xl font-bold text-center mb-8 font-Lato">{updateJob ? 'Update Job' : 'Create Job'}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-semibold font-Montserrat">Title</label>
                        <input
                            id="title"
                            {...register("title")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-customPurple font-Lato text-lg"
                            placeholder="Job title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold font-Montserrat">Description</label>
                        <textarea
                            id="description"
                            {...register("description")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-customPurple font-Lato text-lg"
                            placeholder="Job description"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="requirement" className="block text-lg font-semibold font-Montserrat">Requirement</label>
                        <textarea
                            id="requirement"
                            {...register("requirement")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-customPurple font-Lato text-lg"
                            placeholder="Job Requirements"
                        />
                        {errors.requirement && <p className="text-red-500 text-sm mt-1">{errors.requirement.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="jobtype" className="block text-lg font-semibold font-Montserrat">Job Type</label>
                        <select
                            id="jobtype"
                            {...register("jobtype")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-customPurple text-lg"
                        >
                            <option value="onsite">Onsite</option>
                            <option value="remote">Remote</option>
                        </select>
                        {errors.jobtype && <p className="text-red-500 text-sm mt-1">{errors.jobtype.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="closing_date" className="block text-lg font-semibold font-Montserrat">Closing Date</label>
                        <input
                            type="date"
                            id="closing_date"
                            {...register("closing_date")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-customPurple text-lg"
                        />
                        {errors.closing_date && <p className="text-red-500 text-sm mt-1">{errors.closing_date.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-lg font-semibold font-Montserrat">Status</label>
                        <select
                            id="status"
                            {...register("status")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-customPurple text-lg"
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-customPurple text-white py-3 rounded-full text-lg font-Lato shadow-md hover:bg-customPurple/90 transition-all"
                    >
                        {isSubmitting ? '...Submitting' : 'Submit'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Jobs;