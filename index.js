const express = require('express')
const app = express()
app.use(express.json());

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
  const person = request.body

  person['id'] = Math.floor(Math.random() * 100)
  
  response.json(person)

  persons = persons.concat(person)
  response.status(204).end()
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
