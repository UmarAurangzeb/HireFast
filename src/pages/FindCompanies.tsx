import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function FindCompanies() {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const { toast } = useToast();

    const fetchCompanies = async (query) => {
        try {
            const res = await axios.get(`http://localhost:8000/getfewcompanies/${query}`);
            setCompanies(res.data.data);
            setErrorMessage("");
        } catch (error) {
            setCompanies([]); // Clear the companies list if an error occurs
            setErrorMessage("No Company found");
        }
    };

    // Initial Fetch
    useEffect(() => {
        fetchCompanies("5"); // Fetch default data initially
    }, []);

    // Form Submit Logic
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        const query = searchQuery.trim().length > 0 ? searchQuery : "4";
        await fetchCompanies(query);
        setSearchQuery(""); // Reset search query to default
    };

    return (
        <div className="pt-20 flex flex-col items-center bg-gray-50 min-h-screen">
            <div className="w-full max-w-6xl flex flex-col items-center">
                <form
                    className="w-full flex justify-center items-center"
                    onSubmit={handleSubmit} // Form submit handler
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                        placeholder="Search for companies..."
                        className="w-full max-w-4xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-customPurple"
                    />
                    <Button type="submit" className="bg-customPurple ml-2 mt-[2px]">
                        Submit
                    </Button>
                </form>
            </div>

            <div className="h-[100vh] w-[95%] mt-4 border-2 rounded-md bg-customWhite shadow-md">
                <div>
                    <h1 className="text-center font-semibold font-Lato text-2xl">Companies</h1>
                </div>
                <div>
                    {companies.length > 0 ? (
                        companies.map((company) => (
                            <Link to={`/company/${company.company_id}`} key={company.company_id}>
                                <div className="flex bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 rounded-md hover:bg-gradient-to-r hover:from-blue-200 hover:via-purple-200 hover:to-blue-100 cursor-pointer mt-2 mx-2">
                                    <Avatar className="w-20 h-20 border-1 rounded-full border-black overflow-hidden flex items-center justify-center">
                                        <AvatarImage
                                            src={company.imageurl}
                                            alt={company.name || "Company"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <h1 className="my-auto text-center flex-1 text-xl font-Roboto">
                                        {company.company_name}
                                    </h1>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-4">{errorMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
