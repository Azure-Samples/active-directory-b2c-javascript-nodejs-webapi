const { faker } = require("@faker-js/faker");

function generateJob(created_at=faker.date.past()) {
    return {
      "config": {
        "transcription_config": {
          "language": "en"
        },
        "type": "transcription"
      },
      created_at: created_at.toISOString(),
      "data_name": `${faker.lorem.slug()}.mp3`,
      "duration": faker.random.numeric(3),
      "id": faker.git.shortSha(),
      "status": faker.helpers.arrayElement(['running', 'running', 'running', 'running', 'done', 'rejected'])
    }
}

function generateList() {
    const jobs = []
    for ( let i = 0; i < 200; i++) {
        jobs.push(generateJob())
    }
    return jobs.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at) 
    })
}

const jobsDB = generateList()

// console.log(jobsDB)

function list(query) {
    let returnJobs = JSON.parse(JSON.stringify(jobsDB))
    if (query.created_before) {
        returnJobs = returnJobs.filter(item => new Date(item.created_at) < new Date(query.created_before))
    }
    if (query.limit) {
        returnJobs = returnJobs.slice(0, query.limit)
    } else {
        returnJobs = returnJobs.slice(0, 100)
    }
    if (query.include_config === "false") {
        returnJobs = returnJobs.map(item => {
            return {
                "created_at": item.created_at,
                "data_name": item.data_name,
                "duration": item.duration,
                "id": item.id,
                "status": item.status
            }
        })
    }
    return returnJobs
}

function getById(id) {
    return jobsDB.find(item => item.id == id)
}

function deleteById(id) {
    const jobIndex = jobsDB.findIndex(item => item.id == id)
    console.log(jobIndex)
    if ( jobIndex === -1 ) {
        throw { status: 404, message: "No job found" }
    }
    jobsDB.splice(jobIndex, 1)
    return
}

function add() {
    if ( jobsDB.length > 200 ) {
        throw { status: 429, message: "too many jobs" }
    }
    const today = new Date()
    jobsDB.splice(0, 0, generateJob(today))
    return jobsDB[0].id
}

const jsonTranscript = {
    "application/vnd.speechmatics.v2+json": {
    "format": '2.7',
    "job": {
      created_at: "2018-01-09T12:29:01.853047Z",
      data_name: "recording.mp3",
      duration: 244,
      id: "a1b2c3d4e5",
      tracking: {
        title: "ACME Q12018 Statement",
        reference: "/data/clients/ACME/statements/segs/2018Q1-seg8",
        tags: ['quick-review', 'segment'],
        details: {
          client: "ACME Corp",
          segment: 8,
          seg_start: 963.201,
          seg_end: 1091.481
        }
      }
    }
  }
}

module.exports = {
    list,
    getById,
    deleteById,
    add,
    jsonTranscript
}