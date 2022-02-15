const faker = require("faker");


const sampleJson = {
  data: [
    ...Array.from({length: 10}).map((_, i) => ({
        "since": `2022-0${i+1}-01`,
        "until": `2022-0${i+2}-01`,
        "total_hrs": faker.datatype.float({min: 0.5, max: 5.0}),
        "summary": [
          {
            "mode": "batch",
            "type": "transcription",
            "operating_point": "standard",
            "count": faker.datatype.number({min: 1, max: 5}),
            "duration_hrs": faker.datatype.float({min: 0.5, max: 5.0})
          },
          {
            "mode": "batch",
            "type": "transcription",
            "operating_point": "enhanced",
            "count": faker.datatype.number({min: 1, max: 5}),
            "duration_hrs": faker.datatype.float({min: 0.5, max: 5.0})
          },
          {
            "mode": "batch",
            "type": "alignment",
            "count": faker.datatype.number({min: 1, max: 5}),
            "duration_hrs": faker.datatype.float({min: 0.5, max: 5.0})
          }
        ]
      })
    )
  ]
  
}

/*
[
  {
    "since": "2022-01-02",
    "until": "2022-02-02",
    "total_hrs": 1.63,
    "summary": [
      {
        "mode": "batch",
        "type": "transcription",
        "operating_point": "standard",
        "count": 5,
        "duration_hrs": 1.53
      },
      {
        "mode": "batch",
        "type": "alignment",
        "count": 1,
        "duration_hrs": 0.1
      }
    ]
  },
  {
    "since": "2022-01-03",
    "until": "2022-02-04",
    "...": null
  }
]
*/

module.exports = sampleJson;