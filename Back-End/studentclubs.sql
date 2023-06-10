-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: studentclubs
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8mb4 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

SET @@global.time_zone = "+00:00";
SET @@session.time_zone = "+00:00";
--
-- Current Database: `studentclubs`
DROP DATABASE IF EXISTS `studentclubs`;

--
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `studentclubs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `studentclubs`;

--
-- Table structure for table `ClubMembers`
--
DROP TABLE IF EXISTS `ClubMembers`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `ClubMembers` (
    `clubID` int unsigned NOT NULL,
    `userID` int unsigned NOT NULL,
    PRIMARY KEY (`clubID`, `userID`),
    KEY `userID` (`userID`),
    CONSTRAINT `ClubMembers_ibfk_1` FOREIGN KEY (`clubID`) REFERENCES `Clubs` (`clubID`),
    CONSTRAINT `ClubMembers_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

ALTER TABLE
  `ClubMembers`
  DROP FOREIGN KEY ClubMembers_ibfk_1,
  ADD FOREIGN KEY (clubID)
  REFERENCES Clubs(clubID)
  ON DELETE CASCADE;

ALTER TABLE
  `ClubMembers`
  DROP FOREIGN KEY ClubMembers_ibfk_2,
  ADD FOREIGN KEY (userID)
  REFERENCES Users(userID)
  ON DELETE CASCADE;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClubMembers`
--
LOCK TABLES `ClubMembers` WRITE;

/*!40000 ALTER TABLE `ClubMembers` DISABLE KEYS */;

/*!40000 ALTER TABLE `ClubMembers` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Clubs`
--
DROP TABLE IF EXISTS `Clubs`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `Clubs` (
    `clubID` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `short_name` varchar(20) NOT NULL,
    `category` varchar(50) NOT NULL,
    `description` text,
    `facebook` varchar(400),
    `twitter` varchar(400),
    `instagram` varchar(400),
    `discord` varchar(400),
    `manager` int unsigned NOT NULL,
    `members` int unsigned DEFAULT 1,
    `logo` varchar(2083) DEFAULT 'http://localhost:8080/club-logos/default-club.png',
    PRIMARY KEY (`clubID`),
    UNIQUE KEY `name` (`name`),
    UNIQUE KEY `short_name` (`short_name`),
    CONSTRAINT `Clubs_ibfk_1` FOREIGN KEY (`manager`) REFERENCES `Users` (`userID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `Clubs`
--
-- Table structure for table `Events`
--
DROP TABLE IF EXISTS `Events`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `Events` (
    `eventID` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `description` text NOT NULL,
    `starttime` timestamp NOT NULL,
    `endtime` timestamp NOT NULL,
    `rsvpLimit` int unsigned DEFAULT NULL,
    `clubID` int unsigned NOT NULL,
    PRIMARY KEY (`eventID`),
    KEY `clubID` (`clubID`),
    CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`clubID`) REFERENCES `Clubs` (`clubID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

ALTER TABLE
  `Events`
  DROP FOREIGN KEY Events_ibfk_1,
  ADD FOREIGN KEY (clubID)
  REFERENCES Clubs(clubID)
  ON DELETE CASCADE;
--
-- Dumping data for table `Events`
--
LOCK TABLES `Events` WRITE;

/*!40000 ALTER TABLE `Events` DISABLE KEYS */;

/*!40000 ALTER TABLE `Events` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Managers`
--
DROP TABLE IF EXISTS `Managers`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `Managers` (
    `manager` int unsigned NOT NULL,
    `clubID` int unsigned NOT NULL,
    PRIMARY KEY (`manager`, `clubID`),
    KEY `clubID` (`clubID`),
    CONSTRAINT `Managers_ibfk_1` FOREIGN KEY (`manager`) REFERENCES `Users` (`userID`),
    CONSTRAINT `Managers_ibfk_2` FOREIGN KEY (`clubID`) REFERENCES `Clubs` (`clubID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

ALTER TABLE
  `Managers`
  DROP FOREIGN KEY Managers_ibfk_1,
  ADD FOREIGN KEY (clubID)
  REFERENCES Clubs(clubID)
  ON DELETE CASCADE;

  ALTER TABLE
  `Managers`
  DROP FOREIGN KEY Managers_ibfk_2,
  ADD FOREIGN KEY (manager)
  REFERENCES Users(userID)
  ON DELETE CASCADE;

/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Managers` WRITE;

/*!40000 ALTER TABLE `Managers` DISABLE KEYS */;

/*!40000 ALTER TABLE `Managers` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `News`
--
DROP TABLE IF EXISTS `News`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `News` (
    `newsID` int unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(65) NOT NULL,
    `content` text NOT NULL,
    `status`
    SET
      ('public', 'private') DEFAULT 'public',
      `clubID` int unsigned NOT NULL,
      `posted` timestamp DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`newsID`),
      KEY `clubID` (`clubID`),
      CONSTRAINT `News_ibfk_1` FOREIGN KEY (`clubID`) REFERENCES `Clubs` (`clubID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

ALTER TABLE
  `News`
  DROP FOREIGN KEY News_ibfk_1,
  ADD FOREIGN KEY (clubID)
  REFERENCES Clubs(clubID)
  ON DELETE CASCADE;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News`
--
LOCK TABLES `News` WRITE;

/*!40000 ALTER TABLE `News` DISABLE KEYS */;

/*!40000 ALTER TABLE `News` ENABLE KEYS */;

UNLOCK TABLES;
--
-- Table structure for table `Rsvp`
--

DROP TABLE IF EXISTS `Rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rsvp` (
  `userID` int unsigned NOT NULL,
  `eventID` int unsigned NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`userID`,`eventID`),
  KEY `eventID` (`eventID`),
  CONSTRAINT `Rsvp_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`),
  CONSTRAINT `Rsvp_ibfk_2` FOREIGN KEY (`eventID`) REFERENCES `Events` (`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE
  `Rsvp`
  DROP FOREIGN KEY Rsvp_ibfk_1,
  ADD FOREIGN KEY (userID)
  REFERENCES Users(userID)
  ON DELETE CASCADE;

ALTER TABLE
  `Rsvp`
  DROP FOREIGN KEY Rsvp_ibfk_2,
  ADD FOREIGN KEY (eventID)
  REFERENCES Events(eventID)
  ON DELETE CASCADE;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rsvp`
--

LOCK TABLES `Rsvp` WRITE;
/*!40000 ALTER TABLE `Rsvp` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rsvp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--
DROP TABLE IF EXISTS `Users`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `Users` (
    `userID` int unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(25) NOT NULL,
    `password` varchar(70) NOT NULL,
    `email` varchar(63) NOT NULL,
    `firstName` varchar(63) NOT NULL,
    `familyName` varchar(63) NOT NULL,
    `phone` varchar(15) DEFAULT NULL,
    `gender`
    SET
      ('M', 'F', 'NB') DEFAULT NULL,
      `userType`
    SET
      ('user', 'admin', 'manager') DEFAULT 'user',
      `avatar` varchar(2083) DEFAULT 'http://localhost:8080/user-avatars/default-user.jpg',
      `provider_id` varchar(30),
      `provider`
    SET
      ('local', 'google', 'github') DEFAULT 'local',
      PRIMARY KEY (`userID`),
      UNIQUE KEY `username` (`username`),
      UNIQUE KEY `email` (`email`),
      UNIQUE KEY `provider_id` (`provider_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-14  2:40:37
