var express = require('express');
var router = express.Router();


const passport = require('passport')

/* GET home page. */
router.get('/login', function(req, res, next) {
    const errors = req.flash().error || []
    res.render('login', { errors })
});

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res, next) => {
    res.redirect('/secret')
})

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}


router.get('/secret', ensureAuthenticated, (req, res, next) => {
    res.send('Secret Area')
})

module.exports = router;