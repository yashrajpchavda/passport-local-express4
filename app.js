const express = require( "express" );
const path = require( "path" );
const favicon = require( "serve-favicon" );
const logger = require( "morgan" );
const cookieParser = require( "cookie-parser" );
const bodyParser = require( "body-parser" );
const mongoose = require( "mongoose" );
const passport = require( "passport" );
const LocalStrategy = require( "passport-local" ).Strategy;

const index = require( "./routes/index" );
const users = require( "./routes/users" );

const app = express();

// view engine setup
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "pug" );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger( "dev" ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( require( "express-session" )( {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static( path.join( __dirname, "public" ) ) );

app.use( "/", index );
app.use( "/users", users );

const Account = require( "./models/account" );
passport.use( new LocalStrategy( Account.authenticate() ) );
passport.serializeUser( Account.serializeUser() );
passport.deserializeUser( Account.deserializeUser() );

mongoose.connect( "mongodb://localhost:27017/passport_local_mongoose_express4" );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
  const err = new Error( "Not Found" );
  err.status = 404;
  next( err );
} );

// error handler
app.use( function ( err, req, res, next ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get( "env" ) === "development" ? err : {};

  // render the error page
  res.status( err.status || 500 );
  res.render( "error" );
} );

module.exports = app;
