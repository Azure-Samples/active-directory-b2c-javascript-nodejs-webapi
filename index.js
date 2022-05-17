const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const aggregateUsage = require("./sampleUsageData");
const { faker } = require("@faker-js/faker");
const { getPaymentsInfo, generateToken, apiKey, wait, getAccount } = require("./helpers");


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);


app.use(morgan("dev"));

app.post(
  "/api_keys",
  async (req, res) => {
    console.log("/api_keys");
    const apikeyId = generateToken();
    temp_apiKeys = [...temp_apiKeys, apiKey(apikeyId, req.body.name)];

    // await wait(200);

    res.status(200).send({
      apikey_id: apikeyId,
      key_value: faker.datatype.string(40),
    });
  }
);

app.delete(
  "/api_keys/:api_key_id",
  (req, res) => {
    console.log("delete /api_keys", req.params.api_key_id);

    temp_apiKeys = temp_apiKeys.filter(
      (key) => key.apikey_id != req.params.api_key_id
    );

    res.status(200).send({
      status: "ok",
    });
  }
);

app.get(
  "/usage",
  (req, res) => {
    const sampleUsageData = aggregateUsage(req.query.since, req.query.until)
    res.status(200).send({ ...sampleUsageData });
  }
);

app.get(
  "/accounts",
  async (req, res) => {
    // await wait(15);
    res.status(200).send(getAccount());
    // res.status(200).json({ accounts: [] });
  }
);

app.post(
  "/accounts",
  async (req, res) => {
    res.status(200).send(getAccount());
  }
);

app.get("/payments", (req, res) => {
  // res.status(401).send("<html><body>unauthorized</body></html>")
  res.status(200).json({ ...getPaymentsInfo() });
});


// API anonymous endpoint

app.get("/", (req, res) => res.send({ message: "hello", date: new Date(), date: process.env.TEST_ENV_VAR }));

app.post("/jobs_key", (req, res) => {
  res.send({ key: "key" })
})

app.get("/jobs", (req, res) => {
  res.send([generateJob(), generateJob(), generateJob()])
})

app.post("/jobs", (req, res) => {
  res.send({ id: faker.git.shortSha() })
})

app.get("/jobs/:jobId", (req, res) => {
  res.send(generateJob())
})


function generateJob() {
  return {
    "config": {
      "transcription_config": {
        "language": "en"
      },
      "type": "transcription"
    },
    "created_at": faker.date.past(),
    "data_name": `${faker.lorem.slug()}.mp3`,
    "duration": faker.random.numeric(3),
    "id": faker.git.shortSha(),
    "status": faker.helpers.arrayElement(['running', 'running', 'running', 'running', 'done', 'rejected'])
  }
}

app.get("/jobs/:jobId/transcript", (req, res) => {
  res.send(faker.lorem.paragraph(4))
})


const port = process.env.PORT || 4444;

app.listen(port, () => {
  console.log("Listening on port " + port);
});