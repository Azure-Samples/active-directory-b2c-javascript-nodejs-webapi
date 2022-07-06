const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {
  usage,
  jobs,
} = require("./generators");
const { faker } = require("@faker-js/faker");
const { getPaymentsInfo, generateToken, apiKey, wait, getAccount } = require("./helpers");
const fileUpload = require('express-fileupload')

let temp_apiKeys = Array.from({ length: 3 }).map(_ => apiKey());


const app = express();

app.use(express.json(
  {
    limit: '1gb',
    strict: false
  }
));

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("dev"));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.post(
  "/api_keys",
  async (req, res) => {

    // res.status(403).send('error')


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

    res.status(404).send('error')


    /* temp_apiKeys = temp_apiKeys.filter(
      (key) => key.apikey_id != req.params.api_key_id
    );

    res.status(200).send({
      status: "ok",
    }); */
  }
);

app.get(
  "/usage",
  (req, res) => {

    const sampleUsageData = usage.aggregate(req.query.since, req.query.until)
    res.status(200).send({ ...sampleUsageData });
  }
);

app.get(
  "/accounts",
  async (req, res) => {
    // await wait(15);
    res.status(200).send(getAccount(temp_apiKeys));
    // res.status(200).json({ accounts: [] });
    // res.status(401).send();
    // res.status(500).send('error')
  }
);

app.get("/contracts/:contractId/payment_token", async (req, res) => {
  res.status(200).json({ payment_token: "payment_token" });

})

app.post("/contracts/:contractId/cards", async (req, res) => {
  res.status(200).json({});
})

app.delete("/contracts/:contractId/cards", async (req, res) => {
  res.status(200).json({});
})


app.post(
  "/accounts",
  async (req, res) => {
    res.status(200).send(getAccount(temp_apiKeys));
    // res.status(403).send();
  }
);

app.get("/payments", (req, res) => {
  // res.status(401).send("<html><body>unauthorized</body></html>")
  res.status(200).json({ ...getPaymentsInfo() });
  // res.status(500).text("error")
});


// API anonymous endpoint

app.get("/", (req, res) => res.send({ message: "hello", date: new Date(), date: process.env.TEST_ENV_VAR }));

app.post("/jobs_key", (req, res) => {
  res.send({ key: "key" })
})

app.get("/jobs", (req, res) => {
  res.send({
    jobs: jobs.list(req.query)
  })
})

app.post("/jobs", async (req, res) => {
  try {
    const newId = jobs.add()
    // await wait(30);
    res.send({ id: newId })
  } catch (error) {
    res.status(error.status ? error.status : 500).send(error.message)
  }
  /* res.status(403).send({
    "code": 403,
    "detail": "account is not allowed to create a job at the moment: This request would exceed your limit for Enhanced Model transcription in the current month. Your limit is 2 hours.",
    "error": "Forbidden"
  }) */
})

app.get("/jobs/:jobId", (req, res) => {
  const job = jobs.getById(req.params.jobId)
  if (job == null) {
    res.status(404).send({ code: 404, message: "No job with id: " + req.params.jobId })
  } else {
    res.send({
      job
    })
  }
})

app.delete("/jobs/:jobId", (req, res) => {
  try {
    jobs.deleteById(req.params.jobId)
    res.status(200).send({ id: req.params.jobId })
  } catch (error) {
    res.status(error.status ? error.status : 500).send(error.message)
  }
})

app.get("/jobs/:jobId/transcript", (req, res) => {
  const job = jobs.getById(req.params.jobId)
  if (job == null) {
    res.status(404).send({ code: 404, message: "No job with id: " + req.params.jobId })
  } else if (req.query.format === 'txt') {
    res.send(faker.lorem.paragraph(35))
  } else {
    res.send(jobs.jsonTranscript)
  }

})


const port = process.env.PORT || 4444;

app.listen(port, () => {
  console.log("Listening on port " + port);
});