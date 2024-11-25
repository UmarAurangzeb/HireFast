import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from 'axios';
import { Button } from './ui/button';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"

type JobData = {
    job_id: string | null;
    company_id: string | null;
    title: string;
    description: string;
    requirement: string
    jobtype: string;
    closing_date: Date;
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

const Jobs: React.FC = ({ setjobsToggle, company_id }: any) => {
    const { toast } = useToast()
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JobData>({
        resolver: zodResolver(JobSchema),
    });
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<JobData> = async (data) => {
        try {
            const res = await axios.post('http://localhost:8000/postjob', {
                company_id: company_id,
                title: data.title,
                description: data.description,
                requirement: data.requirement,
                jobtype: data.jobtype,
                closing_date: data.closing_date,
                status: data.status
            })
            if (res.data.success) {
                toast({
                    title: "yess!",
                    description: res.data.message
                })
            }
        } catch (err) {
            console.log("error posting jobs", err);
            toast({
                title: "Ooops",
                description: 'Job posting failed',
                variant: "destructive"
            })
        }
    };

    return (
        <div
            className="h-10/12 w-10/12 max-h-screen max-w-screen overflow-y-scroll scrollbar-hide overflow-hidden border-2 rounded-lg z-10 bg-gray-100 border-customPurple absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-6"
        >
            <Button className='bg-customPurple px-6 ' onClick={() => { setjobsToggle(prev => !prev) }}>Back</Button>
            <h1 className="text-2xl font-bold text-center mb-6 font-Lato">Create Job</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-lg font-semibold font-Montserrat">Title</label>
                    <input
                        id="title"
                        {...register("title")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-customPurple focus:border-customPurple font-Lato"
                        placeholder="Job title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-lg font-semibold font-Montserrat">Description</label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-customPurple focus:border-customPurple font-Lato"
                        placeholder="Job description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>
                <div>
                    <label htmlFor="requirement" className="block text-lg font-semibold font-Montserrat">Requirement</label>
                    <textarea
                        id="requirement"
                        {...register("requirement")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-customPurple focus:border-customPurple font-Lato"
                        placeholder="Job Requirements"
                    />
                    {errors.requirement && <p className="text-red-500 text-sm">{errors.requirement.message}</p>}
                </div>

                <div>
                    <label htmlFor="jobtype" className="block text-lg font-semibold font-Montserrat">Job Type</label>
                    <select
                        id="jobtype"
                        {...register("jobtype")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-customPurple focus:border-customPurple"
                    >
                        <option value="onsite">Onsite</option>
                        <option value="remote">Remote</option>
                    </select>
                    {errors.jobtype && <p className="text-red-500 text-sm">{errors.jobtype.message}</p>}
                </div>

                <div>
                    <label htmlFor="closing_date" className="block text-lg font-semibold font-Montserrat">Closing Date</label>
                    <input
                        type="date"
                        id="closing_date"
                        {...register("closing_date")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-customPurple focus:border-customPurple"
                    />
                    {errors.closing_date && <p className="text-red-500 text-sm">{errors.closing_date.message}</p>}
                </div>

                <div>
                    <label htmlFor="status" className="block text-lg font-semibold font-Montserrat">Status</label>
                    <select
                        id="status"
                        {...register("status")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-customPurple focus:border-customPurple"
                    >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-customPurple text-white py-2 rounded-md hover:bg-purple-700"
                >
                    {isSubmitting ? '...Submitting' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default Jobs;