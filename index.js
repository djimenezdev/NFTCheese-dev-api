const express = require("express");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const app = express();
const cors = require("cors");
const port = 3001;
require("dotenv").config();

app.use(
  cors({
    origin: "https://nftcheese-dev-api.herokuapp.com/",
  })
);

app.get("/", async (req, res) => {
  /* const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  }); */
  let response = [];
  let data = { Items: [{ yes: "yes" }] }; /* await client.send(
    new ScanCommand({
      TableName: process.env.NAME,
      FilterExpression: "#ranks <= :maximum",
      ExpressionAttributeNames: {
        "#ranks": "rank",
      },
      ExpressionAttributeValues: {
        ":maximum": { N: req.query.amount ? req.query.amount : "25" },
      },
    })
  ); */
  if (
    req.query.type === "rank" ||
    req.query.type === "flips" ||
    req.query.type === "transactions"
  ) {
    if (req.query.order === "desc") {
      response = data.Items.sort(
        (a, b) => b[req.query.type].N - a[req.query.type].N
      );
    } else if (req.query.order === "asc") {
      response = data.Items.sort(
        (a, b) => a[req.query.type].N - b[req.query.type].N
      );
    }
  } else if (!req.query.type) {
    response = data.Items;
  }
  res.json(response);
});

app.listen(port, () => {
  console.log(`Example app listening: http://localhost:${port}`);
});
