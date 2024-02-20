require("dotenv").config();
const axios = require("axios");
const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;
const session = require("express-session");
// Require the PDFKit library
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Configure session middleware
app.use(
  session({
    secret: "secret_key", // Use a real secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  })
);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
// Initialize MongoDB Client
const mongoClient = new MongoClient(process.env.MONGO_URI, {});

let db;
let db2;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db("Milestone");
    db2 = mongoClient.db("mftransactiondb");
    db3 = mongoClient.db("mftransactiondb");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

// Middleware to provide db access
function dbAccess(req, res, next) {
  req.db = db;
  req.db2 = db2;
  next();
}

app.use(dbAccess); // Use the middleware

// Now, in your route handlers, you can access the database connection via `req.db`
app.get("/auth/zoho", (req, res) => {
  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${process.env.ZOHO_CLIENT_ID}&scope=Aaaserver.profile.Read&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&access_type=offline`;
  res.redirect(authUrl);
});

app.get("/auth/zoho/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          redirect_uri: process.env.ZOHO_REDIRECT_URI,
          code: code,
        },
      }
    );

    // Assuming response.data contains the user information
    // Create session here
    req.session.user = response.data; // Store user data in session
    // res.status(200).json({ loggedIn: true });
    res.redirect("/");
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/user/checkLoggedIn", (req, res) => {
  if (req.session && req.session.user) {
    // If the session exists and contains user information, the user is logged in
    res.status(200).json({ loggedIn: true });
  } else {
    // Otherwise, the user is not logged in
    res.status(200).json({ loggedIn: false });
  }
});
// Assuming you have already set up the MongoDB connection and middleware as described previously
// endpoint to add investor data to mongodb
// app.post("/api/investors", async (req, res) => {
//   try {
//     const collection = req.db.collection("MintDb");
//     const data = req.body;
//     console.log(typeof data);
//     // const result = await collection.deleteMany({'PAN' : {$exists: false}});
//     const result = await collection.insertMany(data)
//     if (result) {
//       res.status(200).json(result);
//     } else {
//       res.status(404).send("No documents inserted");
//     }
//   } catch (error) {
//     console.error("Error during inserting investor data", error);
//     res.status(500).send("Error during inserting investor data");
//   }
// });

app.get("/api/investors", async (req, res) => {
  try {
    const collection = req.db.collection("MintDb");
    const { name } = req.query;
    const { pan } = req.query;
    const { fh } = req.query;

    if (!name && !pan && !fh) {
      return res.status(400).send("name, pan or fh parameter is required");
    }
    var query;
    if (name) {
      query = { NAME: new RegExp(name, "i") };
    }
    if (pan) {
      query = { PAN: pan };
    }
    if (fh) {
      query = { "FAMILY HEAD": new RegExp(fh, "i") };
    }
    const result = await collection.find(query).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching investors", error);
    res.status(500).send("Error while fetching investors");
  }
});

app.get("/api/folios", async (req, res) => {
  try {
    const collection = req.db.collection("MintDb2");
    const { pan } = req.query;
    if (!pan) {
      return res.status(400).send("pan parameter is required");
    }
    var query;
    if (pan) {
      query = { pan: pan };
    }

    const result = await collection.find(query).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching folio's", error);
    res.status(500).send("Error while fetching folio's");
  }
});

app.get("/api/amc", async (req, res) => {
  try {
    const collection = req.db.collection("amc"); // Replace YourCollectionName with the actual name of your collection
    const { keywords } = req.query; // This line extracts the AMC Code from the query parameters
    if (!keywords) {
      return res.status(400).send("Keywords are required to get AMC names");
    }
    var query = { "AMC Code": new RegExp(keywords, "i") }; // This line constructs the query to find documents by AMC Code
    const result = await collection
      .find(query, { projection: { "AMC Code": 1, _id: 0 } })
      .toArray(); // This line executes the query and converts the result to an array
    res.status(200).json(result); // This line sends the query result back to the client as JSON
  } catch (error) {
    console.error("Error fetching AMC details", error);
    res.status(500).send("Error while fetching AMC details");
  }
});
app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error", err);
        return res.status(500).send("Could not log out.");
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

app.get("/api/scheme", async (req, res) => {
  try {
    const collection = req.db.collection("amc"); // Replace YourCollectionName with the actual name of your collection
    const { amc, keywords } = req.query; // This line extracts the AMC Code from the query parameters
    if (!amc) {
      return res.status(400).send("AMC Code parameter is required");
    }
    if (!scm) {
      return res.status(400).send("scm Code parameter is required");
    }
    var query = { "AMC Code": amc, "Scheme Code": new RegExp(keywords, "i") }; // This line constructs the query to find documents by AMC Code
    const result = await collection.find(query).toArray(); // This line executes the query and converts the result to an array
    res.status(200).json(result); // This line sends the query result back to the client as JSON
  } catch (error) {
    console.error("Error fetching scheme details", error);
    res.status(500).send("Error while fetching scheme details");
  }
});

// The Zoho authentication routes remain unchanged as they do not interact with MongoDB

app.post("/api/data", async (req, res) => {
  try {
    const database = req.db2;
    let formData = req.body.formData;
    let results = [];
    const doc = new PDFDocument();
    let isFirstAddition = true;
    let currentYPosition = 50; // Initialize a variable to track the current Y position

    doc.pipe(fs.createWriteStream("output.pdf"));

    const addDataToPDF = (data, title) => {
      const leftMargin = 50;
      const tableTop = currentYPosition + 20;
      const columnWidth = 200;
      const rowHeight = 20;
    
      // Draw the title for the section
      if (!isFirstAddition) {
        doc.addPage();
        currentYPosition = 50; // Reset Y position for new page
      } else {
        isFirstAddition = false;
      }
      doc.fontSize(14).fillColor('navy').font('Helvetica-Bold').text(title, leftMargin, currentYPosition, { underline: true });
      currentYPosition += 30; // Adjust for spacing after the title
    
      // Headers
      doc.fontSize(12).fillColor('black').font('Helvetica').text('Input Question', leftMargin, currentYPosition);
      doc.text('Value', leftMargin + columnWidth, currentYPosition);
      currentYPosition += rowHeight;
    
      // Draw table rows for each key-value pair
      Object.keys(data).forEach(key => {
        let value = data[key];
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value, null, 2);
        }
    
        // Ensure the table doesn't exceed the page height
        if (currentYPosition + rowHeight > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          currentYPosition = 50; // Reset Y position for new page
        }
    
        // Key column
        doc.fontSize(10).fillColor('darkblue').text(key, leftMargin, currentYPosition, { width: columnWidth, align: 'left' });
    
        // Value column
        doc.fillColor('black').text(value, leftMargin + columnWidth, currentYPosition, { width: columnWidth, align: 'left' });
    
        // Move to the next row
        currentYPosition += rowHeight;
      });
    
      // Add some space after the table before the next section
      currentYPosition += 20;
    };
    

    if (formData.systematicData) {
      const collection = database.collection("systamatic");
      for (let i = 0; i < formData.systematicData.length; i++) {
        const combinedSystamatic = Object.assign(
          {},
          formData.commonData,
          formData.systematicData[i]
        );
        addDataToPDF(combinedSystamatic, "Systematic Data " + [i + 1]);
        const ressys = await collection.insertOne(combinedSystamatic);
        if (ressys.acknowledged) {
          // console.log(
          //   "Data stored successfully in systamatic:",
          //   combinedSystamatic
          // );
          results.push({
            message: "Data stored successfully in systamatic",
            formsub: i,
          });
        }
      }
    }
    if (formData.purchRedempData) {
      const collection = database.collection("predemption");
      for (let i = 0; i < formData.purchRedempData.length; i++) {
        const combinedRedemption = Object.assign(
          {},
          formData.commonData,
          formData.purchRedempData[i]
        );
        addDataToPDF(combinedRedemption, "Predemption Data " + [i + 1]);
        const resp = await collection.insertOne(combinedRedemption);
        if (resp.acknowledged) {
          // console.log(
          //   "Data stored successfully in predemption:",
          //   combinedRedemption
          // );
          results.push({
            message: "Data stored successfully in predemption",
            formsub: i,
          });
        }
      }
    }
    if (formData.switchData) {
      const collection = database.collection("Switch");
      for (let i = 0; i < formData.switchData.length; i++) {
        const combinedSwitch = Object.assign(
          {},
          formData.commonData,
          formData.switchData[0]
        );
        addDataToPDF(combinedSwitch, "Switch Data " + [i + 1]);
        const resswit = await collection.insertOne(combinedSwitch);
        if (resswit.acknowledged) {
          // console.log("Data stored successfully in Switch:", combinedSwitch);
          results.push({
            message: "Data stored successfully in Switch",
            formsub: i,
          });
        }
      }
    }
    doc.end();
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(400).json({ message: "No valid data provided for insertion" });
    }
  } catch (error) {
    console.error("Error during data insertion", error);
    res.status(500).send("Error during data insertion");
  }
});

// The catch-all route and server listen call remain unchanged

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server and connect to MongoDB
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${port} www.localhost:5000/`);
});
