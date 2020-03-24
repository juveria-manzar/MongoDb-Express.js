var express = require('express');
var router = express.Router();

//special function to ensure that Id is matched correctly
const ObjectID = require('mongodb').ObjectID

/* GET home page. */
router.get('/', function(req, res, next) {
    const collection = req.app.locals.collection

    collection.find({})
        .toArray()
        .then(data => res.json(data))
});

//create 
router.post('/', (req, res, next) => {
    const collection = req.app.locals.collection
    const document = req.body

    collection
        .insert(document)
        .then(data => res.json(data))
})

//return
router.get('/:id', (req, res, next) => {
    const collection = req.app.locals.collection
    const id = ObjectID(req.params.id)

    collection
        .findOne({ _id: id })
        .then(data => res.json(data))
})

//updating one or two property (here:name) p
router.patch('/:id/name', (req, res, next) => {
    const collection = req.app.locals.collection
    const id = ObjectID(req.params.id)
    const newname = req.body.newname

    collection
        .updateOne({ _id: id }, { $set: { name: newname } })
        .then(data => res.json(data))
})

//updating(replacing) the whole document
router.put('/:id', (req, res, next) => {
    const collection = req.app.locals.collection
    const id = ObjectID(req.params.id)

    const newDocument = req.body
    collection
        .replaceOne({ _id: id }, newDocument)
        .then(data => res.json(data))
})

//delete
router.delete('/:id', (req, res, next) => {
    const collection = req.app.locals.collection
    const id = ObjectID(req.params.id)

    collection
        .deleteOne({ _id: id })
        .then(data => res.json(data))
})

module.exports = router;