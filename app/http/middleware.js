module.exports.personaFilter = function(audience_whitelist) {
  return function(req, res, next) {
    if (!req.body.audience) {
      return res.json({
        "error": "Missing audience"
      });
    }

    if (audience_whitelist.indexOf(req.body.audience) === -1) {
      return res.json({
        "error": "Audience parameter not allowed"
      });
    }

    if (!req.body.assertion) {
      return res.json({
        "error": "Missing assertion"
      });
    }

    process.nextTick(next);
  };
};

var verify = require( "browserid-verify" )();

module.exports.personaVerifier = function(req, res, next) {
  verify(req.body.assertion, req.body.audience, function(err, email, response) {
    if (err) {
      return res.json({
        "error": "Persona verifier error",
        "verifier_error": err.toString()
      });
    }

    if (!email) {
      return res.json({
        "error": "Persona verifier error",
        "verifier_error": response
      });
    }

    //TODO GROSS
    // Format used by routes.user.getByEmail()
    req.params = [ email ];
    // Format used by routes.user.create()
    req.body.email = email;

    next();
  });
};
