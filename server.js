const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const fs = require('fs')
const path = require('path')
const tasksDb = require('./db/db.json')

app.use(express.static('public'))
app.use(express.json())


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.listen(PORT, () => {
    console.log(`listening for http://localhost:${PORT}`)
})