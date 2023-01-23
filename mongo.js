const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://joshu:${password}@cluster0.zzoxw6c.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const nameSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Name = mongoose.model('Name', nameSchema)


if (process.argv.length==3) {  // get all names
  console.log("phonebook:")
  Name.find({}).then(result => {
    result.forEach(name => {
      console.log(name.name, name.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length==5) {  // adding a name
  const tempName = process.argv[3]
  const tempNumber = process.argv[4]
  
  const name = new Name({
    name: tempName,
    number: tempNumber,
  })
  
  name.save().then(result => {
    console.log(`added ${tempName} number ${tempNumber} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log("Incorrect command line input.")
  mongoose.connection.close()
}
