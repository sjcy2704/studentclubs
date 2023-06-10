var express = require("express");
var router = express.Router();
var multer = require("multer");
const path = require("path");
const DIR = path.join(__dirname, "../public/club-logos");

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

router.get("/top", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const query = "SELECT * FROM Clubs ORDER BY members DESC";
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

router.get("/all", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const query = "SELECT * FROM Clubs";
    connection.query(query, function (err, rows) {
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
      throw err;
      return;
    }
    const { clubID } = req.body;

    const query = "DELETE FROM Clubs WHERE clubID = ?";
    connection.query(query, clubID, function (err) {
      if (err) {
        res.sendStatus(500);
        throw err;
        return;
      }

      connection.release();
      res.sendStatus(200);
    });
  });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let { page = 1, limit = 16, category = null } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let query = "SELECT COUNT(*) AS records FROM Clubs";
    let pageCount = 0;

    if (category) {
      query = "SELECT COUNT(*) AS records FROM Clubs WHERE category = ?";
      connection.query(query, category, function (err, results) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        pageCount = Math.ceil(results[0].records / limit);
      });
    } else {
      connection.query(query, function (err, results) {
        if (err) {
          res.sendStatus(500);
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

    query = "SELECT * FROM Clubs LIMIT ?, ?";
    const values = [offset, limit];

    if (category) {
      query = "SELECT * FROM Clubs WHERE category = ? LIMIT ?, ?";
      values.unshift(category);
    }

    connection.query(query, values, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json({ pageCount, data: rows });
    });
  });
});

router.post("/", upload.single("logo"), function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let {
      name,
      short_name,
      category,
      description,
      manager,
      facebook,
      twitter,
      instagram,
      discord,
    } = req.body;

    facebook = facebook === "null" ? null : facebook;
    twitter = twitter === "null" ? null : twitter;
    instagram = instagram === "null" ? null : instagram;
    discord = discord === "null" ? null : discord;

    let path;
    let query =
      "INSERT INTO Clubs(name, short_name, category, description, manager,facebook, twitter, instagram, discord) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let values = [
      name,
      short_name,
      category,
      description,
      manager,
      facebook,
      twitter,
      instagram,
      discord,
    ];

    if (req.file) {
      path = `${req.protocol}://${req.get("host")}/club-logos/${
        req.file.filename
      }`;

      values.push(path);

      query =
        "INSERT INTO Clubs(name, short_name, category, description, manager, facebook, twitter, instagram, discord, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    }

    connection.query(query, values, function (err, rows) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      query = "INSERT INTO Managers(clubID, manager) VALUES (?,?)";

      connection.query(query, [rows.insertId, manager], function (err) {
        if (err) {
          res.sendStatus(500);
          return;
        }
      });

      query = "INSERT INTO ClubMembers(clubID, userID) VALUES (?,?)";

      connection.query(query, [rows.insertId, manager], function (err) {
        if (err) {
          res.sendStatus(500);
          return;
        }
      });

      connection.release();

      res.sendStatus(201);
    });
  });
});

router.post("/update", upload.single("logo"), function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let {
      name,
      short_name,
      category,
      description,
      facebook,
      twitter,
      instagram,
      discord,
      clubID,
    } = req.body;
    console.log(req.body);

    facebook = facebook === "null" ? null : facebook;
    twitter = twitter === "null" ? null : twitter;
    instagram = instagram === "null" ? null : instagram;
    discord = discord === "null" ? null : discord;

    let path;
    let query =
      "UPDATE Clubs SET name = ?, short_name = ?, category = ?, description = ?,facebook = ?, twitter = ?, instagram = ?, discord = ? WHERE clubID = ?";
    let values = [
      name,
      short_name,
      category,
      description,
      facebook,
      twitter,
      instagram,
      discord,
      clubID,
    ];

    if (req.file) {
      path = `${req.protocol}://${req.get("host")}/club-logos/${
        req.file.filename
      }`;

      values.pop();
      values.push(path);
      values.push(clubID);

      query =
        "UPDATE Clubs SET name = ?, short_name = ?, category = ?, description = ?,facebook = ?, twitter = ?, instagram = ?, discord = ?, logo = ? WHERE clubID = ?";
    }

    connection.query(query, values, function (err, rows) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      connection.release();

      res.sendStatus(200);
    });
  });
});
router.get("/:id", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { id } = req.params;

    const query = "SELECT * FROM Clubs WHERE clubID = ?";
    connection.query(query, id, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      if (rows.length === 0) {
        res.sendStatus(404);
        return;
      }

      res.json(rows[0]);
    });
  });
});

router.get("/:id/managers", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { id } = req.params;

    const query = "SELECT manager FROM Managers WHERE clubID = ?";
    connection.query(query, id, function (err, rows) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      connection.release();
      res.json(rows);
    });
  });
});

router.get("/:id/events", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { id } = req.params;

    let query = "SELECT * FROM Events WHERE clubID = ?";

    connection.query(query, id, function (err, rows) {
      connection.release();

      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.get("/:id/news", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { id } = req.params;

    if (req.user) {
      let query = "SELECT * FROM ClubMembers WHERE userID = ? AND clubID = ?";

      connection.query(query, [req.user.userID, id], function (err, rows) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        let joined = false;
        if (rows.length > 0) {
          joined = true;
        }

        query = "SELECT * FROM News WHERE clubID = ?";

        if (!joined) {
          query = "SELECT * FROM News WHERE clubID = ? AND status = 'public'";
        }

        connection.query(query, id, function (err, rows) {
          connection.release();

          if (err) {
            res.sendStatus(500);
            return;
          }

          res.json(rows);
        });
      });
    } else {
      let query = "SELECT * FROM News WHERE clubID = ? AND status = 'public'";

      connection.query(query, id, function (err, rows) {
        connection.release();

        if (err) {
          res.sendStatus(500);
          return;
        }

        res.json(rows);
      });
    }
  });
});

router.get("/:clubID/news/manage", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { clubID } = req.params;

    const query = "SELECT * FROM News WHERE clubID = ?";

    connection.query(query, clubID, function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.get("/manager/:managerID", function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      throw err;
      return;
    }

    let { managerID } = req.params;

    let { page = 1, limit = 16, category = null } = req.query;

    managerID = parseInt(managerID);
    page = parseInt(page);
    limit = parseInt(limit);

    let query =
      "SELECT COUNT(*) AS records FROM Clubs c INNER JOIN Managers m ON c.clubID = m.clubID WHERE m.manager = ?";
    let pageCount = 0;

    if (category) {
      query =
        "SELECT COUNT(*) AS records FROM Clubs c INNER JOIN Managers m ON c.clubID = m.clubID WHERE m.manager = ? AND c.category = ?";

      connection.query(query, [managerID, category], function (err, results) {
        if (err) {
          res.sendStatus(500);
          throw err;
          return;
        }

        pageCount = Math.ceil(results[0].records / limit);
      });
    } else {
      connection.query(query, managerID, function (err, results) {
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
      "SELECT c.* FROM Clubs c INNER JOIN Managers m ON c.clubID = m.clubID WHERE m.manager = ? LIMIT ?,?";
    let values = [managerID, offset, limit];

    if (category) {
      query =
        "SELECT c.* FROM Clubs c INNER JOIN Managers m ON c.clubID = m.clubID WHERE m.manager = ? AND c.category = ? LIMIT ?,?";
      values = [managerID, category, offset, limit];
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

module.exports = router;
