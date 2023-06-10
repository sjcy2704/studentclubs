var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM Events";

    connection.query(query, function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.post("/", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      throw err;
    }
    const { name, description, starttime, endtime, clubID, rsvpLimit } =
      req.body;

    let query =
      "INSERT INTO Events (name, description, starttime, endtime, rsvpLimit, clubID) VALUES (?,?,?,?,?,?)";

    connection.query(
      query,
      [name, description, starttime, endtime, rsvpLimit, clubID],
      function (err) {
        if (err) {
          throw err;
        }
        connection.release();

        res.sendStatus(200);
      }
    );
  });
});

router.get("/:eventID", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { eventID } = req.params;

    const query = "SELECT * FROM Events WHERE eventID = ?";

    connection.query(query, eventID, function (err, rows) {
      if (err) {
        res.sendStatus(500);
        throw err;
        return;
      }

      connection.release();
      res.json(rows);
    });
  });
});

router.post("/update", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { name, description, starttime, endtime, rsvpLimit, eventID } =
      req.body;

    const query =
      "UPDATE Events SET name = ?, description = ?, starttime = ?, endtime = ?, rsvpLimit = ? WHERE eventID = ?";

    connection.query(
      query,
      [name, description, starttime, endtime, rsvpLimit, eventID],
      function (err) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        connection.release();

        res.send(200);
      }
    );
  });
});

router.post("/remove", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { eventID } = req.body;

    let query = "DELETE FROM Events WHERE eventID = ?";

    connection.query(query, eventID, function (err) {
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
