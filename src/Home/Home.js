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
    </div>
  );
};

export default Home;
