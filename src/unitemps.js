const unitemps = require('unitemps-sdk').default

const { interactiveSelect } = require('./util')

const getJobId = async () => {
  const jobs = (await unitemps.getJobs()).data.filter(job => job.status === 'Current')

  console.log('Getting jobs...')
  const job = await interactiveSelect(
    jobs,
    job => `[${job.company}] ${job.jobTitle} (${job.id})`,
    jobMatcher,
    'job'
  )

  return job.id
}

const jobMatcher = (jobs, res) => {
  // Try to match on id, ref, company or jobTitle
  const resLC = res.toLowerCase()
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i]
    if ([job.id, job.ref, job.company, job.jobTitle].filter(s => !!s).map(s => s.toLowerCase()).includes(resLC)) return job
  }

  throw new Error(`Failed to find job matching ${res}`)
}

module.exports = { unitemps, getJobId }
