import React from 'react';
import './Home.css';
import companyLogos from './companyLogos';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-image">
        <div className="overlay">
          <h1>Find Your Dream Job</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search for jobs..." className="search-input" />
            <button className="search-button">Search</button>
          </div>
        </div>
      </div>

      <div className="carousel-container">
        <h2>Top Companies Hiring</h2>
        <div className="carousel">
          {companyLogos.map((logo, index) => (
            <img src={logo} alt={`Company Logo ${index}`} className="company-logo" key={index} />
          ))}
        </div>
      </div>

      {/* Job Listing Section */}
      <div className="job-listing-container">
        <div className="filter-section">
          <h3>Filter job by category</h3>
          <select className="filter-dropdown">
            <option value="">Category</option>
            <option value="backend">Backend Developer</option>
            <option value="frontend">Frontend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
          </select>

          <h3>Filter job by location</h3>
          <ul className="location-list">
            <li>Remote</li>
            <li>Florida</li>
            <li>New York</li>
          </ul>
        </div>

        <div className="job-listings">
          <div className="job-card">
            <p className="job-location"> New York</p>
            <h3 className="job-title">Backend Developer</h3>
            <p className="job-type">Fullstack</p>
            <p className="job-description">
              Description: We are looking for a backend developer who has good knowledge of
              JavaScript and...
            </p>
            <button className="job-details-button">+ More Details</button>
          </div>

          <div className="job-card">
            <p className="job-location">Remote</p>
            <h3 className="job-title">Frontend Developer</h3>
            <p className="job-type">Frontend</p>
            <p className="job-description">
              Description: We are looking for a frontend developer who has good knowledge of
              JavaScript and...
            </p>
            <button className="job-details-button">+ More Details</button>
          </div>

          <div className="job-card">
            <p className="job-location"> Florida</p>
            <h3 className="job-title">Frontend Developer</h3>
            <p className="job-type">Frontend</p>
            <p className="job-description">
              Description: We are looking for a frontend developer who has good knowledge of
              JavaScript and...
            </p>
            <button className="job-details-button">+ More Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
