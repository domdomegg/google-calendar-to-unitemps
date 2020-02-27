// Date library
const { dayjs, ISO_8601_DATE } = require('./date')

// Google Calendar related imports
const { google } = require('googleapis')
const { getAuth } = require('./authentication')

const { interactiveSelect } = require('./util')

// Gets auth and an instance of the Google Calendar client
const getAuthAndCalendarClient = () => getAuth(['https://www.googleapis.com/auth/calendar.readonly']).then(getCalendarClient)

// Gets an instance of the Google Calendar client with the specified auth
const getCalendarClient = (auth) => google.calendar({ version: 'v3', auth })

// Show the user their calendars and get them to pick one
const getCalendarId = async (client) => {
  const calendars = (await client.calendarList.list()).data.items

  const calendar = await interactiveSelect(
    calendars,
    calendar => `${calendar.summaryOverride || calendar.summary} (${calendar.id})`,
    calendarMatcher,
    'calendar'
  )

  return calendar.id
}

const calendarMatcher = (calendars, res) => {
  // Try to match on id, summaryOverride or summary
  const resLC = res.toLowerCase()
  for (let i = 0; i < calendars.length; i++) {
    const calendar = calendars[i]
    if ([calendar.id, calendar.summaryOverride, calendar.summary].filter(s => !!s).map(s => s.toLowerCase()).includes(resLC)) return calendar
  }

  console.warn(`Failed to find calendar matching ${res}, falling back to primary`)
  return calendars.find(calendar => calendar.primary)
}

// Gets 'time-able' (as opposed to 'all-day') events
const getTimeableEvents = (calendar) => ({ calendarId = 'primary', timeMin, timeMax, maxResults = 2500 }) =>
  calendar.events.list({ calendarId, timeMin, timeMax, maxResults, singleEvents: true, orderBy: 'startTime' })
    .then(({ data: { items } }) => items)
    .then(events => events.filter(event => event.start.dateTime && event.end.dateTime))

const eventsToHoursWorked = events => {
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const result = {}

  for (const event of events) {
    const start = dayjs(event.start.dateTime)
    const end = dayjs(event.end.dateTime)

    if (start.format(ISO_8601_DATE) !== end.format(ISO_8601_DATE)) {
      throw new Error(`Events should not cross days, but '${event.summary}' starts on ${start.format(ISO_8601_DATE)} and ends on ${end.format(ISO_8601_DATE)}.`)
    }

    const dayName = dayNames[(start.day() + 6) % 7]
    result[dayName] = result[dayName] || []
    result[dayName].push({
      from: {
        hour: start.hour(),
        minute: start.minute()
      },
      to: {
        hour: end.hour(),
        minute: end.minute()
      }
    })
  }

  return result
}

const eventsToSummary = events => events.map(event => `${dayjs(event.start.dateTime).format(ISO_8601_DATE)}: ${event.summary}`).join('\n').slice(0, 255)

module.exports = {
  getAuthAndCalendarClient,
  getCalendarId,
  getTimeableEvents,
  eventsToHoursWorked,
  eventsToSummary,
  calendarMatcher
}
