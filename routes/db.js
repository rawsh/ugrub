var express = require('express');
var router = express.Router();

var html2json = require('html2json').html2json;
var dateFormat = require('dateformat');
var fetch = require('node-fetch');
const fs = require('fs');

const dbpath = './dishes.json';

const url2name = {
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-hal.jpg": "Halal",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-veg.jpg": "Vegetarian",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-antibfr.jpg": "Antibiotic Free",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-sus.jpg": "Sustainable",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-loc.jpg": "Local",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-vegan.jpg": "Vegan",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-whlgrn.jpg": "Whole Grain"
}

var currDishes = JSON.parse(fs.readFileSync(dbpath, 'utf8'));

router.get('/search', function(req, res, next) {
    res.render("db", {data: currDishes["food"]});
});

router.get('/updatedb', function(req, res, next) {
    var day = dateFormat(new Date(), "mm%2Fdd%2Fyyyy");

    try {
        var curr = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
        if (curr["date"] === day) {
            console.log("up to date");
            res.sendStatus(200);
            return;
        }
    } catch (err) {
        res.sendStatus(500);
    }

    let url = "https://umassdining.com/foodpro-menu-ajax?tid=1&date=" + day;
    let settings = { method: "Get" };

    // fetch ugass from umass
    fetch(url, settings)
        .then(q => q.json())
        .then((json) => {

            let dishes = {
                date: day,
                food: []
            };

            Object.keys(json).forEach(function(key) {
                var l = json[key];
                Object.keys(l).forEach(function(cat) {
                    var lc = l[cat];
                    var jc = html2json(lc);
                    
                    // add food to the db list
                    jc.child.forEach(function(item) {
                        var res = {};
                        res.props = [];
                        if (item.attr.class === 'lightbox-nutrition') {
                            var c = item.child;
                            res.attr = c[0].attr;
                            res.name = c[0].child[0].text;

                            for (var i=1; i<c.length; ++i) {
                                if (c[i].tag === 'img') {
                                    var url = c[i].attr.src;
                                    if (url in url2name)
                                        res.props.push(url2name[url]);
                                }
                            }
                            dishes.food.push(res);
                        } 
                        // else {
                        //     console.log(item.child[0]);
                        // }
                    });
                });
            });

            try {
                fs.writeFileSync(dbpath, JSON.stringify(dishes));
                console.log("done");
                res.sendStatus(200);
            }  catch (err) {
                res.sendStatus(500);
            }
        });
        
});

module.exports = router;