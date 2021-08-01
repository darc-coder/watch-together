const express = require('express')
const app = express()
const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// use params
app.get('/watch', (req, res) => {

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})