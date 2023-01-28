require('dotenv').config()
const express = require('express')
const Name = require('./models/name')
const cors = require('cors')
// const morgan = require('morgan')
// morgan.token('post-data', function showData (req, res) {
//   if (req.method === 'POST') {
//     return JSON.stringify(req.body)
//   }
// })
const app = express()
app.use(express.static('build'))
app.use(express.json());
app.use(cors())
// app.use(morgan(
//   ':method :url :status :res[content-length] - :response-time ms :post-data'
//   ))


// removed in 3.13
// let persons = [
// ]


const isDup = (new_p) => {
  let dup = false
  persons.forEach(existing_p => {
    if (existing_p.name == new_p.name) {
      dup = true
    }
  })
  
  if (dup) {
    return true
  } else {
    return false
  }
}


app.get('/', (request, response) => {  // home page
  response.send('<h1>Hello World!</h1>')
})


app.get('/info', (request, response) => {  // get persons count at current time
  let htmlInfo = `
    Phonebook has info for ${persons.length} people <br />
    ${new Date()}
`
  response.send(htmlInfo)
})


app.get('/api/persons', (request, response) => {  // get all persons
  Name.find({}).then(names => {
    response.json(names)
  })
})


app.get('/api/persons/:id', (request, response) => {  // get person
  Name.findById(request.params.id)
    .then(name => {
      if (name) {
        response.json(name)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})


app.post('/api/persons', (request, response) => {  // add person
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const name = new Name({
    name: body.name,
    number: body.number
  })

  name.save().then(savedName => {
    response.json(savedName)
  })
})


app.delete('/api/persons/:id', (request, response) => {  // delete person
  Name.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
