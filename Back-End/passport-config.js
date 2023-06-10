const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");

function initPassport(passport, db, res) {
  const authenticateUser = (username, password, done) => {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(401).json({ error: "Invalid input" });
        return;
      }

      const query = "SELECT * FROM Users WHERE username = ?";
      connection.query(query, username, async function (err, rows, fields) {
        connection.release();
        if (err) {
          res.status(401).json({ error: "No user with that username" });
          return;
        }

        if (rows.length === 0) {
          return done(null, false, { message: "No user with that username" });
        }

        const {
          userID,
          firstName,
          familyName,
          username,
          email,
          phone,
          userType,
          avatar,
          gender,
        } = rows[0];

        const user = {
          userID,
          firstName,
          familyName,
          username,
          email,
          phone,
          userType,
          avatar,
          gender,
        };

        if (await bcrypt.compare(password, rows[0].password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  };

  const googleAuthenticateUser = (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    db.getConnection(function (err, connection) {
      if (err) {
        throw err;
      }

      let query = "SELECT * FROM Users WHERE email = ?";
      connection.query(
        query,
        profile._json.email,
        function (firstConErr, rows) {
          if (firstConErr) {
            throw firstConErr;
          }
          if (rows.length === 0) {
            const password = Math.random().toString(36).substring(2);
            bcrypt.hash(password, 10, function (err, hash) {
              query =
                "INSERT INTO Users(username, password, email, firstName, familyName, avatar, provider_id, provider) VALUES (?,?,?,?,?,?,?,?)";
              const { sub, given_name, family_name, picture, email } =
                profile._json;
              connection.query(
                query,
                [
                  email.split("@")[0],
                  hash,
                  email,
                  given_name,
                  family_name,
                  picture,
                  sub,
                  profile.provider,
                ],
                function (err, rows) {
                  if (err) {
                    throw err;
                  }
                  connection.release();

                  const user = {
                    userID: rows.insertId,
                    firstName: given_name,
                    familyName: family_name,
                    avatar: picture,
                    email,
                  };
                  return done(null, user);
                }
              );
            });
          } else {
            const {
              userID,
              firstName,
              familyName,
              username,
              email,
              phone,
              userType,
              avatar,
              gender,
            } = rows[0];
            user = {
              userID,
              firstName,
              familyName,
              username,
              email,
              phone,
              userType,
              avatar,
              gender,
            };
            connection.release();

            return done(null, user);
          }
        }
      );
    });
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL:
          "https://stingray-app-3hd6p.ondigitalocean.app/auth/google/callback",
      },
      googleAuthenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    db.getConnection(function (err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      const query = "SELECT * FROM Users WHERE userID = ?";

      connection.query(query, user.userID, function (err, rows, fields) {
        connection.release();
        if (err) {
          throw err;
        }

        const {
          userID,
          firstName,
          familyName,
          username,
          email,
          phone,
          userType,
          avatar,
          gender,
        } = rows[0];

        const user = {
          userID,
          firstName,
          familyName,
          username,
          email,
          phone,
          userType,
          avatar,
          gender,
        };

        return done(null, user);
      });
    });
  });
}

module.exports = initPassport;
