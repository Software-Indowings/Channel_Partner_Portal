import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import background from "../../images/3.png";


function ReadForm(props) {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [directors, setDirectors] = useState([]); // Corrected: Change to array
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://server.indowings.com/read_form/${id}`)
      .then((res) => {
        console.log("Profile Data:", res.data);
        setProfile(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`https://server.indowings.com/fetchDirectors/${profile.id}`) // Changed companyId to profile.id
      .then((res) => {
        if (res.data.length > 0) {
          console.log("Directors Data:", res.data);
          setDirectors(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [profile.id]); // Changed companyId to profile.id

  //   const handleDelete = (profile_id) => {
  //     axios
  //       .delete(`https://server.indowings.com/delete_profile/${profile_id}`)
  //       .then((res) => {
  //         navigate("/admin_profile");
  //       })
  //       .catch((err) => console.log(err));
  //   };

  return (
    <div
    className="d-flex flex-column vh-100 justify-content-center align-items-center"
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      minHeight: "100vh",
      width: "max",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}
  >
      <div 
    //   className="w-75 bg-white rounded p-5"
       style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        padding: "20px",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "1200px",
      }}>
        <h3 className="mb-4">Registration Details:</h3>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{profile.id}</td>
            </tr>
            <tr>
              <th>Type of Company:</th>
              <td>{profile.type_of_company}</td>
            </tr>
            <tr>
              <th>Company Name:</th>
              <td>{profile.name_of_entity}</td>
            </tr>
            <tr>
              <th>Registered Email ID:</th>
              <td>{profile.reg_email}</td>
            </tr>
            <tr>
              <th>PAN Number:</th>
              <td>{profile.pan_number}</td>
            </tr>
            <tr>
              <th>GSTIN:</th>
              <td>{profile.gstin}</td>
            </tr>
            <tr>
              <th>Date of Incorporation:</th>
              <td>{profile.incorporation_date?.split("T")[0]}</td>
            </tr>
            <tr> 
              <th>Account Number:</th>
              <td>{profile.bank_details}</td>
            </tr>
            <tr>
              <th>Bank Name:</th>
              <td>{profile.BankName}</td>
            </tr>
            <tr>
              <th>Branch Name</th>
              <td>{profile.BranchName}</td>
            </tr>
            <tr>
              <th>IFSC Code:</th>
              <td>{profile.ifsc_code}</td>
            </tr>
           
          </tbody>
        </table>
        <h3 className="mb-4">Directors:</h3>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>DIN</th>
              <th>PAN</th>
              <th>Aadhar</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
            {directors.map((director, index) => (
              <tr key={index}>
                <td>{director.company_id}</td>
                <td>{director.name}</td>
                <td>{director.DIN}</td>
                <td>{director.PAN}</td>
                <td>{director.Aadhar}</td>
                <td>{director.mobile}</td>
                <td>{director.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Link to="/displayform" className="btn btn-primary me-2">
            Back
          </Link>
          {/* <Link to={`/update_profiles/${profile.profile_id}`} className='btn btn-primary mx-2'>Edit</Link> */}
          {/* <div className="d-flex justify-content-end">
            <button
              onClick={() => handleDelete(profile.profile_id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default ReadForm;
