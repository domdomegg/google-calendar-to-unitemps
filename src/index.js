// Date library
const { dayjs, ISO_8601_DATE, getTargetDate } = require('./date')

// Google Calendar
const { getAuthAndCalendarClient, getCalendarId, getTimeableEvents, eventsToHoursWorked, eventsToSummary } = require('./googlecalendar')

// Unitemps
const { unitemps, getJobId } = require('./unitemps');

(async () => {
  const calendar = await getAuthAndCalendarClient()
  const calendarId = process.env.CALENDAR_ID || await getCalendarId(calendar)

  const targetDate = (process.env.TARGET_DATE && dayjs(process.env.TARGET_DATE)) || await getTargetDate()
  const timeMin = targetDate.startOf('week').toISOString()
  const timeMax = targetDate.endOf('week').toISOString()

  console.log(`Getting events between ${timeMin} and ${timeMax}...`)
  const events = await getTimeableEvents(calendar)({ calendarId, timeMin, timeMax })
  console.log(`Got ${events.length} event${events.length === 1 ? '' : 's'} between ${timeMin} and ${timeMax}:`)
  console.log(events.map((event, index) => `  ${index}: [${event.start.dateTime} - ${event.end.dateTime}] ${event.summary}`).join('\n'))

  if (events.length === 0) {
    console.log(`No events in week of ${targetDate}, not uploading anything to Unitemps`)
    return
  }

  console.log('Logging into Unitemps...')
  await unitemps.login(process.env.UNITEMPS_USERNAME, process.env.UNITEMPS_PASSWORD)

  const jobId = process.env.UNITEMPS_JOB_ID || await getJobId()

  console.log('Saving draft timesheet...')
  await unitemps.upsertTimesheet({
    jobId,
    timesheetId: process.env.UNITEMPS_TIMESHEET_ID,
    weekEnding: dayjs(timeMax).format(ISO_8601_DATE),
    hoursWorked: eventsToHoursWorked(events),
    notes: eventsToSummary(events)
  })
  console.log('Saved draft timesheet')
})()
