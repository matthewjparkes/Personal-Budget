const express = require('express')
const app = express();
const { v4: uuidv4 } = require('uuid');
const apiRouter = express.Router();
const envelopesRouter = express.Router();
const transactionRouter = express.Router(); 
const EnvtransactionRouter = express.Router();
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
apiRouter.use('/transactions', transactionRouter)




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

class transaction {

  constructor(name, amount, recipient, envelopeId){

      this.id = uuidv4();
      this.name = name
      this.amount = amount, 
      this.recipient = recipient,
      this.envelopeId = envelopeId,
      this.date = new Date()
  }

}




apiRouter.get('/', (req, res) => {
    res.send('Hello World')

    
  })

transactionRouter.get('/', (req, res) => {

  pool.query('SELECT * FROM transactions', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })

})

transactionRouter.param('transid', (req, res, next, transid) => {
  let transaction;
  pool.query('SELECT * FROM transactions where id = $1', [transid], (error, results) => {
      if (error) {
          return res.status(404).send('Envelope Not Found ' + error)
      }
      console.log(results.rows[0])
      transaction = results.rows[0]
      req.transaction = transaction; 
      next()
  })
  })


transactionRouter.get('/:transid', (req, res, next) => {
  console.log('Send Back')
  res.status(200).send(req.transaction)
})

transactionRouter.put('/:transid', (req, res, next) => {
  const { transaction } = req
  const { name, payment_amount, recipient, envelope_id} = req.body

  if (!name || !payment_amount || !recipient || !envelope_id) {
    return res.status(400).send('Invalid input: All transaction fields must be provided and not null');
  }

  pool.query('UPDATE transactions SET  name = $2, payment_amount = $3, recipient = $4, envelope_id = $5 where id = $1', [transaction.id, name, payment_amount, recipient, envelope_id], (error, results) => {
    if (error) {
        return res.status(404).send('Update' +  error)
    }
    res.status(200).send(transaction.id + ' Updated')
    next()
})
 
})

transactionRouter.delete('/:transid', (req, res, next) => {
    const { transaction } = req
    pool.query('DELETE FROM transactions where id = $1', [transaction.id,], (error, results) => {
      if (error) {
          return res.status(404).send('Delete' +  error)
      }
      res.status(200).send(transaction.id + ' Deleted')
      next()
  })
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
    
  

  pool.query('SELECT * FROM envelopes where id = $1', [id], (error, results) => {
      if (error) {
          return res.status(404).send('Envelope Not Found ' + error)
      }
      console.log(results.rows[0].total_budget);
      if(results.rows[0].total_budget < +req.headers['movingvalue']){
        return res.status(400).send('Not Enough Funds in Envelope')
      }
      let envelope = results.rows[0]
      console.log(+req.headers['movingvalue'])  
      envelope.updatedValue = (results.rows[0].total_budget - +req.headers['movingvalue'])
      
      console.log('Subtracted Value from ' + envelope.name)
      console.log(+req.headers['movingvalue'])
      req.fromEnvelope = envelope; 
      next()
  })

})

envelopesRouter.param('to', (req, res, next, id) => {

  let envelope;

  pool.query('SELECT * FROM envelopes where id = $1', [id], (error, results) => {
      if (error) {
          return res.status(404).send('Envelope Not Found ' + error)
      }
      console.log(results.rows[0])
      envelope = results.rows[0]
      envelope.updatedValue = envelope.total_budget + +req.headers['movingvalue']
      console.log('added Value to ' + envelope.name)
      req.ToEnvelope = envelope; 
      next()
  })
    
})

envelopesRouter.post('/:from/:to', (req, res, next) => {

  const { fromEnvelope, ToEnvelope } = req;

  console.log(fromEnvelope, ToEnvelope)

  pool.query('UPDATE envelopes SET total_budget = $2 where id = $1', [fromEnvelope.id, fromEnvelope.updatedValue], (error) => {
    if (error) {
      return res.status(404).send('Update Error' + error)
  }
    pool.query('UPDATE envelopes SET total_budget = $2 where id = $1', [ToEnvelope.id, ToEnvelope.updatedValue], (error) => {
      if (error) {
        return res.status(404).send('Update Error To Envelope' + error)
    }

    res.status(200).send(+req.headers['movingvalue']+' moved from ' + fromEnvelope.name + ' to ' + ToEnvelope.name)

  })
  }
)})

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

envelopesRouter.use('/:id/transaction', (req, res, next) => {


next()
}, EnvtransactionRouter)


EnvtransactionRouter.param('transid', (req, res, next, transid) => {
  let transaction;
  pool.query('SELECT * FROM transactions where id = $1', [transid], (error, results) => {
      if (error) {
          return res.status(404).send('Envelope Not Found ' + error)
      }
      console.log(results.rows[0])
      transaction = results.rows[0]
      req.transaction = transaction; 
      next()
  })
  })


EnvtransactionRouter.post('/add', (req, res, next) => {

  const { envelope } = req;
  if (!envelope) {
    return res.status(400).send('Envelope not found');
  }

    let transactionToBeAdded =  new transaction(req.body.name, req.body.amount, req.body.recipient, envelope.id)

    pool.query('INSERT INTO transactions (id, name, payment_amount, recipient, envelope_id, transactiondate) values ($1, $2, $3, $4, $5, $6)', [transactionToBeAdded.id, transactionToBeAdded.name, transactionToBeAdded.amount, transactionToBeAdded.recipient, transactionToBeAdded.envelopeId, transactionToBeAdded.date], (error, results) => {
      if (error) {
        throw error
      }
      console.log(results);
      res.status(200).send('Transaction added to '+ envelope.id)
    })

})

EnvtransactionRouter.get('/', (req, res, next) => {

  const { envelope } = req;
  console.log(envelope)
  if (!envelope) {
    return res.status(400).send('Envelope not found');
  }

  pool.query('SELECT * FROM transactions WHERE envelope_id = $1', [envelope.id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })

})







app.listen(PORT, ()=> {
    console.log('Listening on ' + PORT)
})