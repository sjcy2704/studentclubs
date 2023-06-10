var express = require("express");
var router = express.Router();

var bcrypt = require("bcrypt");
var passport = require("passport");

var multer = require("multer");
const path = require("path");
const DIR = path.join(__dirname, "../public/user-avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

function checkAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    res.json({ authenticated: false });
  } else {
    next();
  }
}

router.get("/user", checkAuth, function (req, res) {
  res.json(req.user);
});

router.post("/user/update", upload.single("avatar"), function (req, res) {
  let {
    userID,
    firstName,
    familyName,
    username,
    password,
    email,
    gender,
    phone,
  } = req.body;

  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  familyName = familyName.charAt(0).toUpperCase() + familyName.slice(1);

  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (password) {
      bcrypt.hash(password, 10, function (err, hash) {
        let path;
        let values = [
          firstName,
          familyName,
          username,
          hash,
          email,
          phone,
          gender,
          userID,
        ];

        let query =
          "UPDATE Users SET firstName = ?, familyName = ?, username = ?, password = ?, email = ?, phone = ?, gender = ? WHERE userID = ?";
        if (req.file) {
          path = `${req.protocol}://${req.get("host")}/user-avatars/${
            req.file.filename
          }`;
          values.pop();
          values.push(path);
          values.push(userID);

          query =
            "UPDATE Users SET firstName = ?, familyName = ?, username = ?, password = ?, email = ?, phone = ?, gender = ?, avatar = ? WHERE userID = ?";
        }

        connection.query(query, values, function (err) {
          connection.release();
          if (err) {
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        });
      });
    } else {
      let values = [
        firstName,
        familyName,
        username,
        email,
        phone,
        gender,
        userID,
      ];

      let query =
        "UPDATE Users SET firstName = ?, familyName = ?, username = ?, email = ?, phone = ?, gender = ? WHERE userID = ?";

      if (req.file) {
        let path = `${req.protocol}://${req.get("host")}/user-avatars/${
          req.file.filename
        }`;

        values.pop();
        values.push(path);
        values.push(userID);

        query =
          "UPDATE Users SET firstName = ?, familyName = ?, username = ?, email = ?, phone = ?, gender = ?, avatar = ? WHERE userID = ?";
      }

      connection.query(query, values, function (err) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    }
  });
});

router.post("/login", passport.authenticate("local"), function (req, res) {
  res.cookie("sessionid", req.session.id);
  req.user = req.session.passport.user;
  res.json(req.session.passport.user);
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.clearCookie("sessionid");
    return res.send("Logged Out Successfully");
  });
});

router.post("/signup", upload.single("avatar"), function (req, res, next) {
  let { firstName, familyName, username, password, email, phone, manager } =
    req.body;

  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  familyName = familyName.charAt(0).toUpperCase() + familyName.slice(1);

  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let userType = "user";
    if (manager === "true") {
      userType = "manager";
    }

    bcrypt.hash(password, 10, function (err, hash) {
      let path;
      let values = [
        firstName,
        familyName,
        username,
        hash,
        email,
        phone,
        userType,
      ];

      let query =
        "INSERT INTO Users (firstName, familyName, username, password, email, phone, userType) VALUES (?,?,?,?,?,?,?)";
      if (req.file) {
        path = `${req.protocol}://${req.get("host")}/user-avatars/${
          req.file.filename
        }`;
        values.push(path);

        query =
          "INSERT INTO Users (firstName, familyName, username, password, email, phone, userType, avatar) VALUES (?,?,?,?,?,?,?,?)";
      }

      connection.query(query, values, function (err) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(201);
      });
    });
  });
});

module.exports = router;
