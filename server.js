// Setup empty JS object to act as endpoint for all routes
projectData = {}

var bodyParser = require('body-parser')

// Require Express to run server and routes
const express = require('express')
// Start up an instance of app
const app = express()

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors())

// Initialize the main project folder
app.use(express.static('website'))

// Setup Server
const port = 3000
const server = app.listen(port, listening)

function listening () {
  console.log('server runing')
  console.log(`running on local host : ${port}`)
}

// GET Method
app.get('/getRecentData', (req, res) => {
  res.send(JSON.stringify(projectData))
})

// POST Method
app.post('/saveData', saveData)

function saveData (req, res) {
  let responseData = req.body
  if (responseData.temperature) {
    let newEntry = {
      temperature: responseData.temperature,
      date: responseData.date,
      content: responseData.content
    }
    projectData = newEntry
  }
}
