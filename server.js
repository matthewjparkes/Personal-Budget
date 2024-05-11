const express = require('express')
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(PORT, ()=> {
    console.log('Listening on ' + PORT)
})