const dayjs = require('dayjs')
// Use en-gb locale for weeks starting on Monday
dayjs.locale('en-gb', require('dayjs/locale/en-gb'))

const { interactiveSelect } = require('./util')

// Standard date format that should generally be stuck to within this app
const ISO_8601_DATE = 'YYYY-MM-DD'

// Show the user possible dates and get them to pick one or enter a custom one
const getTargetDate = async () => {
  const potentialDates = [0, 1, 2, 3, 4].map(weeks => dayjs().subtract(weeks, 'week').endOf('week'))

  const date = await interactiveSelect(
    potentialDates,
    date => `${date.format(ISO_8601_DATE)}`,
    dateMatcher,
    'week'
  )

  return date
}

const dateMatcher = (dates, res) => {
  // Match a specific date
  if (/^\d{4}-\d{2}-\d{2}$/.test(res)) {
    return dayjs(res)
  }

  // Try to match on day number
  if (/^(0|[1-9]\d*)$/.test(res)) {
    const d = dates.find(date => date.date() === parseInt(res))
    if (d) return d
  }

  throw new Error(`Failed to find date matching ${res}`)
}

module.exports = { dayjs, ISO_8601_DATE, getTargetDate }
