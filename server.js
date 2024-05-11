const express = require('express')
const app = express();
const { v4: uuidv4 } = require('uuid');
const apiRouter = express.Router();
const envelopesRouter = express.Router();


module.exports = app;

const PORT = process.env.PORT || 4001;

app.use(express.json())
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
    res.send('Hello World!')
  })


envelopesRouter.get('/', (req, res) => {
    res.send(data.envelopes)
  })


envelopesRouter.post('/', (req, res, next) => {

    if(!req.body || !req.body.name || !req.body.totalBudget){
        return res.status(400).send('Invalid Input')
    }

    if(data.envelopes.some(e => e.name === req.body.name)){
        console.log('Duplicate')
        return res.status(409).send('Envelope already added with that name')
    }

    
    let newEnvelope = new envelope(req.body.name, req.body.totalBudget)
    data.envelopes.push(newEnvelope);
    res.status(200).send('Envelope Added ' + data.envelopes[data.envelopes.findIndex(e => e.id === newEnvelope.id)].id)
})

envelopesRouter.param('id', (req, res, next, id) => {

   let envelope =  data.envelopes.find(e => e.id === id)
   let index = data.envelopes.findIndex(e => e.id === id)
   if (!envelope){
     return res.status(404).send('Envelope Not Found')
   }
   req.envelope = envelope; 
   req.index = index
   next()

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
    res.status(200).send('Envelope Found ' + req.envelope.name)
})

envelopesRouter.put('/:id/update', (req, res, next) => {

    if (!req.body || !req.body.type){
        return res.status(400).send('Invalid Request')
    }

    let index = data.envelopes.findIndex(e => e.id === req.envelope.id)


    if(req.body.type === 'AddExpenditure'){
        data.envelopes[index].totalSpent += req.body.changeExpenditure
        
        res.status(200).send('Expenditure added to ' + req.envelope.name + '. ' + req.body.changeExpenditure + 'added')

    } else if (req.body.type === 'changeName') {
        if(data.envelopes.some(e => e.name === req.body.name)){
            console.log('Duplicate')
            return res.status(409).send('Envelope already added with that name')
        }
        
        data.envelopes[index].name = req.body.name
        console.log('Update')
        return res.status(200).send('Update Successful')

    } else if (req.body.type === 'changeBudget'){
        data.envelopes[index].totalBudget = req.body.changeBudget

        return res.status(200).send(req.envelope.name +' Budget changed to ' +  ' ' + req.body.changeBudget)

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