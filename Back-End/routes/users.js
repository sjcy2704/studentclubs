var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const query = "SELECT * FROM Users";

    connection.query(query, function (err, rows, fields) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      connection.release();
      res.json(rows);
    });
  });
});

router.post("/remove", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { userID } = req.body;

    const query = "DELETE FROM Users WHERE userID = ?";

    connection.query(query, userID, function (err) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
    });
  });
});

router.get("/username/:username", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { username } = req.params;
    const query = "SELECT userID FROM Users WHERE username = ?";
    connection.query(query, username, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.get("/:userID/clubs", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { userID } = req.params;

    let { page = 1, limit = 16, category = null } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let query =
      "SELECT COUNT(*) as records FROM Clubs c INNER JOIN ClubMembers m ON c.clubID = m.clubID WHERE m.userID = ?";
    let pageCount = 0;

    if (category) {
      query =
        "SELECT COUNT(*) as records FROM Clubs c INNER JOIN ClubMembers m ON c.clubID = m.clubID WHERE m.userID = ? AND c.category = ?";
      connection.query(query, [userID, category], function (err, results) {
        if (err) {
          res.sendStatus(500);
          throw err;
          return;
        }

        pageCount = Math.ceil(results[0].records / limit);
      });
    } else {
      connection.query(query, userID, function (err, results) {
        if (err) {
          res.sendStatus(500);
          throw err;
          return;
        }

        pageCount = Math.ceil(results[0].records / limit);
      });
    }

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0) {
      limit = 1;
    }

    const offset = limit * page - limit;

    query =
      "SELECT c.* FROM Clubs c INNER JOIN ClubMembers m ON c.clubID = m.clubID WHERE m.userID = ? LIMIT ?,?";
    let values = [userID, offset, limit];

    if (category) {
      query =
        "SELECT c.* FROM Clubs c INNER JOIN ClubMembers m ON c.clubID = m.clubID WHERE m.userID = ? AND c.category = ? LIMIT ?,?";
      values = [userID, category, offset, limit];
    }

    connection.query(query, values, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        throw err;
        return;
      }

      res.json({ pageCount, data: rows });
    });
  });
});

router.get("/:userID/news", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { userID } = req.params;

    const query =
      "SELECT n.* From News n INNER JOIN ClubMembers c ON c.clubID = n.clubID WHERE c.userID = ?";

    connection.query(query, userID, function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.get("/:userID/rsvp", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { userID } = req.params;

    const query =
      "SELECT e.* FROM Events e INNER JOIN Rsvp r ON e.eventID = r.eventID WHERE r.userID = ?";

    connection.query(query, userID, function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

module.exports = router;
