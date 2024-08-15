const express = require('express')
const cors = require("cors")
const { body } = require('express-validator');
const {get, show, create, update, remove} = require('./noteController')
const app = express()
const port = 8080
const corsOptions = {
    origin: "http://localhost:3000",
}

function validator() {
    return [
        body('title').not().isEmpty().withMessage('Title Required!').escape(),
        body('body').escape(),
    ]
}

app.use(express.json())
app.use(cors(corsOptions));

app.get('/', get)
app.post('/', validator(), create)
app.get('/:id', show)
app.put('/:id', validator(), update)
app.delete('/:id', remove)

app.listen(port, () => {
    console.log(`URL : http://localhost:${port}/`)
})