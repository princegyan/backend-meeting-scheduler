const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Alfred Gyan");
});

app.listen(port, () => {
  `Server started on port ${port}`;
});