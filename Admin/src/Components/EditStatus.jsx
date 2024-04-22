import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import background from "../images/3.png";

function EditStatus(props) {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [values, setValues] = useState({
    order_status: "",
  });

  const handleUpdate = (event) => {
    event.preventDefault();
    axios
      .put(`https://server.indowings.com/edistatus/${order_id}`, values)
      .then((res) => {
        console.log(res);
        navigate("/orders");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`https://server.indowings.com/read_order/${order_id}`)
      .then((res) => {
        setOrder(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, [order_id]);

  const handleDelete = (order_id) => {
    axios.delete(`https://server.indowings.com/delete_order/${order_id}`)
        .then(res => {
            navigate('/orders');
        })
        .catch(err => console.log(err))
}

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleUpdate}>
          <h2>Update Status  <button onClick={() => handleDelete(order.order_id)} 
          className='btn btn-danger ms-2'> Delete Order</button>
             </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <p>Order ID: {order.order_id}</p>
            <p>Email: {order.order_email}</p>
            <p>Date: {order.order_date}</p>
            {/* <p>Products:</p> */}
            {/* <ul>
              {Array.isArray(order.product) && order.product.length > 0 ? (
                order.product.map((product, index) => (
                  <li key={index}>
                    {product.name} - Quantity: {product.count}
                  </li>
                ))
              ) : (
                <li>No products found</li>
              )}
            </ul> */}
            <label htmlFor="status">Change Status:</label>
            <select
              id="status"
              value={values.order_status}
              onChange={(e) =>
                setValues({ ...values, order_status: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <option value="">--select--</option>
              <option value="pending">Pending</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Shipped">Shipped</option>
              <option value="Success">Success</option>
              <option value="In process">In process</option>
            </select>
          </div>

          <Link
            to="/orders"
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Back
          </Link>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
              cursor: "pointer",
              textDecoration: "none",
              backgroundColor: "#28a745",
              color: "#fff",
            }}
          >
            Update
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default EditStatus;
