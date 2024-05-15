//require express, app, fs, and selecting db file
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const fs = require('fs')
const path = require('path')
const tasksDb = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');

//Allowing app to use files in public folder
app.use(express.static('public'))
//Converting responses to JSON
app.use(express.json())



//API Paths

//Read db.json file and send data as a response
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (error, data) => {
        const noteData = JSON.parse(data)
        res.json(noteData)
    })
})

//filters out notes, returns notes that the id matches the req.params.id and sends it as a response
app.get('/api/notes/:id', (req, res) => {
    const targetedId = req.params.id
    fs.readFile('./db/db.json', (error, data) => {
        if (error) {
            console.error(error)
        } else {
            const parsedData = JSON.parse(data)
            const filteredNoteId = parsedData.find((note) => note.id === targetedId)

            res.json(filteredNoteId)
        }
    })
})

//takes in the data from the req, reads the current db.json file, writes a new file adding the req data into it
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                const parsedNote = JSON.parse(data)
                parsedNote.push(newNote)

                fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4), (error) => error ? console.error(error) : console.info('Note added to file'))
            }
        })
        //sends the response to the front end
        const response = {
            status: 'success',
            body: newNote
        }
        console.log(response)
        res.status(201).json(response)
        //stay here
    } else {
        res.status(500).json('Error in adding a new note')
    }
})

//filters out the targeted id and sends the updated file as a response
app.delete('/api/notes/:id', (req, res) => {
    const reqNoteId = req.params.id

    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        const noteData = JSON.parse(data)
        const filteredNoteData = noteData.filter((task) => task.id !== reqNoteId)

        fs.writeFile('./db/db.json', JSON.stringify(filteredNoteData, null, 4), (error) => {
            if (error) {
                console.error(error)
            } else {
                console.info('Note deleted')
                res.json({ message: 'Note deleted' })
            }
        })
    })
})

//HTML ROUTES

//Sends notes.html to front end
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})
//sends index.html to front end
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})


//listening for PORT
app.listen(PORT, () => {
    console.log(`listening for http://localhost:${PORT}`)
})



