var express = require('express');
var router = express.Router();

var html2json = require('html2json').html2json;
var sanitizeHtml = require('sanitize-html');
var cleaner = require('clean-html');
var dateFormat = require('dateformat');
var fetch = require('node-fetch');
const fs = require('fs');

const url2name = {
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-hal.jpg": "Halal",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-veg.jpg": "Vegetarian",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-antibfr.jpg": "Antibiotic Free",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-sus.jpg": "Sustainable",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-loc.jpg": "Local",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-vegan.jpg": "Vegan",
    "http://af-foodpro1.campus.ads.umass.edu/foodpro/LegendImages/icon-whlgrn.jpg": "Whole Grain"
}

// create database of all foods
var db;
var all;
try {
    db = {
        "1": JSON.parse(fs.readFileSync('./db1.json', 'utf8')),
        "2": JSON.parse(fs.readFileSync('./db2.json', 'utf8')),
        "3": JSON.parse(fs.readFileSync('./db3.json', 'utf8')),
        "4": JSON.parse(fs.readFileSync('./db4.json', 'utf8'))
    }
    all = db["1"]["food"].concat(db["2"]["food"],db["3"]["food"],db["4"]["food"]);
} catch (e) {
    console.log(e);
    db = {
        "1": {},
        "2": {},
        "3": {},
        "4": {}
    }
    all = [];
}

router.get('/search', function(req, res, next) {
    var hall = req.params.db;
    if (all !== []) {
        res.render("search", {data: all});
    } else {
        res.sendStatus(500);
    }
});

router.get('/search/:db', function(req, res, next) {
    var hall = req.params.db;
    var halldb = db[hall];
    res.render("search", {data: halldb["food"]});
});

router.get('/updatedb/:db', function(req, res, next) {
    var day = dateFormat(new Date(), "mm%2Fdd%2Fyyyy");
    var hall = req.params.db;
    var halldb = db[hall];

    if (halldb.length !== 0) {
        try {
            if (halldb["date"] === day) {
                console.log("up to date");
                res.sendStatus(200);
                return;
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    let url = "https://umassdining.com/foodpro-menu-ajax?tid=" + hall + "&date=" + day;
    let settings = { method: "Get" };

    // fetch ugass from umass
    fetch(url, settings)
        .then(q => q.json())
        .then((json) => {

            fs.writeFileSync("./html" + hall + ".json", JSON.stringify(json));

            let dishes = {
                date: day,
                food: []
            };

            // console.log(json);

            Object.keys(json).forEach(function(key) {
                var l = json[key];
                Object.keys(l).forEach(function(cat) {
                    cleaner.clean(l[cat], function (lc) {                  
                        let sane = sanitizeHtml(lc, {
                            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
                            allowedAttributes: {
                                'a': [
                                    'data-ingredient-list', 
                                    'data-allergens', 
                                    'data-serving-size', 
                                    'data-calories',
                                    'data-calories-from-fat', 
                                    'data-total-fat', 
                                    'data-total-fat-dv',
                                    'data-sat-fat',
                                    'data-sat-fat-dv',
                                    'data-trans-fat',
                                    'data-cholesterol',
                                    'cholesterol_dv',
                                    'data-sodium',
                                    'data-sodium-dv',
                                    'data-total-carb',
                                    'data-total-carb-dv',
                                    'data-dietary-fiber',
                                    'data-dietary-fiber-dv',
                                    'data-sugars',
                                    'data-sugars-dv',
                                    'data-protein',
                                    'data-protein-dv',
                                    'data-dish-name'
                                ],
                                img: [ 'src' ]
                            }
                        });
                        //console.log(sane);
                        var jc = html2json(sane);
                        
                        // add food to the db list
                        jc.child.forEach(function(item) {
                            try {
                                var res = {};
                                res.props = [];
                                
                                if (item.node !== 'text') {
                                    var c = item.child;
                                    res.attr = c[0].attr;
                                    res.name = c[0].child[0].text;
                                    res.category = cat;
                                    res.location = hall;
                                    res.type = key;
                                    
                                    for (var i=1; i<c.length; ++i) {
                                        if (c[i].tag === 'img') {
                                            var url = c[i].attr.src;
                                            if (url in url2name)
                                                res.props.push(url2name[url]);
                                        }
                                    }
                                    dishes.food.push(res);
                                }
                            } catch (e) {
                                console.log(item);
                                console.log(e);
                            }
                            // else {
                            //     console.log(item.child[0]);
                            // }
                        });
                    });
                });
            });

            try {
                fs.writeFileSync("./db" + hall + ".json", JSON.stringify(dishes));
                res.sendStatus(200);
            }  catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
        
});

module.exports = router;