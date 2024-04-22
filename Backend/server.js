import express from "express";
import mysql from "mysql";
import cors from "cors";
// import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import fs from "fs";
import multer from "multer";
import jwt from 'jsonwebtoken';
// import sendMail from "./SendMail";
// import Randomstring from 'randomstring';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: 'partnerportal',
// });

const db = mysql.createConnection({
  host: "ls-b120627a54c35ec7aa532f95056b0e3ba1d5b806.cx8km2ky23qf.ap-south-1.rds.amazonaws.com",
  user: "dbmasteruser",
  password: "IndoWings",
  database: "partnerportal",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err.stack);
    return;
  }
  console.log("Connected to MySQL database as id " + db.threadId);
});

// app.get("/sendemail",sendMail);

// Login Partner
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  const sql = "SELECT * FROM partner WHERE username = ?";
  db.query(sql, [username], async (err, result) => {
    const user = result[0];
    console.log(user.username);
    console.log(user.password);
    console.log(user.category);
    console.log(user.commission);
    if (err) {
      return res.status(500).json({ message: "Error in server" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isValidPassword = password === user.password;
    console.log(isValidPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    return res.status(200).json({
      message: "Login successful",
      username: user.username,
      password: user.password,
      category: user.category,
      commission: user.commission,
      steps: user.steps,
      is_verified:user.is_verified,
    });
  });
});

// Partner Handling

app.get("/", (req, res) => {
  const sql = "SELECT * FROM partner";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.post("/partner", (req, res) => {
  const sql =
    "INSERT INTO partner (`username`, `password`,`category`,`commission`) VALUES (?)";
  console.log(req.body);
  const values = [
    req.body.username,
    req.body.password,
    req.body.category,
    req.body.commission,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});



app.post("/register", (req, res) => {
  const verificationToken = jwt.sign({ email: req.body.username }, 'your_secret_key', { expiresIn: '1h' });

  const sql =
    "INSERT INTO partner (username, password, verification_token) VALUES (?, ?, ?)";
  const values = [req.body.username, req.body.password, verificationToken];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res
        .status(500)
        .json({ error: "An error occurred during registration." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Registration successful. Please verify your email." });
  });
});

app.get("/read/:id", (req, res) => {
  const sql = "SELECT * FROM partner WHERE id =?";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.put("/update/:id", (req, res) => {
  const sql =
    "UPDATE partner SET `username`=?, `password`=?, `category`=?, `commission`=? WHERE id =?";
  const id = req.params.id;
  db.query(
    sql,
    [
      req.body.username,
      req.body.password,
      req.body.category,
      req.body.commission,
      id,
    ],
    (err, result) => {
      if (err) return res.json({ Message: "Error in server" });
      return res.json(result);
    }
  );
});

app.put("/updateverify/:id", (req, res) => {
  const sql =
    "UPDATE partner SET `is_verified`=? WHERE id =?";
  const id = req.params.id;
  db.query(
    sql,
    [
      req.body.is_verified,
      id,
    ],
    (err, result) => {
      if (err) return res.json({ Message: "Error in server" });
      return res.json(result);
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const sql = "DELETE FROM partner WHERE id =?";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

// Products Handling

app.get("/products_create", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.get("/products_filter", (req, res) => {
  const userCategory = req.query.category;
  console.log(userCategory);
  const sql = "SELECT * FROM products WHERE category = ?";
  db.query(sql, [userCategory], (err, result) => {
    if (err) return res.json({ message: "Error in server" });
    return res.json(result);
  });
});

// app.get('/products_filter', (req, res) => {
//     const partnerCategory = partner.category;
//     console.log(user.category);
//     const sql = 'SELECT * FROM products WHERE category = partnerCategory';
//     db.query(sql, [partnerCategory], (err, result) => {
//         if (err) {
//             return res.status(500).json({ Message: "Error in server" });
//         }
//         return res.json(result);
//     });
// });

app.post("/products", (req, res) => {
  const sql =
    "INSERT INTO products (`name`, `brochure`,`stock`,`retail_price`, `partner_price`,`category`) VALUES (?)";
  console.log(req.body);
  const values = [
    req.body.name,
    req.body.brochure,
    req.body.stock,
    req.body.retail_price,
    req.body.partner_price,
    req.body.category,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/read_products/:product_id", (req, res) => {
  const sql = "SELECT * FROM products WHERE product_id =?";
  const id = req.params.product_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.put("/update_products/:product_id", (req, res) => {
  const sql =
    "UPDATE products SET `name`=?, `brochure`=?, `stock`=?, `retail_price`=?, `partner_price`=?, `category`=? WHERE product_id =?";
  const id = req.params.product_id;
  const { name, brochure, stock, retail_price, partner_price, category } =
    req.body;
  db.query(
    sql,
    [name, brochure, stock, retail_price, partner_price, category, id],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ Message: "Error in server" });
      }
      return res.json(result);
    }
  );
});

app.delete("/delete_products/:product_id", (req, res) => {
  const sql = "DELETE FROM products WHERE product_id =?";
  const id = req.params.product_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

//Announcements Handling

app.get("/announce", (req, res) => {
  const sql = "SELECT * FROM announcements";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.post("/create_announcement", (req, res) => {
  const sql = "INSERT INTO announcements (`heading`, `description`) VALUES (?)";
  console.log(req.body);
  const values = [req.body.heading, req.body.description];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/read_announcement/:announce_id", (req, res) => {
  const sql = "SELECT * FROM announcements WHERE announce_id =?";
  const id = req.params.announce_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.put("/update_announcement/:announce_id", (req, res) => {
  const sql =
    "UPDATE announcements SET `heading`=?, `description`=? WHERE announce_id =?";
  const id = req.params.announce_id;
  db.query(sql, [req.body.heading, req.body.description, id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.delete("/delete_announcement/:announce_id", (req, res) => {
  const sql = "DELETE FROM announcements WHERE announce_id =?";
  const id = req.params.announce_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

//Partner Profile Handling

app.get("/allpartnersprofile", (req, res) => {
  const sql = "SELECT * FROM partners_profile";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.post("/loginUser", (req, res) => {
  const username = req.body.user;

  const sql = `SELECT * FROM partners_profile WHERE reg_email = ?`;

  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.json({ Message: "Error in server" });
    }
    return res.json(result);
  });
});

app.get("/read_profile/:profile_id", (req, res) => {
  const sql = "SELECT * FROM partners_profile WHERE profile_id =?";
  const id = req.params.profile_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.delete("/delete_profile/:profile_id", (req, res) => {
  const sql = "DELETE FROM partners_profile WHERE profile_id =?";
  const id = req.params.profile_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.post("/updateStep", (req, res) => {
  const { count, user } = req.body;

  console.log(count, user);
  const sql = `UPDATE partner SET steps = ? WHERE username = ?`;

  db.query(sql, [count, user], (err, result) => {
    if (err) {
      console.error("Error in server:", err);
      return res.json({ Message: "Error in server" });
    }
    return res.json({ Message: "Update successful" });
  });
});

app.post("/profile_insert", (req, res) => {
  const reg_email = req.body.reg_email;
  const sqlSelect = "SELECT * FROM partners_profile WHERE reg_email = ?";
  db.query(sqlSelect, [reg_email], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.length > 0) {
      // If the user with reg_email already exists, perform an update
      const sqlUpdate =
        "UPDATE partners_profile SET company_name = ?, website = ?, employees = ?, address = ?, state = ?, city = ? , pincode = ?, country_code = ?, reg_phone = ?, key_name = ?, key_email = ?, key_phone = ?, key_position = ?, industries = ? WHERE reg_email = ?";
      const values = [
        req.body.company_name,
        req.body.website,
        req.body.employees,
        req.body.address,
        req.body.state,
        req.body.city,
        req.body.pincode,
        req.body.country_code,
        req.body.reg_phone,
        req.body.key_name,
        req.body.key_email,
        req.body.key_phone,
        req.body.key_position,
        req.body.industries,
        reg_email,
      ];
      db.query(sqlUpdate, values, (err, result) => {
        if (err) {
          return res.json(err);
        }
        return res.json({ message: "Profile updated successfully." });
      });
    } else {
      // If the user with reg_email doesn't exist, perform an insert
      const sqlInsert =
        "INSERT INTO partners_profile (`company_name`, `website`, `employees`, `address`, `state` ,`city`,`pincode`, `country_code` ,  `reg_phone`, `key_name`, `key_email`, `key_phone`, `key_position`, `industries`, `reg_email`) VALUES (?)";
      const values = [
        req.body.company_name,
        req.body.website,
        req.body.employees,
        req.body.address,
        req.body.state,
        req.body.city,
        req.body.pincode,
        req.body.country_code,
        req.body.reg_phone,
        req.body.key_name,
        req.body.key_email,
        req.body.key_phone,
        req.body.key_position,
        req.body.industries,
        reg_email,
      ];
      db.query(sqlInsert, [values], (err, result) => {
        if (err) {
          return res.json(err);
        }
        return res.json({ message: "Profile inserted successfully." });
      });
    }
  });
});

// Legal Info
app.get("/get-document/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT document FROM legal_info WHERE info_id = ?",
    id,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching document");
      } else {
        // Assuming the document is stored as a file path in the database
        const filePath = results[0].document;

        // Read the file asynchronously
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error reading document");
          } else {
            // Convert the file data to a base64-encoded string
            const base64Data = data.toString("base64");
            const pdfContent = `data:application/pdf;base64,${base64Data}`;
            res.send(pdfContent);
          }
        });
      }
    }
  );
});

// Initialize multer with the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename
  },
});

const upload = multer({ storage: storage });

// Handle file upload and create legal info
app.post("/create-info", upload.single("document"), (req, res) => {
  const { info_email } = req.body;
  const documentPath = req.file.path; // Get the path of the uploaded file

  const INSERT_INFO_QUERY = `INSERT INTO legal_info (info_email, document) VALUES (?, ?)`;
  db.query(INSERT_INFO_QUERY, [info_email, documentPath], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating legal info");
    } else {
      res.status(201).send("Legal info created successfully");
    }
  });
});

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

const uploadPdf = multer({ dest: "uploadPdf/" });

app.post("/uploadPdf", uploadPdf.single("file"), (req, res) => {
  const info_email = req.body.email;
  const documentPath = req.file.path;

  try {
    const sql = "INSERT INTO legal_info (info_email, document) VALUES (?, ?)";
    db.query(sql, [info_email, documentPath], (err, result) => {
      if (err) {
        console.error("Error uploading PDF to MySQL:", err);
        res.status(500).send("Error uploading PDF");
        return;
      }
      console.log("PDF uploaded to MySQL");
      res.status(200).send("PDF uploaded successfully");
    });
  } catch (e) {
    console.log("err--->", e);
  }
});

// Get All Legal Info
app.get("/legal-info", (req, res) => {
  const SELECT_ALL_INFO_QUERY = "SELECT * FROM legal_info";
  db.query(SELECT_ALL_INFO_QUERY, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching legal info");
    } else {
      // Convert blob data to Base64 encoding
      const legalInfoWithBase64 = results.map((info) => ({
        ...info,
        document: Buffer.from(info.document).toString("base64"),
      }));

      res.status(200).json(legalInfoWithBase64);
    }
  });
});

//Target Handling

// Route to insert target data
app.post("/api/targets", (req, res) => {
  const { target_email, target_amount, month, year } = req.body;
  const query =
    "INSERT INTO targets (target_email, target_amount, month, year) VALUES (?, ?, ?, ?)";
  db.query(query, [target_email, target_amount, month, year], (err, result) => {
    if (err) {
      console.error("Error inserting target data:", err);
      res.status(500).send("Error inserting target data");
    } else {
      console.log("Target data inserted successfully");
      res.status(200).send("Target data inserted successfully");
    }
  });
});

// Route to fetch target data
app.get("/api/targets/:email/:year/:month", (req, res) => {
  const { email, year, month } = req.params;
  const query =
    "SELECT * FROM targets WHERE target_email = ? AND year = ? AND month = ?";
  db.query(query, [email, year, month], (err, result) => {
    if (err) {
      console.error("Error fetching target data:", err);
      res.status(500).send("Error fetching target data");
    } else {
      console.log("Target data fetched successfully");
      res.status(200).json(result);
    }
  });
});

//Orders Handling

// app.get('/allorders', (req, res) => {
//     const sql = 'SELECT * FROM orders';
//     db.query(sql,(err,result)=>{
//         if(err) return res.json({Message: "Error in server"});
//         return res.json(result);
//     })
// });

app.get("/allorders", (req, res) => {
  db.query("SELECT * FROM orders", (error, results, fields) => {
    if (error) {
      console.error("Error fetching orders:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching orders" });
    }

    try {
      const orders = results.map((row) => {
        if (row.product) {
          row.product = JSON.parse(row.product);
        }
        return row;
      });

      res.setHeader("Content-Type", "application/json");
      res.json(orders);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res
        .status(500)
        .json({ error: "An error occurred while processing data" });
    }
  });
});

app.post("/orders", (req, res) => {
  const { order_email, order_date, order_status, product, total_price } =
    req.body;

  const productData = JSON.stringify(product);

  const sql = `INSERT INTO orders (order_email, order_date, order_status, product, total_price) VALUES (?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [order_email, order_date, order_status, productData, total_price],
    (err, result) => {
      if (err) {
        console.error("Error placing order:", err);
        return res
          .status(500)
          .json({ error: "Error placing order. Please try again later." });
      }
      console.log("Order placed successfully:", result.insertId);
      res.status(201).json({
        message: "Order placed successfully!",
        orderId: result.insertId,
      });
    }
  );
});

app.get("/read_order/:order_id", (req, res) => {
  const sql = "SELECT * FROM orders WHERE order_id =?";
  const id = req.params.order_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.put("/edistatus/:order_id", (req, res) => {
  const sql = "UPDATE orders SET `order_status`=? WHERE order_id =?";
  const id = req.params.order_id;
  db.query(sql, [req.body.order_status, id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.delete("/delete_order/:order_id", (req, res) => {
  const sql = "DELETE FROM orders WHERE order_id =?";
  const id = req.params.order_id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});

app.get("/fetchCompany", (req, res) => {
  const sql = "SELECT * FROM company_kyc";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error in server" });
    return res.json(result);
  });
});
app.post("/getSingleCompany", (req, res) => {
  const user = req.body.user;
  const sql = "SELECT * FROM company_kyc WHERE reg_email =?";

  db.query(sql, [user], (err, result) => {
    if (err) {
      console.log("err-->", err);
      return res.json({ Message: "Error in server" });
    }
    return res.json(result);
  });
});

app.post("/getDirectors", (req, res) => {
  const user = req.body.companyId;
  const sql = "SELECT * FROM directors WHERE company_id =?";

  db.query(sql, [user], (err, result) => {
    if (err) {
      console.log("err-->", err);
      return res.json({ Message: "Error in server" });
    }
    const data = result;
    let obj = {};
    data.map((dir, ind) => {
      const OBJ = { ...dir };
      obj[`Dir_${ind + 1}`] = OBJ;
    });

    return res.json(obj);
  });
});

app.get("/read_form/:id", (req, res) => {
  const sql = "SELECT * FROM company_kyc WHERE id =?";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json([]);
    return res.json(result);
  });
});

app.get("/fetchDirectors/:id", (req, res) => {
  const companyId = req.params.id;
  const sql = `
    SELECT d.*
    FROM directors d
    JOIN company_kyc c ON d.company_id = c.id
    WHERE c.id = ?
  `;
  db.query(sql, [companyId], (err, result) => {
    if (err) {
      console.error("Error fetching directors:", err);
      return res.status(500).json({ error: "Error in server" });
    }
    return res.json(result);
  });
});

app.post("/fetchRegDetails", (req, res) => {
  const username = req.body.user;

  const sql = `SELECT * FROM company_kyc WHERE reg_email = ?`;

  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.json({ Message: "Error in server" });
    }
    return res.json(result);
  });
});

app.post("/submitform", async (req, res) => {
  try {
    const sqlSelect = "SELECT * FROM company_kyc WHERE reg_email = ?";
    await db.query(sqlSelect, [req.body.reg_email], async (err, result) => {
      if (err) {
        console.log("err-->", err);
        return res.json(err);
      }

      if (result.length === 0) {
        console.log("run");
        // If the user with reg_email doesn't exist, perform an insert
       
        const sqlInsertCompany =
          "INSERT INTO company_kyc (type_of_company, name_of_entity, pan_number, gstin, bank_details, ifsc_code, incorporation_certificate, pan_card, gstin_certificate, cancelled_cheque, reg_email,no_of_directors, incorporation_date, BankName, BranchName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const valuesCompany = [
          req.body.type_of_company,
          req.body.name_of_entity,
          req.body.pan_number,
          req.body.gstin,
          req.body.bank_details,
          req.body.ifsc_code,
          req.body.incorporation_certificate,
          req.body.pan_card,
          req.body.gstin_certificate,
          req.body.cancelled_cheque,
          req.body.reg_email,
          req.body.no_of_directors,
          req.body.incorporation_date,
          req.body.BankName,
          req.body.BranchName,
        ];
        await db.query(sqlInsertCompany, valuesCompany, (err, result) => {
          if (err) {
            console.log("err in adding a company-->", err);
            return res.json(err);
          }
          // Insert into directors table
          const company_id = result.insertId;

          const directors = req.body.directors;
          
          Object.keys(directors).map(async (dir, ind) => {
            const sqlInsertDirectors =
              "INSERT INTO directors (company_id, DIN, name, PAN, Aadhar, mobile, email, pan_file, aadhar_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const valuesDirectors = [
              company_id,
              directors[`${dir}`].DIN,
              directors[`${dir}`].name,
              directors[`${dir}`].PAN,
              directors[`${dir}`].Aadhar,
              directors[`${dir}`].mobile,
              directors[`${dir}`].email,
              directors[`${dir}`].pan_file,
              directors[`${dir}`].aadhar_file,
            ];

            console.log("val-->", valuesDirectors);

            await db.query(
              sqlInsertDirectors,
              valuesDirectors,
              (err, result) => {
                if (err) {
                  console.log("err in adding a director--->", err);
                  return res.json(err);
                }
              }
            );
          });

          return res.json({ message: "Data inserted successfully." });
        });
      } else {
        console.log("else")
        // If the user with reg_email already exists, perform an update
        const doc = result[0];
        const sqlUpdateCompany =
          "UPDATE company_kyc SET type_of_company=?, name_of_entity=?, pan_number=?, gstin=?, bank_details=?, ifsc_code=?, incorporation_certificate=?, pan_card=?, gstin_certificate=?, cancelled_cheque=?, no_of_directors=?, incorporation_date=?, BankName=? , BranchName=? WHERE reg_email=?";
        const valuesUpdateCompany = [
          req.body.type_of_company,
          req.body.name_of_entity,
          req.body.pan_number,
          req.body.gstin,
          req.body.bank_details,
          req.body.ifsc_code,
          req.body.incorporation_certificate,
          req.body.pan_card,
          req.body.gstin_certificate,
          req.body.cancelled_cheque,
          req.body.no_of_directors,
          req.body.incorporation_date,
          req.body.BankName,
          req.body.BranchName,
          req.body.reg_email,
        ];
        console.log(valuesUpdateCompany);
        db.query(sqlUpdateCompany, valuesUpdateCompany, (err, result) => {
          if (err) {
            console.log("err in updating a company-->", err);
            return res.json(err);
          }
          console.log('res-->',result);
          const company_id = doc.id;
          const directors = req.body.directors;
          Object.keys(directors).map((dir, ind) => {
            if (directors[`${dir}`]?.id) {
              const sqlInsertDirectors =
                "UPDATE directors SET company_id =?, DIN =?, name =?, PAN =?,Aadhar =? ,mobile =?,  email =?, pan_file =?, aadhar_file =? WHERE id =?";
              const valuesDirectors = [
                company_id,
                directors[`${dir}`].DIN,
                directors[`${dir}`].name,
                directors[`${dir}`].PAN,
                directors[`${dir}`].Aadhar,
                directors[`${dir}`].mobile,
                directors[`${dir}`].email,
                directors[`${dir}`].pan_file,
                directors[`${dir}`].aadhar_file,
                directors[`${dir}`].id,  // Add id as the last parameter
              ];
              db.query(sqlInsertDirectors, valuesDirectors, (err, result) => {
                if (err) {
                  console.log("err in adding a director--->", err);
                  return res.json(err);
                }
              });
            } else {
              const sqlInsertDirectors =
                "INSERT INTO directors (company_id, DIN, name, PAN, Aadhar, mobile, email, pan_file, aadhar_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ";
              const valuesDirectors = [
                company_id,
                directors[`${dir}`].DIN,
                directors[`${dir}`].name,
                directors[`${dir}`].PAN,
                directors[`${dir}`].Aadhar,
                directors[`${dir}`].mobile,
                directors[`${dir}`].email,
                directors[`${dir}`].pan_file,
                directors[`${dir}`].aadhar_file,
              ];
              db.query(sqlInsertDirectors, valuesDirectors, (err, result) => {
                if (err) {
                  console.log("err in adding a director--->", err);
                  return res.json(err);
                }
              });
            }
          });
          return res.json({ message: "Data updated successfully." });
        });
      }
    });
  } catch (e) {
    console.log("err-->", e);
  }
});


//   // Delete Legal Info by ID
//   app.delete('/legal-info/:id', (req, res) => {
//     const { id } = req.params;
//     const DELETE_INFO_QUERY = 'DELETE FROM legal_info WHERE info_id = ?';
//     db.query(DELETE_INFO_QUERY, [id], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error deleting legal info');
//       } else {
//         res.status(200).send('Legal info deleted successfully');
//       }
//     });
//   });

app.listen(3307, () => {
  console.log("Listening: server is live");
});