USE studentclubs;

INSERT INTO
  Users (
    username,
    password,
    email,
    firstName,
    familyName,
    userType
  )
VALUES
  (
    'admin',
    '$2a$10$EapMP7QBfQxsJtraAY8lT.BZLXIpC2VlOEN6YGNFu3CzTtfOPnHvi',
    'admin@admin.com',
    'admin',
    'system',
    'admin'
  ),
  (
    'manager1',
    '$2a$10$wLViudQdkOrjouRaeCQuy.gT.e5TNdcRtk2absHgvNGGCpkgMN8PW',
    'manager@clubs.com',
    'Juan',
    'Diaz',
    'manager'
  ),
  (
    'manager2',
    '$2a$10$kLT/ZlDELezE7R6kv4I0oe2nySil158GL6hsaC./Pdjg59zrpbfny',
    'manager2@clubs.com',
    'Duan',
    'Jonson',
    'manager'
  ),
  (
    'manager3',
    '$2a$10$dNkyOBFy1xtcpH.3xd8LEuSoJ8dHohvpLIwrybPrReK7ACwKSZGAK',
    'manager3@clubs.com',
    'Jose',
    'Andorra',
    'manager'
  ),
  (
    'user1',
    '$2a$10$tGrdFPRKUzpRwabT48ApNuMYrmcpAGO47nFeCvjdlLw7BsX3y7meK',
    'user@user.com',
    'Sarah',
    'Swain',
    'user'
  );

INSERT INTO
  Clubs (short_name, name, category, manager)
VALUES
  (
    'AUVC',
    'Adelaide Uni Volleyball Club',
    'Sports',
    1
  ),
  ('ENG Club', 'Engineering Club', 'Engineering', 2),
  ('Med Society', 'Medical Society', 'Health', 3),
  (
    'CS Club',
    'Computer Science Club',
    'Computer Science',
    4
  );

INSERT INTO
  Managers (clubID, manager)
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4);

INSERT INTO
  ClubMembers (clubID, userID)
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (2, 3),
  (4, 1),
  (4, 2);

UPDATE Clubs
SET
  members = members + 1
WHERE
  clubID = 2;

UPDATE Clubs
SET
  members = members + 1
WHERE
  clubID = 4;

UPDATE Clubs
SET
  members = members + 1
WHERE
  clubID = 4;

INSERT INTO
  Events (
    name,
    description,
    starttime,
    endtime,
    rsvpLimit,
    clubID
  )
VALUES
  (
    'Event Test',
    'Test',
    '2023-06-08 2:30:00',
    '2023-06-08 3:30:00',
    80,
    2
  );

-- select u.userID, u.username, u.email, u.firstName, u.familyName, u.phone, u.userType, c.name from Users u join ClubMembers cm on u.userID = cm.userID join Clubs c on cm.clubID = c.clubID;
