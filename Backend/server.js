require("dotenv").config();
const axios = require("axios");
const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Initialize MongoDB Client
const mongoClient = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

    res.redirect("/");
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).send("Authentication failed");
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
    const {name} = req.query;
    const {pan} = req.query;
    const {fh} = req.query;
    console.log(name);
    if (!name && !pan && !fh) {
      return res.status(400).send("name, pan or fh parameter is required");
    }
    var query;
    if (name) {
      query = { NAME: new RegExp(name, "i") }
    }
    if (pan) {
      query = { PAN: pan }
    }
    if (fh) {
      query = { "FAMILY HEAD": new RegExp(fh, "i") }
    }
    const result = await collection.find(query).toArray();
    res.status(200).json(result);
    
  } catch (error) {
    console.error("Error fetching investors", error);
    res.status(500).send("Error while fetching investors");
  }
});

app.get("/api/folio", async (req, res) => {
  try {
    const collection = req.db.collection("MintDb");
    const {pan} = req.query;
    if (!pan) {
      return res.status(400).send("pan parameter is required");
    }
    var query;
    if (pan) {
      query = { PAN: pan }
    }
    const result = await collection.find(query).toArray();
    res.status(200).json(result);
    
  } catch (error) {
    console.error("Error fetching investors", error);
    res.status(500).send("Error while fetching investors");
  }
});

app.get("/api/schemename", async (req, res) => {
  try {
    const collection = req.db.collection("schemeDB");
    const query = { type: new RegExp(req.body.query.type, "i") };
    const result = await collection.find(query).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during database lookup", error);
    res.status(500).send("Error during database lookup");
  }
});
app.get("/api/amc", async (req, res) => {
  try {
    const collection = req.db.collection("amc");
    const query = { type: new RegExp(req.body.query.type, "i") };
    const result = await collection.find(query).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during database lookup", error);
    res.status(500).send("Error during database lookup");
  }
});

// The Zoho authentication routes remain unchanged as they do not interact with MongoDB

app.post("/api/data", async (req, res) => {
  try {
    const database = req.db2; // Use the db instance from the middleware
    let formData = req.body.formData;
    let results = [];
    if (formData.systematicData) {
      const collection = database.collection("systamatic");
      for (let i = 0; i < formData.systematicData.length; i++) {
        const combinedSystamatic = Object.assign(
          {},
          formData.commonData,
          formData.systematicData[i]
        );
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
