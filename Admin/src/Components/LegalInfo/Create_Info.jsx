import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Create_Info() {
  const [values, setValues] = useState({
    email: "",
    document: null,
    documentURL: "", 
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("info_email", values.email);
    formData.append("document", values.document);

    axios
      .post("https://server.indowings.com/create-info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/legalinfo");
      })
      .catch((err) => console.log(err));
  };

  const handleFileChange = (e) => {
    setValues({
      ...values,
      document: e.target.files[0],
      documentURL: URL.createObjectURL(e.target.files[0]), 
    });
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-5">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4">Add Legal Document</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="info_email"
              placeholder="Enter Email"
              className="form-control"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="document" className="form-label">
              Document
            </label>
            <input
              type="file"
              id="document"
              name="document"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          {/* Display blob URL as PDF or image */}
          {values.documentURL && (
            <div className="mb-3">
              {values.document.type === "application/pdf" ? (
                <embed
                  src={values.documentURL}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <img
                  src={values.documentURL}
                  alt="Document"
                  style={{ maxWidth: "100%" }}
                />
              )}
            </div>
          )}
          <div className="mb-3">
            <Link to="/legalinfo" className="btn btn-secondary me-2">
              Back
            </Link>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create_Info;
