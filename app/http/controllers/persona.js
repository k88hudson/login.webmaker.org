/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

var env = require( "../../../config/environment" );

module.exports = function ( UserHandle ) {

  function userCallback( err, user, query, res ) {
    if ( err ) {
      metrics.increment( "user.get.error" );
      res.json( 500, { error: err } );
      return;
    }

    if ( !user ) {
      res.json( 404, { error: err || "User not found for ID: " + query } );
      return;
    }

    metrics.increment( "user.get.success" );
    res.json( { user: user } );
  }

  return {
    getByEmail: function ( req, res ) {
      var email = req.params[ 0 ];
      UserHandle.getUserByEmail( email, function( err, user ) {
        userCallback( err, user, email, res );
      });
    }

  };
};
