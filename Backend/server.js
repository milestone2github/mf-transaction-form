require("dotenv").config();

const axios = require("axios");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");
const { MongoClient } = require("mongodb");

app.use(cors());

app.use(express.json());

// app.use(express.static(path.join(__dirname, "../frontend/dist")));
const mongoClient = new MongoClient(process.env.MONGO_URI);
app.get("/api/common", async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db("Milestone");
    const collection = database.collection("MintDb");

    const query = { name: req.query.name };
    const result = await collection.findOne(query);

    if (result) {
      const transformedResult = {
        common: `${result.PAN} / ${result.NAME} / ${result["FAMILY HEAD"]}`,
        pan: result.PAN,
        name: result.NAME,
        "family head": result["FAMILY HEAD"],
      };
      res.status(200).json(transformedResult);
    } else {
      res.status(404).send("No matching documents found");
    }
  } catch (error) {
    console.error("Error during database lookup", error);
    res.status(500).send("Error during database lookup");
  } finally {
    await mongoClient.close();
  }
});

app.get("/api/schemename", async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db("Milestone");
    const collection = database.collection("schemeDB");

    const query = { name: req.query.name };
    const result = await collection.findOne(query);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send("No matching documents found");
    }
  } catch (error) {
    console.error("Error during database lookup", error);
    res.status(500).send("Error during database lookup");
  } finally {
    await mongoClient.close();
  }
});

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

    console.log('zoho response: ', response);
    res.redirect("/");
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).send("Authentication failed");
  }
});

app.post("/api/data", async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db("mftransactiondb");

    let formData = req.body.formData;
    let results = [];

    if (formData.purchRedempData) {
      const combinedRedemption = Object.assign(
        {},
        formData.commonData,
        formData.purchRedempData
      );
      const collection = database.collection("predemption");
      const resp = await collection.insertOne(combinedRedemption);
      if (resp.acknowledged) {
        console.log(
          "Data stored successfully in predemption:",
          combinedRedemption
        );
        results.push({ message: "Data stored successfully in predemption" });
      }
    }

    if (formData.switchData) {
      const combinedSwitch = Object.assign(
        {},
        formData.commonData,
        formData.switchData
      );
      const collection = database.collection("Switch");
      const resswit = await collection.insertOne(combinedSwitch);
      if (resswit.acknowledged) {
        console.log("Data stored successfully in Switch:", combinedSwitch);
        results.push({ message: "Data stored successfully in Switch" });
      }
    }

    if (formData.systematicData) {
      const combinedSystamatic = Object.assign(
        {},
        formData.commonData,
        formData.systematicData
      );
      const collection = database.collection("systamatic");
      const ressys = await collection.insertOne(combinedSystamatic);
      if (ressys.acknowledged) {
        console.log(
          "Data stored successfully in systamatic:",
          combinedSystamatic
        );
        results.push({ message: "Data stored successfully in systamatic" });
      }
    }

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res
        .status(400)
        .json({ message: "No valid data provided for insertion" });
    }
  } catch (error) {
    console.error("Error during data insertion", error);
    return res.status(500).send("Error during data insertion");
  } finally {
    await mongoClient.close();
  }
});

app.get("*", (req, res) => {
  res.send('Hello Express Node')
  // res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port} `)
);
