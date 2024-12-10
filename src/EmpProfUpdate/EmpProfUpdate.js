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
    profile_pic: "", // Add profile_pic to state
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const employeeId =
    sessionStorage.getItem("user_id") || sessionStorage.getItem("employerId"); // Get user_id from sessionStorage

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employees/${employeeId}`
      );
      const employeeData = response.data;
      setEmployee(employeeData);

      // Update sessionStorage with profile picture and user details
      sessionStorage.setItem("profilePic", employeeData.profile_pic);
      sessionStorage.setItem("firstName", employeeData.firstName);
      sessionStorage.setItem("lastName", employeeData.lastName);
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

      const response = await axios.put(
        `http://localhost:5000/api/employees/${employeeId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully!");
      fetchEmployeeDetails(); // Refresh the profile data

      // If profile photo was updated, update sessionStorage
      if (profilePhoto) {
        sessionStorage.setItem("profilePic", response.data.profile_pic);
      }
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
            value={
              employee.phoneNumber || Math.floor(Math.random() * 1000000000)
            }
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
