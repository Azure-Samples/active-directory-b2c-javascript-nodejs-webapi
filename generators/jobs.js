const { faker } = require("@faker-js/faker");

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

function generateList() {
    const jobs = []
    for ( let i = 0; i < 200; i++) {
        jobs.push(generateJob())
    }
    return jobs.sort((a, b) => {
        return b.created_at - a.created_at 
    })
}

const jobsDB = generateList()

function list(query) {
    let returnJobs = JSON.parse(JSON.stringify(jobsDB))
    if (query.created_before) {
        returnJobs = jobsDB.filter(item => item.created_at < query.created_before)
    }
    if (query.limit) {
        returnJobs = jobsDB.slice(0, query.limit)
    } else {
        returnJobs = jobsDB.slice(0, 100)
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


module.exports = {
    list,
    getById
}