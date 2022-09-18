if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
//require routes
const campgroundsRoute = require('./routes/campground')
const reviewsRoute = require('./routes/review');
const usersRoute = require('./routes/user')
//const exp = require('constants');
const session = require('express-session')
//const Joi = require('joi');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
//const dbUser = process.env.DB_USER
const MongoDBStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';



mongoose.connect( dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const app = express();


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
// Views folder and EJS setup:
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

//session
const sessionConfig = {
    store,
    name : 'session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie:{
        httpOnly : true,
        expires : Date.now() + 1000 * 60 *60 *24 * 7,
        maxAge : 1000 * 60 *60 *24 * 7
    }
}
app.use(session(sessionConfig))

//helmet
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/"
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/acegi/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash
app.use(flash());
app.use((req,res,next) =>{
    //console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})



/********/
//routes
//********/
app.use("/campgrounds", campgroundsRoute)
app.use("/campgrounds/:id/reviews", reviewsRoute)
app.use("/", usersRoute)




//home route
app.get('/', (req, res) => {
    res.render('home')
})





//error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

//port listen
app.listen(3000, () => {
    console.log("YELPCAMP APP SERVER RUNNING")
})