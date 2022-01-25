const fetch = require("node-fetch");

async function sendUserToChargify(email, firstName, surname) {
  const options = {
    method: "POST",
    body: JSON.stringify({
      customer: { first_name: firstName, email, last_name: surname },
    }),
    headers: {
      Authorization: `Basic ${process.env.CHARGIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
  };
  console.log("options", options);
  return fetch("https://speechmatics.chargify.com/customers.json", options)
    .then((resp) => resp.json())
    .then((resp) => console.log("chargify resp", resp));
}

module.exports = { sendUserToChargify };
