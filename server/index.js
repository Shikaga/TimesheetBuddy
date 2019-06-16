//query:
//user: emailAddress
//startTime: ISO 8601
//endTime: ISO 8601


const express = require('express')
const app = express()
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

app.get('/', function(req, res) {
    console.log("adsf", req.query.user)
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), 
            function(auth) {
                listEvents(auth, res, {
                    user: req.query.user,
                    startTime: req.query.startTime,
                    endTime: req.query.endTime
                });
            });
        });
})
app.listen(3000)

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, response, request) {
  const calendar = google.calendar({version: 'v3', auth});
  var startDate = new Date();
  startDate.setDate(startDate.getDate()-7);
  calendar.events.list({
    calendarId: request.user,
    timeMin: request.startTime,
    timeMax: request.endTime,
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      var returnEvents = [];
      events.map((event, i) => {
        var startTime = event.start.dateTime;
        var endTime = event.end.dateTime;
        if (!startTime) {
        startTime = event.start.date;
        }
        if (!endTime) {
        endTime = event.end.date;
        }
        var firstLine = (event.description || "").split(/(<br>|\n)/)[0].replace(/(<([^>]+)>)/ig, "")
        var timesheetCode = firstLine.match(/(Timesheet Code:)(.*)/) ? firstLine.match(/(Timesheet Code:)(.*)/)[2].trim() : "No Code"
              
        returnEvents.push({
            timesheetCode: timesheetCode,
            startTime: startTime,
            endTime, endTime,
            summary: event.summary
        });
      });
      response.end(JSON.stringify(returnEvents));
    } else {
        response.end("Something went wrong, speak to JP");
        console.log("Something went wrong, speak to JP");
    }
  });
}