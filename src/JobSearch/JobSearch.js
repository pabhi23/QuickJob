import React from "react";
import companyLogos from "./companyLogos"; // Assume an array of company logo URLs
import "./JobSearch.css";

const JobSearch = () => {
  return (
    <div className="job-search-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Your Dream Job</h1>
        <p>Search and apply for jobs from top companies worldwide.</p>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <div className="filter-section">
          <h3>Filter by Category</h3>
          <select className="filter-dropdown">
            <option value="all">All Categories</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Filter by Location</h3>
          <ul className="location-list">
            <li>Remote</li>
            <li>Florida</li>
            <li>New York</li>
          </ul>
        </div>
      </div>

      {/* Company Logos Carousel */}
      <div className="carousel-container">
        <h2>Top Companies Hiring</h2>
        <div className="carousel">
          {companyLogos.map((logo, index) => (
            <div className="logo-wrapper" key={index}>
              <img
                src={logo}
                alt={`Company Logo ${index}`}
                className="company-logo"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Job Listings */}
      <div className="job-listings">
        <h2>Available Jobs</h2>
        <div className="job-item">
          <h3>Backend Developer</h3>
          <p>Location: New York</p>
          <p>
            We are looking for a backend developer with experience in
            JavaScript, Node.js, and MongoDB...
          </p>
          <button className="details-button">More Details</button>
        </div>

        {/* Additional job listings can go here */}
      </div>
    </div>
  );
};

export default JobSearch;
