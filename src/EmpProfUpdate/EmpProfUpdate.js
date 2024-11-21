import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmpProfUpdate.css";

const ProfileUpdate = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const employeeId = sessionStorage.getItem("employeeId");

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employees/${employeeId}`
      );
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", employee.firstName);
      formData.append("lastName", employee.lastName);
      formData.append("email", employee.email);
      formData.append("phoneNumber", employee.phoneNumber);
      formData.append("location", employee.location);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      await axios.put(
        `http://localhost:5000/api/employees/${employeeId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully!");
      fetchEmployeeDetails(); // Refresh the profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="profile-update-container">
      <h2>Update Profile</h2>
      <form className="profile-update-form" onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={employee.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={employee.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={employee.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={employee.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={employee.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePhoto">Profile Photo</label>
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </div>
        <button type="submit" className="update-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
