const express = require("express");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "https://nftcheese-assignment.vercel.app",
      "http://localhost:3000",
    ],
  })
);

app.get("/", async (req, res) => {
  const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  });
  let response = [];
  let data = await client.send(
    new ScanCommand({
      TableName: process.env.NAME,
      FilterExpression: "#ranks <= :maximum and #ranks >= :minimum",
      ExpressionAttributeNames: {
        "#ranks": "rank",
      },
      ExpressionAttributeValues: {
        ":minimum": {
          N:
            req.query.start &&
            typeof parseInt(req.query.start) === "number" &&
            parseInt(req.query.start) >= 1
              ? req.query.start
              : "25",
        },
        ":maximum": {
          N:
            req.query.end &&
            typeof parseInt(req.query.end) === "number" &&
            parseInt(req.query.end) >= 1
              ? req.query.end
              : "25",
        },
      },
    })
  );
  if (
    !!req.query.type &&
    (req.query.type === "rank" ||
      req.query.type === "flipsCount" ||
      req.query.type === "transactionCount")
  ) {
    if (req.query.order === "desc") {
      response = data.Items.sort(
        (a, b) => b[req.query.type]?.N - a[req.query.type]?.N
      );
    } else if (req.query.order === "asc") {
      response = data.Items.sort(
        (a, b) => a[req.query.type]?.N - b[req.query.type]?.N
      );
    } else {
      response = data.Items;
    }
  } else {
    response = data.Items;
  }
  res.json(response);
});

app.listen(port, () => {
  console.log(`Example app listening: http://localhost:${port}`);
});
