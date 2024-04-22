
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import background from "../../images/3.png";


function Waiting(props) {
    const user = useSelector(selectUser);
  
    return (
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          className="row justify-content-center"
          style={{
            padding: "20px",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "1200px",
          }}
        >
          <div className="col-md-6">
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                padding: "20px",
                borderRadius: "10px",
                width: "90%",
                maxWidth: "1200px",
              }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <b>Thank You For Submiting Your Application!</b>
                </h5>
                <br />
                <p className="card-text">
                  Your Profile has been sent for verification, Our team will contact you soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default Waiting;
