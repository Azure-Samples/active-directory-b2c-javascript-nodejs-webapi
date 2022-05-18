const { faker } = require("@faker-js/faker");

function generateData() {
  const output = []
  const end = new Date("2022/12/31")
  const loop = new Date("2022/01/01")

  while ( loop < end ) {
    const currentDate = loop.toLocaleDateString("se-SE")
    output.push(getUnit(currentDate, currentDate))
    loop.setDate(loop.getDate() + 1)
  }
  return output
}

function getUnit(dateSince, dateUntil) {
  const unit = {
    since: dateSince,
    until: dateUntil,
    total_hrs: 0,
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
  unit.total_hrs = unit.summary.reduce((prev, curr) => {
    return prev += curr.duration_hrs
  }, 0)
  return unit
}

const usageBreakdown = generateData()

function aggregate (since, until) {

  const sinceDate = new Date(since ? since : "1970-01-01")

  const untilDate = until ? new Date(until) : new Date()

  const breakdown = usageBreakdown.filter(item => {
    const itemDate = new Date(item.since)
    return itemDate <= untilDate && itemDate >= sinceDate
  })

  const summary = [
    {
      mode: "batch",
      type: "transcription",
      operating_point: "standard",
      count: 0,
      duration_hrs: 0,
    },
    {
      mode: "batch",
      type: "transcription",
      operating_point: "enhanced",
      count: 0,
      duration_hrs: 0,
    },
    {
      mode: "batch",
      type: "alignment",
      count: 0,
      duration_hrs: 0,
    }
  ]

  let total_hrs = 0

  for ( let i = 0; i < breakdown.length; i++ ) {
    total_hrs += breakdown[i].summary[2].duration_hrs + breakdown[i].summary[1].duration_hrs + breakdown[i].summary[0].duration_hrs
    summary[2].count += breakdown[i].summary[2].count
    summary[2].duration_hrs += breakdown[i].summary[2].duration_hrs
    summary[1].count += breakdown[i].summary[1].count
    summary[1].duration_hrs += breakdown[i].summary[1].duration_hrs
    summary[0].count += breakdown[i].summary[0].count
    summary[0].duration_hrs += breakdown[i].summary[0].duration_hrs
  }

  return {
    aggregate: {
      since: since ? since : "1970-01-01",
      until: until ? until : untilDate.toLocaleDateString("se-SE"),
      total_hrs,
      summary
    },
    breakdown,
  }
}

module.exports = {
  aggregate
};
