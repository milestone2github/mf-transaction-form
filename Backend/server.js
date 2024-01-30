const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/api/data", (req, res) => {
  console.log(req.body.formData); // Log the request body to the console
  console.log('##############')
  res.status(200).json({ message: "Data received successfully" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
