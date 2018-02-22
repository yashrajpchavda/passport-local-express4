const express = require( "express" );
const router = express.Router();
const passport = require( "passport" );
const Account = require( "./../models/account" );


/* GET home page. */
router.get( "/", ( req, res ) => {
  res.render( "index", { user: req.user } );
} );

router.get( "/register", ( req, res ) => {
  res.render( "register", {} );
} );

router.post( "/register", ( req, res ) => {

  Account.register( new Account( { username: req.body.username } ), req.body.password, ( err, account ) => {

    if ( err ) {
      return res.render( "register", { info: err } );
    }

    passport.authenticate( "local" )( req, res, () => {
      res.redirect( "/" );
    } );

  } );

} );

router.get( "/login", ( req, res ) => {
  res.render( "login", { user: req.user } );
} );

router.post( "/login", passport.authenticate( "local", { failureRedirect: "/login", failureFlash: 'Blah blah!' } ), ( req, res ) => {
  res.redirect( "/" );
} );

router.get( "/logout", ( req, res ) => {
  req.logout();
  res.redirect( "/" );
} );

router.get( "/ping", ( req, res ) => {
  res.status( 200 ).send( "pong!" );
} );

module.exports = router;
