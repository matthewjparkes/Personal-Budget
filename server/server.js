const express = require('express')
const app = express();
const { v4: uuidv4 } = require('uuid');
const apiRouter = express.Router();
const envelopesRouter = express.Router();
var cors = require('cors');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'BudgetEnvelopes',
  password: 'password',
  port: 5432,
})


module.exports = app;

const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(cors({origin: true}))
app.use('/api', apiRouter)
apiRouter.use('/envelope', envelopesRouter);



let data = {
    envelopes: [
    ]

}

class envelope {

    constructor(name, totalBudget){

        this.id = uuidv4();
        this.name = name
        this.totalBudget = totalBudget
        this.totalSpent = 0;

    }




}




apiRouter.get('/', (req, res) => {
    res.send('Hello World')

    
  })


envelopesRouter.get('/', (req, res) => {
    pool.query('SELECT * FROM envelopes', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
  })


envelopesRouter.post('/', (req, res, next) => {

    if(!req.body || !req.body.name || !req.body.totalBudget){
        return res.status(400).send('Invalid Input')
    }

    pool.query('SELECT * FROM envelopes where name = $1', [req.body.name], (error, results) => {
        if (error) {
          console.log('Test')
          throw error
        }
        if(results.rows.length > 0) {
            return res.status(409).send('Envelope already added with that name')
        }
        console.log('No Duplicate')

        let newEnvelope = new envelope(req.body.name, req.body.totalBudget)

        pool.query('INSERT INTO envelopes (id, name, total_budget) values ($1, $2, $3)', [newEnvelope.id, newEnvelope.name, newEnvelope.totalBudget], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results);
            res.status(200).send('Envelope Added ' + newEnvelope.id)
          })

      })

 
    
})

envelopesRouter.param('id', (req, res, next, id) => {

let envelope;

pool.query('SELECT * FROM envelopes where id = $1', [id], (error, results) => {
    if (error) {
        return res.status(404).send('Envelope Not Found ' + error)
    }
    console.log(results.rows[0])
    envelope = results.rows[0]
    req.envelope = envelope; 
    next()
})


})

envelopesRouter.param('from', (req, res, next, id) => {
    
    let envelope =  data.envelopes.find(e => e.id === id)
    let index = data.envelopes.findIndex(e => e.id === id)
    if (!envelope){
      return res.status(404).send('Envelope Not Found')
    }

    if(envelope.totalBudget < +req.headers['movingvalue']){
      return res.status(400).send('Not Enough Funds in Envelope')
    }

    data.envelopes[index].totalBudget -= +req.headers['movingvalue']
    console.log('Subtracted Value from ' + envelope.name)
    console.log(+req.headers['movingvalue'])


    req.fromEnvelope = envelope; 
    req.fromIndex = index
    next()

})

envelopesRouter.param('to', (req, res, next, id) => {
    
    let envelope =  data.envelopes.find(e => e.id === id)
    let index = data.envelopes.findIndex(e => e.id === id)
    if (!envelope){
      return res.status(404).send('Envelope Not Found')
    }

    
    data.envelopes[index].totalBudget += +req.headers['movingvalue']
    console.log('added Value to ' + envelope.name)


    req.ToEnvelope = envelope; 
    req.ToIndex = index
    next()

})

envelopesRouter.post('/:from/:to', (req, res, next) => {

    res.status(200).send(+req.headers['movingvalue'] + ' moved from ' + req.fromEnvelope.name + ' to ' + req.ToEnvelope.name)

})

envelopesRouter.get('/:id', (req, res, next) => {

    res.status(200).json(req.envelope)
})

envelopesRouter.put('/:id/update', (req, res, next) => {

    if (!req.body || !req.body.type){
        return res.status(400).send('Invalid Request')
    }



    if(req.body.type === 'AddExpenditure'){
        pool.query('UPDATE envelopes set total_expenditure = $1 where id = $2', [Number(req.body.changeExpenditure), req.envelope.id], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results);
            res.status(200).send('Expenditure added to ' + req.envelope.name + '. ' + req.body.changeExpenditure + 'added')
          })
        
    } else if (req.body.type === 'changeName') {

        pool.query('SELECT * FROM envelopes where name = $1', [req.body.name], (error, results) => {
            if (error) {
                throw error
              }
              if(results.rows.length > 0) {
                  return res.status(409).send('Envelope already added with that name')
              }
              console.log('No Duplicate')

              pool.query('UPDATE envelopes set name = $1 where id = $2', [req.body.name, req.envelope.id], (error, results) => {
                if (error) {
                    throw error
                  }

                console.log('Update')
                return res.status(200).send('Update Successful')
              })
            })






    } else if (req.body.type === 'changeBudget'){

        pool.query('UPDATE envelopes set total_budget = $1 where id = $2', [Number(req.body.changeBudget), req.envelope.id], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results);
            res.status(200).send('Expenditure added to ' + req.envelope.name + '. ' + req.body.changeExpenditure + 'added')
          })

    }else {
        return res.status(400).send('Update Type Not Recognised')
    }

})

envelopesRouter.delete('/:id/delete', (req, res, next) => {
    data.envelopes.splice(req.index, 1);
    res.send('Delete Successful ')
    console.log('Deleted');


})





app.listen(PORT, ()=> {
    console.log('Listening on ' + PORT)
})