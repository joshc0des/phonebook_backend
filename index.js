require('dotenv').config()
const express = require('express')
const Name = require('./models/name')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(express.json());
app.use(cors())


app.get('/', (request, response) => {  // home page
  response.send('<h1>Hello World!</h1>')
})


app.get('/info', (request, response) => {  // get persons count at current time
  Name.countDocuments({}).then((count) => {
    let htmlInfo = `
    Phonebook has info for ${count} people <br />
    ${new Date()}
  `

  response.send(htmlInfo)
  })
})


app.get('/api/persons', (request, response) => {  // get all persons
  Name.find({}).then(names => {
    response.json(names)
  })
})


app.get('/api/persons/:id', (request, response, next) => {  // get person
  Name.findById(request.params.id)
    .then(name => {
      if (name) {
        response.json(name)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {  // add person
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
  .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  
  Name.findByIdAndUpdate(
    request.params.id, 
    name, 
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedName => {
      response.json(updatedName)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {  // delete person
  Name.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
