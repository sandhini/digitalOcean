const express = require('express')
const app = express.Router();

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const sheetLink = '17WmUfU3AQNcbdf2bxVg9dK4pi9KzBQz5qIggw67L7t0'
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const decidedRange = 'B:G';
// Load client secrets from a local file.

app.get("/:condition/:id", function(req, res, next){
  //res.send("hyoiuou")

  // Authorization
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), datapull);
  });
  console.log(req.params)
  var type = req.params.condition.toLowerCase()
  var id = req.params.id.toLowerCase()
  console.log(id, type)
  // Callback function pulling data
  function datapull(auth) {
  const sheets = google.sheets({version: 'v4', auth});

  // Pulling the data from the specified spreadsheet and the specified range
  var result = sheets.spreadsheets.values.get({
    // (1) Changed spreadsheet ID
    spreadsheetId: sheetLink,
    // (2) Changed the range of data being pulled
    range: decidedRange,
  }, (err, response)=>{
    if (err) return console.log('The API returned an error: ' + err);

    // (3) Setting data for daily tracking
    const rows = response.data.values;
    keyList = rows[0]
    idIndex = -1
    for(var i = 0; i<keyList.length; i++){
      key = keyList[i].toLowerCase()
      if (key==type){
        idIndex = i
      }
    }
    if (idIndex==-1 || id == ""){
      res.send(rows)
    }
    var toRend = [rows[0]]
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&*+\.\/;<=>?@\[\]^_`{|}~]/g;
    for(var i = 1; i<rows.length; i++){
      check = rows[i][idIndex]
      check = check.split(',')
      console.log(check)
      for (var j = 0; j<check.length; j++){
        cleanStr = check[j].replace(punctRE, '').trim().toLowerCase();
        console.log(cleanStr,"ACTUAL::::", id)
        if (cleanStr.includes(id)){
          console.log('here')
          toRend.push(rows[i])
          break;
      }
    }
    }
    // (4) Rendering the page and passing the rows data in
    console.log(toRend)
    res.send(toRend)
  });
  }
})

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))







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
    if (err) return getNewToken(oAuth2Client, callback);
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
function getNewToken(oAuth2Client, callback) {
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
      if (err) return console.error('Error while trying to retrieve access token', err);
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
module.exports = app;
