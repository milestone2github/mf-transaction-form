require("dotenv").config();
const axios = require("axios");
const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const session = require("express-session");
const sendToZohoSheet = require("./utils/sendToZohoSheet");

// Configure session middleware
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
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
  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${process.env.ZOHO_CLIENT_ID}&scope=ZohoCRM.users.READ&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&access_type=offline`;
  res.redirect(authUrl);
});
app.get("/auth/zoho/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post(
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

    const accessToken = tokenResponse.data.access_token;
    const response = await axios.get(
      "https://www.zohoapis.com/crm/v3/users?type=CurrentUser",
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    const userName = response.data.users[0].full_name;
    const userEmail = response.data.users[0].email;
    // Store user data in session
    req.session.user = {
      name: userName,
      email: userEmail,
      accessToken: accessToken, // Storing the access token might be useful for future API calls
    };

    res.redirect("/");
  } catch (error) {
    console.error(
      "Error during authentication or fetching user details",
      error
    );
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
    const collection = req.db.collection("BSEOrderStatus"); // Ensure this is the correct collection name
    const { keywords } = req.query; // Assuming 'keywords' is the client name you're searching for
    if (!keywords) {
      return res.status(400).send("Client name parameter is required");
    }

    var query = { ClientName: new RegExp(keywords, "i") }; // Case-insensitive search for client name

    const documents = await collection.find(query).toArray();

    const result = documents.map((doc) => {
      const folio =
        doc.FolioNo && doc.FolioNo.trim() !== "" ? doc.FolioNo : doc.DPFolioNo;
      return {
        ...doc,
        FolioOrDPFolio: folio, // Add a new field to indicate the chosen folio number
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching folios", error);
    res.status(500).send("Error while fetching folios");
  }
});

app.get("/api/amc", async (req, res) => {
  try {
    const collection = req.db.collection("mfschemesDb"); // Assuming req.db is correctly set up to access your MongoDB
    const { keywords } = req.query; // Extracting keywords from query parameters
    if (!keywords) {
      return res.status(400).send("Keywords are required to get AMC names");
    }

    // Constructing a case-insensitive search query for aggregation
    var matchStage = {
      $match: {
        "FUND NAME": new RegExp(keywords, "i"),
      },
    };

    // Grouping results to ensure uniqueness and excluding _id from the output
    var groupStage = {
      $group: {
        _id: "$FUND NAME", // Group by "FUND NAME" to get unique names
      },
    };

    // Projecting the result to get the desired output format
    var projectStage = {
      $project: {
        "FUND NAME": "$_id",
        _id: 0,
      },
    };

    const result = await collection
      .aggregate([matchStage, groupStage, projectStage])
      .toArray();

    res.status(200).json(result); // Sending the result back as JSON
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

app.get("/api/schemename", async (req, res) => {
  try {
    const collection = req.db.collection("mfschemesDb"); // Replace YourCollectionName with the actual name of your collection
    const { amc, keywords } = req.query; // This line extracts the AMC Code from the query parameters
    if (!amc) {
      return res.status(400).send("AMC Code parameter is required");
    }
    if (!keywords) {
      return res.status(400).send("scm Code parameter is required");
    }
    var query = { "FUND NAME": amc, scheme_name: new RegExp(keywords, "i") };
    const result = await collection.find(query).toArray(); // Fetch documents based on the query
    res.status(200).json(result); // This line sends the query result back to the client as JSON
  } catch (error) {
    console.error("Error fetching scheme details", error);
    res.status(500).send("Error while fetching scheme details");
  }
});

// route to submit form
app.post("/api/data", async (req, res) => {
  try {
    const database = req.db2;
    let formData = req.body.formData;
    let results = [];
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "User not logged in" });
    }
    const { name, email } = req.session.user;
    // Include name and email in commonData
    formData.commonData = {
      ...formData.commonData,
      RMName: name,
      RMEmail: email,
    };
    if (formData.systematicData) {
      const collection = database.collection("systematic"); // Corrected collection name
      for (let i = 0; i < formData.systematicData.length; i++) {
        // combine common data and systematic data
        const combinedSystematic = Object.assign(
          {},
          formData.commonData,
          formData.systematicData[i]
        );

        // store systematic data in database
        const ressys = await collection.insertOne(combinedSystematic); // Corrected variable name
        if (ressys.acknowledged) {
          console.log("Data stored successfully in systematic");
          results.push({
            message: "Data stored successfully in systematic", // Corrected message
            formsub: i,
          });

          // add mongo's id field to systematic data
          combinedSystematic._id = ressys.insertedId.toString();

          // send data to zoho sheet
          sendToZohoSheet(
            combinedSystematic,
            `Systematic form ${i + 1} sent to zoho sheet`
          );
        }
      }
    }

    if (formData.purchRedempData) {
      const collection = database.collection("predemption");
      for (let i = 0; i < formData.purchRedempData.length; i++) {
        // combine common data with purchase/redemption
        const combinedRedemption = Object.assign(
          {},
          formData.commonData,
          formData.purchRedempData[i]
        );

        // store data in database
        const resp = await collection.insertOne(combinedRedemption);
        if (resp.acknowledged) {
          console.log("Data stored successfully in predemption");
          results.push({
            message: "Data stored successfully in predemption",
            formsub: i,
          });

          // add mongo's id field to purchase/redemption data
          combinedRedemption._id = resp.insertedId.toString();

          // send data to zoho sheet
          sendToZohoSheet(
            combinedRedemption,
            `Purchase/Redemption form ${i + 1} sent to zoho sheet`
          );
        }
      }
    }

    if (formData.switchData) {
      const collection = database.collection("Switch");
      for (let i = 0; i < formData.switchData.length; i++) {
        // combine common data and switch data
        const combinedSwitch = Object.assign(
          {},
          formData.commonData,
          formData.switchData[i]
        );

        // store switch data to database
        const resswit = await collection.insertOne(combinedSwitch);
        if (resswit.acknowledged) {
          console.log("Data stored successfully in Switch");
          results.push({
            message: "Data stored successfully in Switch",
            formsub: i,
          });

          // add mongo's id field to purchase/redemption data
          combinedSwitch._id = resswit.insertedId.toString();

          // send data to zoho sheet
          sendToZohoSheet(
            combinedSwitch,
            `Switch form ${i + 1} sent to zoho sheet`
          );
        }
      }
    }

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(400).json({ message: "No valid form data provided" });
    }
  } catch (error) {
    console.error("Error during submission of Form", error);
    res.status(500).send("Error during submission of Form");
  }
});

// wildcard route to serve react using express
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server and connect to MongoDB
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on http://localhost:${port}/`);
});
