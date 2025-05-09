import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { FaPlus, FaGlobe, FaBuilding, FaInfoCircle } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from "@/hooks/use-toast"

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
    const { toast } = useToast();
    const { authState, setAuthState } = useAuth();
    let location = useLocation();
    const navigate = useNavigate();
    const companyId = location.pathname?.split('/')[3] || null;
    console.log("companyId is", companyId);
    useEffect(() => {
        if (authState.role !== 'admin' && authState.role !== 'recruiter') {
            navigate('/');
        }

    }, [authState]);
    useEffect(() => {
        if (!authState.loading && !companyId && authState.id) {
            const fetchData = async () => {
                try {
                    console.log("authstateid,", authState.id);
                    const res = await axios.get(`http://localhost:8000/getcompanybyuserid/${authState.id}`)
                    console.log("res", res);
                    if (res.data.success) {
                        navigate(`/company/${res.data.data.company_id}`)
                    }
                } catch (err) {
                    console.log('error finding company by user id ', err);
                }
            };
            fetchData();
        }
    }, [authState.loading, authState.id]);
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
        if (companyId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/getonecompany/${companyId}`);
                    console.log(response.data);
                    setCompanyData(response.data);
                    reset({
                        company_name: response.data.company.company_name,
                        description: response.data.company.description,
                        website: response.data.company.website,
                    })
                    setImagePreview(response.data.company.imageurl);
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
        formData.append("employer_id", authState.id);
        if (companyId && companyData.imageurl) {
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
            if (companyId) {
                // console.log("companyIddd", companyId);
                formData.append("id", companyId);
                response = await axios.put("http://localhost:8000/updateonecompany", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            else {
                response = await axios.post("http://localhost:8000/addcompany", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

            }
            // console.log("Success:", response.data);
            if (response.status === 201) {
                reset();
                navigate(`/company/${response.data.data.company_id}`)
                setImagePreview(null);
                setIsImageUploaded(false);
                setCompanyData(null);
            }
        } catch (error) {
            toast({
                title: "Oops!",
                description: 'Error adding company',
                variant: "destructive"
            })
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        {companyId ? 'Update Company' : 'Add New Company'}
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="company_name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaBuilding className="text-customPurple" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                id="company_name"
                                {...register("company_name")}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent transition-all duration-200"
                                placeholder="Enter your company name"
                            />
                            {errors.company_name && (
                                <p className="text-sm text-red-500">{errors.company_name.message}</p>
                            )}
                        </div>

                        {/* Profile Picture Upload */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaPlus className="text-customPurple" />
                                Company Logo
                            </label>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    className={`relative ${isImageUploaded
                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                        : 'bg-customPurple/10 text-customPurple hover:bg-customPurple/20'
                                        } transition-all duration-200 border-2 border-customPurple/20`}
                                    disabled={isImageUploaded}
                                >
                                    <label htmlFor="upload" className="flex items-center gap-2 cursor-pointer px-4 py-2">
                                        {isImageUploaded ? (
                                            <span className="text-green-600 font-medium">Image uploaded</span>
                                        ) : (
                                            <>
                                                <FaPlus className="text-customPurple" />
                                                <span className="font-medium">Upload Logo</span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id="upload"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        {...register("profilePic")}
                                        onChange={handlefileChange}
                                    />
                                </Button>

                                {imagePreview && (
                                    <div className="relative w-20 h-20">
                                        <img
                                            src={imagePreview}
                                            alt="Company Logo Preview"
                                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setIsImageUploaded(false);
                                                setCompanyData(prev => ({ ...prev, imageurl: null }));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <IoIosClose className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About Us Field */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaInfoCircle className="text-customPurple" />
                                About Us
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Tell us about your company..."
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Website Field */}
                        <div className="space-y-2">
                            <label htmlFor="website" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaGlobe className="text-customPurple" />
                                Website (Optional)
                            </label>
                            <input
                                type="text"
                                id="website"
                                {...register("website")}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent transition-all duration-200"
                                placeholder="https://your-company.com"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-customPurple hover:bg-customPurple/90 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                companyId ? 'Update Company' : 'Create Company'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
