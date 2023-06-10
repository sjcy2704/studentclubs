var express = require("express");
var router = express.Router();

router.post("/", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { userID, eventID } = req.body;

    const query = "INSERT INTO Rsvp (userID, eventID) VALUES (?,?)";

    connection.query(query, [userID, eventID], function (err) {
      connection.release();
      if (err) {
        res.sendStatus(err);
        return;
      }

      res.sendStatus(201);
    });
  });
});

router.get("/events/:eventID", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      throw err;
      return;
    }
    const { eventID } = req.params;

    const countQuery = "SELECT COUNT(*) as records FROM Rsvp WHERE eventID = ?";
    let totalRsvpd = 0;
    connection.query(countQuery, eventID, function (err, rows) {
      if (err) {
        res.sendStatus(500);
        throw err;
        return;
      }

      totalRsvpd = rows[0].records;
    });

    const query =
      "SELECT u.*, r.status FROM Users u INNER JOIN Rsvp r ON u.userID = r.userID WHERE r.eventID = ?";
    connection.query(query, eventID, function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        throw err;
        return;
      }

      res.json({ totalRsvpd, data: rows });
    });
  });
});

router.post("/remove", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { userID, eventID } = req.body;

    const query = "DELETE FROM Rsvp WHERE userID = ? AND eventID = ?";

    connection.query(query, [userID, eventID], function (err) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

router.get("/events/:eventID/users/:userID", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { eventID, userID } = req.params;

    const query = "SELECT * FROM Rsvp WHERE userID = ? AND eventID = ?";

    connection.query(query, [userID, eventID], function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        res.json({ rsvpd: true });
      } else {
        res.json({ rsvpd: false });
      }
    });
  });
});

router.post("/events/:eventID/users/:userID/update", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { eventID, userID } = req.params;
    const { status } = req.body;

    const query = "UPDATE Rsvp SET status = ? WHERE eventID = ? AND userID = ?";

    connection.query(query, [status, eventID, userID], function (err) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});
module.exports = router;
