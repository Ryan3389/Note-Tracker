//require express, app, fs, and selecting db file
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const fs = require('fs')
const path = require('path')
const tasksDb = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');

//allowing the application to have access to public folder/converting responses to json format
app.use(express.static('public'))
app.use(express.json())


// api paths

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (error, data) => {
        const taskData = JSON.parse(data)
        res.json(taskData)
    })
})

app.get('/api/notes/:id', (req, res) => {
    const targetedId = req.params.id
    fs.readFile('./db/db.json', (error, data) => {
        if (error) {
            console.error(error)
        } else {
            const parsedData = JSON.parse(data)
            const filteredTaskId = parsedData.find((task) => task.id === targetedId)

            res.json(filteredTaskId)
        }
    })
})

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newTask = {
            title,
            text,
            id: uuidv4()
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                const parsedTask = JSON.parse(data)
                parsedTask.push(newTask)

                fs.writeFile('./db/db.json', JSON.stringify(parsedTask, null, 4), (error) => error ? console.error(error) : console.info('Task added to file'))
            }
        })

        const response = {
            status: 'success',
            body: newTask
        }
        console.log(response)
        res.status(201).json(response)
        //stay here
    } else {
        res.status(500).json('Error in adding a new task')
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const taskId = req.params.id

    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        const taskData = JSON.parse(data)
        const filteredTaskData = taskData.filter((task) => task.id !== taskId)

        fs.writeFile('./db/db.json', JSON.stringify(filteredTaskData, null, 4), (error) => {
            if (error) {
                console.error(error)
            } else {
                console.info('task deleted')
                res.json({ message: 'Task deleted' })
            }
        })
    })
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(PORT, () => {
    console.log(`listening for http://localhost:${PORT}`)
})



