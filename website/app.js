const countryCode = 'us'
const apiKey = 'dfd538add2c1f0fdde2b59c5d2cd4c5d'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather'
const baseUrl = 'http://localhost:3000'

const contentInput = document.getElementById('content')
const dateInput = document.getElementById('date')
const tempInput = document.getElementById('temp')
const generateButton = document.getElementById('generate')

generateButton.addEventListener('click', validation)

window.onload = function () {
  getData(`${baseUrl}/getRecentData`).then(function (finalData) {
    if (finalData.temperature) {
      setData(finalData.temperature, finalData.date, finalData.content)
    }
  })
}

function performAction () {
  const zipCode = document.getElementById('zip').value
  const feeling = document.getElementById('feelings').value

  setData('', '', '')

  getWeather(apiUrl, zipCode, apiKey)
    .then(function (data) {
      const apiData = {
        temperature: getCurrentTemperature(data.main.temp),
        date: getCurrentDate(),
        content: getContent(feeling, data.name)
      }
      postData(`${baseUrl}/saveData`, apiData)
    })
    .then(function () {
      getData(`${baseUrl}/getRecentData`).then(function (finalData) {
        if (finalData.temperature) {
          setData(finalData.temperature, finalData.date, finalData.content)
        }
      })
    })
}

const getWeather = async (apiUrl, zipCode, apiKey) => {
  const res = await fetch(
    `${apiUrl}?zip=${zipCode},${countryCode}&units=metric&appid=${apiKey}`
  )

  try {
    if (res.status === 404) {
      alert('No City with this Zip Code')
      return {
        main: {
          temp: ''
        }
      }
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred while fetching weather data.', error)
  }
}

const postData = async (Url = '', data = {}) => {
  const response = await fetch(Url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  try {
    const newData = await response.json()
    return newData
  } catch (error) {
    console.log('Error in PostData', error)
  }
}

const getData = async (Url = '') => {
  const response = await fetch(Url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  try {
    const newData = await response.json()
    return newData
  } catch (error) {
    console.log('Error in GetData', error)
  }
}

function setData (temperature, date, content) {
  tempInput.innerHTML = temperature
  dateInput.innerHTML = date
  contentInput.innerHTML = content
}

function validation () {
  const zip = document.getElementById('zip').value
  if (!(zip > 9999 && zip < 1000000)) {
    alert('Zip should be of 5 Digits')
  } else {
    performAction()
  }
}

function getContent (feeling, state) {
  return `${capitalize(feeling)} in ${capitalize(state)}`
}

function getCurrentTemperature (temperature) {
  return `${temperature} °C`
}

function getCurrentDate () {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  let currentDate = new Date()
  let formattedDate = `${currentDate.getDate()}-${
    months[currentDate.getMonth()]
  }-${currentDate.getFullYear()}`
  return formattedDate
}

function capitalize (s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
