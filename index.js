const express = require('express')
const morgan = require('morgan')
morgan.token('post-data', function showData (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
const app = express()
app.use(express.json());
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :post-data'
  ))


let persons = [
  { 
    name: "Arto Hellas", 
    number: "040-123456",
    id: 1
  },
  { 
    name: "Ada Lovelace", 
    number: "39-44-5323523",
    id: 2
  },
  { 
    name: "Dan Abramov", 
    number: "12-43-234345",
    id: 3
  },
  { 
    name: "Mary Poppendieck", 
    number: "39-23-6423122",
    id: 4
  }
]


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
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {  // get person
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    console.log(`Showing person of id: ${id}`)
    response.json(person)
  } else {
    response.status(404).end()
  }
})


app.post('/api/persons', (request, response) => {  // add person
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  if (!person.name) {
    return response.status(400).json({ error: 'missing name'});
  } else if (!person.number) {
    return response.status(400).json({ error: 'missing number'});
  } else if (isDup(person)) {
    return response.status(400).json({ error: 'name already exists'});
  } else {
    response.json(person)
    persons = persons.concat(person)
  }
})


app.delete('/api/persons/:id', (request, response) => {  // delete person
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(`Deleting person of id: ${id}`)
  response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
