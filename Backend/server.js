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
const fs = require("fs");
const puppeteer = require("puppeteer");
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
const mongoClient = new MongoClient(process.env.MONGO_URI);

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
      query = { PAN: new RegExp(pan, "i") };
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
app.post("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error", err);
        return res.status(500).json({ message: "Could not log out." });
      }
      res.clearCookie("user");
      res.status(204).send(); // No content to send back
    });
  } else {
    res.status(401).json({ message: "Session not found" }); // Not authenticated or session expired
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

// // The Zoho authentication routes remain unchanged as they do not interact with MongoDB
// function itemToHTML(item) {
//   let html = `<h2>${item.title}</h2><div>`;
//   Object.entries(item.content).forEach(([key, value]) => {
//     // Format the key to be more readable, if necessary
//     const formattedKey = key.replace(/([A-Z])/g, " $1").trim(); // Add space before capital letters
//     html += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
//   });
//   html += `</div><div class="page-break"></div>`;
//   return html;
// }
app.post("/api/data", async (req, res) => {
  const method = req.query.method;
  try {
    const database = req.db2;
    let formData = req.body.formData;
    let results = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set up response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=filled_form.pdf"
    );

    // Create a buffer to store the PDF data
    const pdfBuffer = [];
    if (formData.systematicData) {
      const collection = database.collection("systematic"); // Corrected collection name
      for (let i = 0; i < formData.systematicData.length; i++) {
        const combinedSystematic = Object.assign(
          {},
          formData.commonData,
          formData.systematicData[i]
        );
        console.log(combinedSystematic);
        // Read the HTML template file
        let templateContent = fs.readFileSync(
          "template/sys_sip_pause.html",
          "utf-8"
        );
        if(combinedSystematic.systematicTraxType == "SIP"){
          if(combinedSystematic.systematicTraxFor == "Registration" || combinedSystematic.systematicTraxFor == "Cancellation"){
            templateContent = fs.readFileSync(
              "template/sys_sip_registration.html",
              "utf-8"
            );    
          }
          else{
            templateContent = fs.readFileSync(
              "template/sys_sip_pause.html",
              "utf-8"
            );
          }
        }
        else if(combinedSystematic.systematicTraxType.endsWith('STP')){
          templateContent = fs.readFileSync(
            "template/sys_stp.html",
            "utf-8"
          );
        }
        else if(combinedSystematic.systematicTraxType.endsWith('SWP')){
          templateContent = fs.readFileSync(
            "template/sys_swp.html",
            "utf-8"
          );
        }
        
        // Replace title of the page
        let filledTemplate = templateContent.replace(
          "{{pageTitle}}",
          "Systematic Form"
        );

        // Replace placeholders with actual data
        for (const key in combinedSystematic) {
          const regex = new RegExp(`{{${key}}}`, "g"); // Corrected regex pattern
          filledTemplate = filledTemplate.replace(
            regex,
            combinedSystematic[key]
          );
        }

        // Set HTML content of the page
        await page.setContent(filledTemplate);

        // Generate PDF and store it in the buffer
        const pdf = await page.pdf({ format: "A4", printBackground: true });
        pdfBuffer.push(pdf);
        
        if (method === "Submit") {
          const ressys = await collection.insertOne(combinedSystematic); // Corrected variable name
          if (ressys.acknowledged) {
            console.log(
              "Data stored successfully in systematic:", // Corrected log message
              combinedSystematic
            );
            results.push({
              message: "Data stored successfully in systematic", // Corrected message
              formsub: i,
            });
          }
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
          // Read the HTML template file
          let templateContent = fs.readFileSync(
            "template/purch_redemp.html",
            "utf-8"
          );
          // Replace title of the page
          let filledTemplate = templateContent.replace(
            "{{pageTitle}}",
            "Purchase/Redemption Form"
          );
      
          // Replace placeholders with actual data
          for (const key in combinedRedemption) {
            const regex = new RegExp(`{{${key}}}`, "g"); // Corrected regex pattern
            filledTemplate = filledTemplate.replace(
              regex,
              combinedRedemption[key]
            );
          }
      
          // Set HTML content of the page
          await page.setContent(filledTemplate);
      
          // Generate PDF and store it in the buffer
          const pdf = await page.pdf({ format: "A4", printBackground: true });
          pdfBuffer.push(pdf);
          if (method == "Submit") {
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
    }
    if (formData.switchData) {
      const collection = database.collection("Switch");
      for (let i = 0; i < formData.switchData.length; i++) {
        const combinedSwitch = Object.assign(
          {},
          formData.commonData,
          formData.switchData[0]
        );
        let templateContent = fs.readFileSync(
          "template/switch.html",
          "utf-8"
        );
        // Replace title of the page
        let filledTemplate = templateContent.replace(
          "{{pageTitle}}",
          "Switch Form"
        );
    
        // Replace placeholders with actual data
        for (const key in combinedSwitch) {
          const regex = new RegExp(`{{${key}}}`, "g"); // Corrected regex pattern
          filledTemplate = filledTemplate.replace(
            regex,
            combinedSwitch[key]
          );
        }
    
        // Set HTML content of the page
        await page.setContent(filledTemplate);
    
        // Generate PDF and store it in the buffer
        const pdf = await page.pdf({ format: "A4", printBackground: true });
        pdfBuffer.push(pdf);
        if ((method = "Submit")) {
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
    }
    // Concatenate all PDF buffers
    const finalPdfBuffer = Buffer.concat(pdfBuffer);

    // Send the concatenated PDF buffer as the response
    res.end(finalPdfBuffer);
    // res.end(Buffer.concat(pdfBuffer));
    await browser.close();
    if (method == "Submit") {
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res
          .status(400)
          .json({ message: "No valid data provided for insertion" });
      }
    }
  } catch (error) {
    console.error("Error during data insertion", error);
    res.status(500).send("Error during data insertion");
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server and connect to MongoDB
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${port} www.localhost:5000/`);
});