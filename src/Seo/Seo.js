import React from 'react';
import { Helmet } from 'react-helmet';

const Seo = () => {
  return (
    <Helmet>
      <title>QuickJob - Find and Post Jobs Effortlessly</title>
      <meta name="description" content="QuickJob is your go-to job search application that allows employers to post job listings and recruit talent, while employees can create resumes, give mock tests, apply for jobs, save job listings, and become premium members." />
      <meta name="keywords" content="jobs, employment, career, job search, job posting, resume, mock tests, premium membership" />
      <meta name="author" content="QuickJob" />
    </Helmet>
  );
};

export default Seo;
