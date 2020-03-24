var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const collection = req.app.locals.collection

    collection.find({})
        .toArray()
        .then(data => res.json(data))
});

module.exports = router;