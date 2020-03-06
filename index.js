var express = require("express");
var path = require('path');
const port = 8080;

var indexRouter = require('./routes/index');
var dbRouter = require('./routes/db');

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// homepage
app.get("/", dbRouter);
app.get("/updatedb/*", dbRouter);
app.get("/search/*", dbRouter);

// 404
app.use(function(req, res, next) {
    res.status(404);
    res.render('error');
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => console.log(`ugrub listening on port ${port}`))
