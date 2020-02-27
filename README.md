# Google Calendar to Unitemps

Pull events out of Google Calendar and enters them in as a timesheet to Unitemps.

## Setup

1. Follow step 1 of the official [Node.js Quickstart](https://developers.google.com/calendar/quickstart/nodejs)
2. Run `npm install`
3. Set environment variables (can be set in `.env`):
- `UNITEMPS_USERNAME`
- `UNITEMPS_PASSWORD`
- `UNITEMPS_JOB_ID` (optional, will prompt)
- `UNITEMPS_TIMESHEET_ID` (optional, otherwise will try creating a new one)
- `CALENDAR_ID` (optional, will prompt)
- `TARGET_DATE` (optional, will prompt)
4. Create `tokens.json` (optional, will prompt)
5. Run `npm start`

## Limitations

This won't enter events that cross days (e.g. 11:30pm to 00:30am). As a simple workaround, just split the event into two (e.g. 11:30pm to midnight, midnight to 00:30am).

I'm unlikely to improve this as I rarely work over midnight. Feel free to submit a PR if you add this! :)