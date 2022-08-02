

const { faker } = require("@faker-js/faker");

const getPaymentsInfo = () => {
    return {
        payments: [
            {
                start_date: "2022-02-01",
                end_date: "2022-02-28",
                total_hrs: "10.5",
                total_cost: "5.43",
                status: "paid",
                billing_date: "2022-03-01",
                url: "https://www.chargifypay.com/invoice/inv_abcd1234?token=efgh5678",
            },
            {
                start_date: "2022-03-01",
                end_date: "2022-03-31",
                total_hrs: "12.3",
                total_cost: "10.27",
                status: "due",
                billing_date: "2022-04-01",
                url: "https://www.chargifypay.com/invoice/inv_abcd4321?token=efgh8765",
            },
            {
                start_date: "2022-04-01",
                end_date: "2022-04-03",
                total_hrs: "1.2",
                total_cost: "0",
                status: "due",
                billing_date: "2022-05-01",
            },
            ...Array.from({ length: 40 }).map((_, i) => ({
                start_date: "2022-04-" + pad(i + 1),
                end_date: "2022-04-" + pad(i + 2),
                total_hrs: faker.datatype.number({ min: 0.1, max: 10 }),
                total_cost: faker.datatype.number({ min: 0.1, max: 10 }),
                status: "due",
                billing_date: "2022-05-01",
                url: "https://www.chargifypay.com/invoice/inv_abcd4321?token=efgh8765"
            })),
        ],
    };
};

const pad = (n) => n.toString().padStart(2, "0");

const generateToken = () =>
    (Math.random() * 99999999999999999).toString(36).repeat(2);

const apiKey = (id = "", name = "") => ({
    apikey_id: id || generateToken(),
    name: name || faker.lorem.word(),
    created_at: faker.date.past(1),
    client_ref: faker.datatype.uuid(),
});

const wait = async (secs) => {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            resolve();
        }, secs * 1000)
    );
};


const getAccount = (temp_apiKeys) => ({
    accounts: [
        {
            account_id: 0,
            contracts: [
                {
                    contract_id: 0,
                    runtime_url: "https://runtime-url.speechmatics.test",
                    payment_method: {
                        card_type: "visa",
                        masked_card_number: "XXXX XXXX XXXX 2132",
                        expiration_month: "03",
                        expiration_year: "23",
                    },
                    usage_limits: [
                        {
                            name: "LIM_DUR_CUR_MON_STANDARD_SEC",
                            value: 3600000,
                        },
                        {
                            name: "LIM_DUR_CUR_MON_ENHANCED_SEC",
                            value: 3600000,
                        },
                    ],
                    state: "active",
                    projects: [
                        {
                            project_id: 0,
                            api_keys: temp_apiKeys,
                            name: faker.lorem.word(2),
                        },
                    ],
                },
            ],
        },
    ],
});


module.exports = { getPaymentsInfo, pad, generateToken, apiKey, wait, getAccount }