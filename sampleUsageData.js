const faker = require("faker");

const sampleJson = {
  aggregate: {
    ...getUnit(`2022-01-01`, `2022-09-01`),
  },
  breakdown: [
    ...Array.from({ length: 8 }).map((_, i) =>
      getUnit(`2022-0${i + 1}-01`, `2022-0${i + 2}-01`)
    ),
  ],
};

function getUnit(dateSince, dateUntil) {
  return {
    since: dateSince,
    until: dateUntil,
    total_hrs: faker.datatype.float({ min: 0.5, max: 5.0 }),
    summary: [
      {
        mode: "batch",
        type: "transcription",
        operating_point: "standard",
        count: faker.datatype.number({ min: 1, max: 5 }),
        duration_hrs: faker.datatype.float({ min: 0.5, max: 5.0 }),
      },
      {
        mode: "batch",
        type: "transcription",
        operating_point: "enhanced",
        count: faker.datatype.number({ min: 1, max: 5 }),
        duration_hrs: faker.datatype.float({ min: 0.5, max: 5.0 }),
      },
      {
        mode: "batch",
        type: "alignment",
        count: faker.datatype.number({ min: 1, max: 5 }),
        duration_hrs: faker.datatype.float({ min: 0.5, max: 5.0 }),
      },
    ],
  };
}

module.exports = sampleJson;
