var express = require('express');
var router = express.Router();

var html2json = require('html2json').html2json;
var sanitizeHtml = require('sanitize-html');
var dateFormat = require('dateformat');
var cleaner = require('clean-html');
const cron = require('node-cron');
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

function updateDB(hall, day, callback) {
    let url = "https://umassdining.com/foodpro-menu-ajax?tid=" + hall + "&date=" + day;
    let settings = { method: "Get" };

    // fetch ugass from umass
    fetch(url, settings)
        .then(q => q.json())
        .then((json) => {

            // fs.writeFileSync("./html" + hall + ".json", JSON.stringify(json));

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
                console.log(hall);
                callback(true);
            }  catch (err) {
                console.log(err);
                callback(err);
            }
        });
}

// create database of all foods
var db, all, dates;
function updateIfNew() {
    try {
        db = {
            "1": JSON.parse(fs.readFileSync('./db1.json', 'utf8')),
            "2": JSON.parse(fs.readFileSync('./db2.json', 'utf8')),
            "3": JSON.parse(fs.readFileSync('./db3.json', 'utf8')),
            "4": JSON.parse(fs.readFileSync('./db4.json', 'utf8'))
        }
        all = db["1"]["food"].concat(db["2"]["food"],db["3"]["food"],db["4"]["food"]);
        dates = {
            "1": db["1"]["date"],
            "2": db["2"]["date"],
            "3": db["3"]["date"],
            "4": db["4"]["date"]
        }

        var vals = Object.values(dates);
        var curr = dateFormat(new Date(), "mm%2Fdd%2Fyyyy");
        for (var i=0; i<vals.length; ++i) {
            if (vals[i] !== curr) {
                // console.log(db[i]);
                // +1 since we want hall 1 at index 0
                updateDB(i+1, curr, function(res) {
                    if (res) {
                        console.log("updated!");
                    } else {
                        console.log(res);
                    }
                });
            }
        }
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
}

// run at start and every 30 minutes
updateIfNew();
cron.schedule("0 */30 * * * *", () => {
    updateIfNew();
});

router.get('/', function(req, res, next) {
    var day = dateFormat(new Date(), "mm%2Fdd%2Fyyyy");
    if (all !== []) { // dates: dates, hallday: null, curr: day
        res.render("search", {data: all});
    } else {
        res.sendStatus(500);
    }
});

router.get('/search/:db', function(req, res, next) {
    var day = dateFormat(new Date(), "mm%2Fdd%2Fyyyy");
    var hall = req.params.db;
    var halldb = db[hall]; // , dates: null, hallday: halldb["date"], curr: day
    res.render("search", {data: halldb["food"]});
});

router.get('/updatedb/:db', function(req, res, next) {
    var day = dateFormat(new Date(), "mm%2Fdd%2Fyyyy");
    var hall = req.params.db;
    var halldb = fs.readFileSync('./db' + hall +'.json', 'utf8');
    
    if (halldb.length !== 0) {
        try {
            halldb = JSON.parse(halldb);
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

    updateDB(hall, day, function(res) {
        res.sendStatus(200);
    });
        
});

module.exports = router;