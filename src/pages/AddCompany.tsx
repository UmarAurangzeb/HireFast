import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from 'axios';
import Company from './Company';
import { Button } from '@/components/ui/button';
import { FaPlus } from "react-icons/fa";
import { Dice1 } from 'lucide-react';
import { IoIosClose } from "react-icons/io";
import { useLocation } from 'react-router-dom';

type CompanyData = {
    company_id: string;
    company_name: string;
    description: string;
    imageurl: string | null;
    numberofemployees: number;
    registered_at: Date;
    website: string | null;
}

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

const CompanySchema = z.object({
    company_name: z.string().min(2, { message: "company name is required" }),
    profilePic: z
        .any()
        .optional(),
    description: z.string().min(5, { message: "description is required" }),
    website: z.string().optional(),

});
type FormFields = z.infer<typeof CompanySchema>;

export default function AddCompany() {
    let location = useLocation();
    const id = location.pathname?.split('/')[3] || null;
    console.log("id is", id);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormFields>(
        {
            defaultValues: {
                company_name: "", // Initialize empty
                description: "",
                website: "",
            },
            resolver: zodResolver(CompanySchema)
        }
    );

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/getonecompany/${id}`);
                    console.log(response.data);
                    setCompanyData(response.data);
                    reset({
                        company_name: response.data.company_name,
                        description: response.data.description,
                        website: response.data.website,
                    })
                    setImagePreview(response.data.imageurl);
                    if (companyData.imageurl) {
                        setIsImageUploaded(true);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            fetchData();
        }
    }, [])
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const formData = new FormData();
        formData.append("company_name", data.company_name);
        formData.append("description", data.description);
        if (id && companyData.imageurl) {
            formData.append("imageUrl", companyData.imageurl);
        }
        if (data.website) {
            formData.append("website", data.website);
        }

        const file = data.profilePic?.[0];
        if (file) {
            formData.append("profilePic", file);
        }
        try {
            let response: any;
            if (id) {
                // console.log("iddd", id);
                formData.append("id", id);
                response = await axios.put("http://localhost:8000/updateonecompany", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.status === 201) {
                }
            }
            else {
                response = await axios.post("http://localhost:8000/addcompany", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.status === 201) {
                }
            }
            // console.log("Success:", response.data);
            reset();
            setImagePreview(null);
            setIsImageUploaded(false);
            setCompanyData(null);
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    };

    const handlefileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageUploaded(true);
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

        }
        else {
            setIsImageUploaded(false);
        }
    }


    return (
        <div className='mt-[68px] min-h-screen  bg-gradient-to-br from-purple-200 to-gray-200 '>
            <div className='w-5/6 mx-auto text-center'>
                <form action="#"
                    className='w-full flex flex-col gap-y-4  rounded-md mt-2 px-4 py-10 '
                    onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='font-semibold text-4xl pt-4 font-Montserrat'>Add Company</h1>
                    <div className='flex flex-col gap-y-1 '>
                        <label htmlFor="company name" className='text-md text-left font-semibold font-Roboto'>Company Name</label>
                        <input type="text"
                            id="company name"
                            {...register("company_name")}
                            className='focus:outline-none active:outline-none border-[1px] rounded-md px-1 py-1 focus:border-customPurple font-Lato '
                            placeholder="Enter company name"
                        />
                        {errors.company_name && (
                            <div className="text-red-600 text-left">{errors.company_name.message}</div>
                        )}

                    </div>
                    <div className='flex flex-col gap-y-1 '>
                        <Button className={`${isImageUploaded && ''}cursor-pointer  relative mt-2`} disabled={isImageUploaded}>
                            <label htmlFor="upload" className="text-md flex text-left font-semibold cursor-pointer">
                                {isImageUploaded ? (
                                    <p className='text-green-400 font-Roboto'>Image upload successful</p>
                                ) : (
                                    <>
                                        <FaPlus className="mr-2 relative top-[2px] font-Roboto" />
                                        Upload Profile Picture
                                    </>
                                )}
                            </label>

                            <input
                                type="file"
                                id="upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-Lato"
                                accept="image/*"
                                {...register("profilePic")}
                                onChange={(e) => handlefileChange(e)}
                            />
                        </Button>
                        {imagePreview && (
                            <div className='w-20 h-20 mb-2'>
                                <IoIosClose onClick={() => {
                                    setImagePreview(null);
                                    setIsImageUploaded(false);
                                    setCompanyData(prev => ({ ...prev, imageurl: null }));
                                }
                                } className='float-right cursor-pointer text-xl' />
                                <img src={imagePreview} alt="Uploaded Preview" className='' />
                            </div>)}

                    </div>
                    <div className='flex flex-col gap-y-1'>
                        <label htmlFor="description" className='text-md text-left font-semibold font-Roboto'>About us</label>
                        <textarea
                            id="description"
                            {...register("description")}
                            rows={4} cols={50}
                            className='focus:outline-none active:outline-none border-[1px] font-Lato rounded-md px-1 py-1 focus:border-customPurple '

                        />
                        {errors.description && (
                            <div className="text-red-600 text-left">{errors.description.message}</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-y-1' >
                        <label htmlFor="website" className='text-md text-left font-semibold font-Roboto'>Website(Optional)</label>
                        <input type="text"
                            id="website"
                            {...register("website")}
                            className='focus:outline-none active:outline-none border-[1px] rounded-md px-1 py-1 focus:border-customPurple '
                        />
                    </div>
                    <Button className='bg-customPurple mt-2' type="submit">{isSubmitting ? "submitting..." : "Submit"}</Button>
                </form>
            </div>
        </div>
    )
}