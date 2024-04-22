import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import background from "../images/3.png";

function AddPartner() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    axios
      .get("https://server.indowings.com/")
      .then((res) => {
        if (res.data.length > 0) {
          setPartners(res.data);
          setFilteredPartners(res.data); // Initialize filtered partners with all partners
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const toggleVerification = (partnerId) => {
    const updatedPartners = partners.map((partner) => {
      if (partner.id === partnerId) {
        return {
          ...partner,
          is_verified: partner.is_verified === 0 ? 1 : 0,
        };
      }
      return partner;
    });
    setPartners(updatedPartners);

    axios
      .put(`https://server.indowings.com/updateverify/${partnerId}`, {
        is_verified: updatedPartners.find((partner) => partner.id === partnerId)
          .is_verified,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Filter partners based on search query
  useEffect(() => {
    const filtered = partners.filter((partner) =>
      partner.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPartners(filtered);
  }, [searchQuery, partners]);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "1200px",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "5px" }}>
          {" "}
          Partner Credentials List
        </h3>
        <div style={{ textAlign: "right" }}>
          <Link to="/create" className="btn btn-success">
            {" "}
            Create +
          </Link>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "40%",
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <table
          className="table table-bordered table-hover"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Category</th>
              <th>Commission(%)</th>
              <th>Company Details</th>
              <th>Manage</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: isHovering ? "#f8f9fa" : "transparent",
                }}
              >
                <td>{partner.id}</td>
                <td>{partner.username}</td>
                <td>{partner.category}</td>
                <td>{partner.commission}</td>
                <td>View Details</td>
                <td>
                  <Link
                    to={`/read/${partner.id}`}
                    className="btn btn-sm btn-info"
                  >
                    Manage
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => toggleVerification(partner.id)}
                    className="btn btn-sm btn-primary"
                  >
                    {partner.is_verified === 0 ? "Approve" : "Discard"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/adminpage" className="btn btn-primary me-2">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddPartner;
