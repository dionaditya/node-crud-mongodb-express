const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const mongoDB = 'mongodb://localhost:27017/myproject'

mongoose.connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'mongodb connection error'))

const Schema = mongoose.Schema

const CarsSchema = new Schema({
    id: String,
    type: String,
    name: String,
})

const userSchema = new Schema({
    id: String,
    name: String,
    idCardNumber: String,
    email: String,
    phoneNumber: String,
    address: String,
    serviceType: Number
})

const AccountSchema = new Schema({
    id: String,
    accountNumber: String,
    name: String,
    idCard: String,
    totalAmount: Number,
    timestamp: Date,
    historyTransaction: Array
})

const DepositSchema = new Schema({
    id: String,
    accountNumber: String,
    amount: Number,
    timestamp: Date
})

const TransferSameBankSchema = new Schema({
    id: String,
    accountNumberSender: String,
    accountNumberReceiver: String,
    amount: Number,
    timestamp: Date
})

const TransferToOtherBankSchema = new Schema({
    id: String,
    accountNumberSender: String,
    accountNumberReceiver: String,
    amount: Number,
    anotherBankCode: String,
    timestamp: Date
})

const ReceiveFromSameBankSchema = new Schema({
    id: String,
    accountNumberSender: String,
    amount: Number,
    timestamp: Date
})


const CarsModel = mongoose.model('CarsModel', CarsSchema)
const UserModel = mongoose.model('UserModel', userSchema)
const AccountModel = mongoose.model('Acc')

app.post('/cars', async (req, res) => {
    try {
        const cars = new CarsModel(req.body)
        const result = await cars.save();
        console.log(result)
        return res.status(200).send({
            success: true,
            result: result
        })
    } catch(error) {
        return res.status(500).send(error)
    }
})

app.get('/cars', async (req, res) => {
    try {
        const result = await CarsModel.find().exec()
        return res.status(200).send({
            success: true,
            result: result
        })
    } catch(error) {
        return res.status(404).send(error)
    }
})

app.get('/cars/:id', async (req, res) => {
    try {
        console.log(req.params)
        const {id} = req.params
        const result = await CarsModel
            .find({id: id})
            .exec()

        console.log(result)
        return res.status(200).send(result)
    } catch(error) {
        return res.status(404).send(error)
    }
})

app.put('/cars/:id', async (req, res) => {
    try {
        const {id} = req.params
        const car = await CarsModel
            .findOne({id: id})
            .exec()
        const result = await car.set(req.body).save()
        console.log(result)
        return res.status(200).send(result)
    } catch(error) {
        return res.status(500).send(error)
    }
})

app.delete('/cars/:id', async (req, res) => {
    try {
        const { id } = req.params
        const documents = await CarsModel
            .findOne({id: id})
            .exec()
        const result = await CarsModel
            .deleteOne({_id: documents._id})
            .exec()
        
        return res.status(200).send(result)

    } catch(error) {
        return res.status(500).send(error)
    }

 
})

app.listen(3000, () => {
    console.log('listen to port 3000')
})