import React from "react";

const HeroSection = ({ jobData, setJobData, handleSearchChange, searchQuery, selectedFilter, setSelectedFilter }) => {
  return (
    <div className="flex justify-center items-center pt-52">
      <div className="text-center py-46 relative">
        <span className="mx-auto px-6 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium font-Lato">
          Job Hunt !!
        </span>
        <h1 className="text-6xl font-Montserrat font-bold mt-4">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-customPurple">Dream Jobs</span>
        </h1>

        <div className="flex lg:relative">
          <div className="flex justify-center items-center w-3/4 lg:w-full max-w-[600px] mx-auto mt-8 border border-gray-300 rounded-full shadow-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e)}
              placeholder="Search Jobs"
              className="outline-none border-none w-full py-2 px-4 placeholder-gray-400"
            />
            <button className="bg-customPurple text-customWhite py-2 px-6 rounded-full hover:drop-shadow-lg transition duration-200 ease-in-out font-Lato">
              Search
            </button>
          </div>
          <div className="flex items-center justify-center h-0 mt-[52px] lg:ml-4 lg:absolute lg:right-[-140px]">
            <select
              name="filter"
              id="filter"
              value={selectedFilter}
              onChange={(e) => { setSelectedFilter(e.target.value) }}
              className="bordertext-center font-Lato px-4 w-36 shadow-md inline-block focus:ring-2 focus:ring-customPurple focus:outline-none border-2 border-gray-400 focus:border-gray-50 rounded-lg cursor-pointer hover:bg-customWhite text-center py-2"
            >
              <option value="" disabled>
                Select Filter
              </option>
              <option value="all">All</option>
              <option value="applied">Applied</option>
              <option value="notapplied">Not Applied</option>
              <option value="onsite">On Site</option>
              <option value="remote">Remote</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="low-to-high">Number of Applicants (Low to High)</option>
              <option value="high-to-low">Number of Applicants (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
