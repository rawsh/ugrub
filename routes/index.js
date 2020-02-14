var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');


/* GET home page. */
router.get('/', function(req, res, next) {
  let url = "https://umassdining.com/foodpro-menu-ajax?tid=1&date=02%2F15%2F2020";
  let settings = { method: "Get" };

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
        

          res.render('index', { title: 'Express', data: JSON.stringify(json) });
      });

});

module.exports = router;
