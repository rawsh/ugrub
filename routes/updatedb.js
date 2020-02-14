var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');

router.get('/updatedb', function(req, res, next) {
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        // do something with JSON
        Object.keys(json).forEach(function(key) {
            var l = json[key];
            Object.keys(l).forEach(function(cat) {
            var lc = l[cat];
            console.log(lc);
            });
            // ...
        });

        res.render('updatedb', { title: 'Express', data: JSON.stringify(json) });
    });
});

module.exports = router;