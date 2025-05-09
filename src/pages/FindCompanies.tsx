import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function FindCompanies() {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [searchError, setSearchError] = useState("");

    const fetchCompanies = async (query) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/getfewcompanies/${query}`);
            setCompanies(res.data.data);
            setErrorMessage("");
        } catch (error) {
            setCompanies([]);
            setErrorMessage("No companies found matching your search");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies("5");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchQuery.trim().length < 2) {
            setSearchError("Please enter at least 2 characters to search.");
            return;
        }
        setSearchError("");
        const query = searchQuery.trim().length > 0 ? searchQuery : "4";
        await fetchCompanies(query);
    };

    return (
        <div className="pt-24 pb-12 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="w-full max-w-6xl px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Discover Companies</h1>

                <form
                    className="w-full flex justify-center items-center gap-2 mb-8"
                    onSubmit={handleSubmit}
                    role="search"
                    aria-label="Search companies"
                >
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value.length >= 2) setSearchError("");
                            }}
                            placeholder="Search companies by name, industry, or location..."
                            className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent shadow-sm"
                            aria-label="Search companies"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <Button
                        type="submit"
                        className="bg-customPurple hover:bg-customPurple/90 px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-customPurple"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                        Search
                    </Button>
                </form>
                {searchError && (
                    <div className="text-red-600 text-center mb-4">{searchError}</div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customPurple"></div>
                        </div>
                    ) : companies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {companies.map((company) => (
                                <Link
                                    to={`/company/${company.company_id}`}
                                    key={company.company_id}
                                    className="transform transition-all duration-200 hover:scale-[1.03] focus:scale-[1.03] outline-none focus:ring-2 focus:ring-customPurple rounded-xl"
                                    tabIndex={0}
                                    aria-label={`View details for ${company.company_name}`}
                                >
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 hover:shadow-lg focus:shadow-lg transition-all duration-200">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="w-16 h-16 border-2 border-white shadow-md overflow-hidden">
                                                <AvatarImage
                                                    src={company.imageurl}
                                                    alt={company.name || "Company"}
                                                    className="w-full h-full object-cover"
                                                />
                                                <AvatarFallback className="bg-customPurple text-white w-full h-full flex items-center justify-center">
                                                    {company.company_name?.charAt(0) || "C"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {company.company_name}
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    {company.industry || "Technology"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">{errorMessage}</p>
                            <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
