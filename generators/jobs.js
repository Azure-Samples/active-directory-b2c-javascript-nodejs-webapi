const { faker } = require("@faker-js/faker");

function generateJob(created_at = faker.date.past()) {
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
        "status": faker.helpers.arrayElement([...Array(6).fill('running'), 'done', /* 'rejected' */])
    }
}

function generateList() {
    const jobs = []
    for (let i = 0; i < 15; i++) {
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
    if (jobIndex === -1) {
        throw { status: 404, message: "No job found" }
    }
    jobsDB.splice(jobIndex, 1)
    return
}

function add() {
    if (jobsDB.length > 200) {
        throw { status: 429, message: "too many jobs" }
    }
    updateStatusOverTime();
    const today = new Date()
    jobsDB.splice(0, 0, generateJob(today))
    return jobsDB[0].id
}



const jsonTranscript = {
    // ...require('../static/vath9w1bs9.transcript.json')
    ...require('../static/channels.transcript.json')
}

let interv = 0;
function updateStatusOverTime() {
    clearInterval(interv); // clear any previous interval
    interv = setInterval(() => {
        let foundOne = false;
        jobsDB.filter(el => el.status == 'running').forEach(el => {
            //todo could be something fancier with new Date(el.created_at)
            if (Math.random() > 0.5) el.status = 'done';
            foundOne = true;
        })
        if (!foundOne) clearInterval(interv);
    }, 5000);
}
updateStatusOverTime();



module.exports = {
    list,
    getById,
    deleteById,
    add,
    jsonTranscript
}