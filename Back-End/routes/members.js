var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const query =
      "SELECT u.userID, u.username, u.email, u.firstName, u.familyName, u.phone, u.userType, c.name FROM Users u JOIN ClubMembers cm ON u.userID = cm.userID JOIN Clubs c ON cm.clubID = c.clubID";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.post("/", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { clubID, userID } = req.body;

    const query = "INSERT INTO ClubMembers (clubID, userID) VALUES (?, ?)";

    connection.query(query, [clubID, userID], function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      const update = "UPDATE Clubs SET members = members + 1 WHERE clubID = ?";

      connection.query(update, clubID, function (err) {
        connection.release();

        if (err) {
          res.sendStatus(500);
          return;
        }
      });

      res.sendStatus(201);
    });
  });
});

router.post("/remove", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { clubID, userID } = req.body;

    let query = "DELETE FROM ClubMembers WHERE clubID = ? AND userID = ?";

    connection.query(query, [clubID, userID], function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      query = "UPDATE Clubs SET members = members - 1 WHERE clubID = ?";

      connection.query(query, clubID, function (err) {
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
      connection.release();

      res.sendStatus(200);
    });
  });
});

router.get("/club/:id", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { id } = req.params;

    const query =
      "SELECT u.userID, u.firstName, u.familyName, u.userType, u.gender, u.avatar FROM Users u JOIN ClubMembers cm ON u.userID = cm.userID JOIN Clubs c ON cm.clubID = c.clubID WHERE c.clubID = ?";
    connection.query(query, id, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.get("/club/:clubID/user/:userID", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { clubID, userID } = req.params;

    const query = "SELECT * FROM ClubMembers WHERE userID = ? AND clubID = ?";

    connection.query(query, [userID, clubID], function (err, rows) {
      connection.release();

      if (err) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        res.json({ joined: true });
      } else {
        res.json({ joined: false });
      }
    });
  });
});

module.exports = router;
