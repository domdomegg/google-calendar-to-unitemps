const { calendarMatcher } = require('../src/googlecalendar')

console.warn = jest.fn()
const calendars = [
  {
    id: 'a@group.calendar.google.com',
    summary: 'First calendar',
    primary: true
  },
  {
    id: 'b@group.calendar.google.com',
    summary: 'Second calendar'
  },
  {
    id: 'c@group.calendar.google.com',
    summary: 'Some other name',
    summaryOverride: 'Third calendar'
  }
]

test('Can match by id', () => {
  expect(calendarMatcher(calendars, 'c@group.calendar.google.com')).toBe(calendars[2])
})

test('Can match by id case-insensitively', () => {
  expect(calendarMatcher(calendars, 'C@GROUP.CALENDAR.GOOGLE.COM')).toBe(calendars[2])
})

test('Can match by summary', () => {
  expect(calendarMatcher(calendars, 'Second calendar')).toBe(calendars[1])
})

test('Can match by summary case-insensitively', () => {
  expect(calendarMatcher(calendars, 'sEconD caleNdar')).toBe(calendars[1])
})

test('Can match by summaryOverride', () => {
  expect(calendarMatcher(calendars, 'Third calendar')).toBe(calendars[2])
})

test('Can match by summaryOverride case-insensitively', () => {
  expect(calendarMatcher(calendars, 'third Calendar')).toBe(calendars[2])
})

test('Falls back to primary calendar if one exists', () => {
  expect(calendarMatcher(calendars, '')).toBe(calendars[0])
  expect(console.warn).toHaveBeenCalled()

  expect(calendarMatcher(calendars, 'this should not match')).toBe(calendars[0])
  expect(console.warn).toHaveBeenCalledTimes(2)
})

test('Falls back to undefined if no primary calendar exists', () => {
  expect(calendarMatcher([], '')).toBe(undefined)
  expect(console.warn).toHaveBeenCalled()
})
