-- MySQL dump 10.13  Distrib 8.0.20, for Linux (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.20-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `follow`
--

CREATE DATABASE IF NOT EXISTS project;
SELECT USER dani IDENTIFIED BY 'Passw0rd';
GRANT ALL PRIVILEGES ON project.* to dani;

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `follower_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `create_rate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_rate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (30,3,1,'2020-07-01 20:09:19','2020-07-01 20:09:19'),(34,1,3,'2020-07-01 21:40:05','2020-07-01 21:40:05'),(35,1,2,'2020-07-01 21:44:18','2020-07-01 21:44:18'),(37,2,1,'2020-07-02 17:13:09','2020-07-02 17:13:09'),(39,5,1,'2020-07-04 16:56:31','2020-07-04 16:56:31');
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `msg_text` text NOT NULL,
  `id_user_send` int unsigned DEFAULT NULL,
  `id_user_recive` int unsigned DEFAULT NULL,
  `msg_send` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `create_message` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_message` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `rate_text` text NOT NULL,
  `points` int NOT NULL,
  `id_user_send` int unsigned DEFAULT NULL,
  `id_user_recive` int unsigned DEFAULT NULL,
  `rate_send` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `create_rate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_rate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
INSERT INTO `rates` VALUES (1,'testeando',5,2,1,'2020-07-01 23:07:02','2020-07-01 23:07:02','2020-07-01 23:07:02'),(2,'eqweqwe',2,2,3,'2020-07-01 23:11:12','2020-07-01 23:11:12','2020-07-01 23:11:12'),(5,'Me ha encantado viajar con Dani',5,5,1,'2020-07-03 23:39:02','2020-07-03 23:39:02','2020-07-03 23:39:02'),(6,'Testeando esto a ver que tal vai e cantas palabras tenho que metere',3,3,1,'2020-07-03 23:39:39','2020-07-03 23:39:39','2020-07-03 23:39:39');
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reel`
--

DROP TABLE IF EXISTS `reel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reel` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `photo` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `create_photo` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_photo` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reel`
--

LOCK TABLES `reel` WRITE;
/*!40000 ALTER TABLE `reel` DISABLE KEYS */;
INSERT INTO `reel` VALUES (5,1,'d514bba0-be23-11ea-8b3b-6ddb71f11844.jpg','undefined','2020-07-04 18:26:09','2020-07-04 18:26:09'),(6,1,'a89c62b0-be25-11ea-8b3b-6ddb71f11844.jpg','undefined','2020-07-04 18:39:14','2020-07-04 18:39:14'),(7,1,'b1afec80-be27-11ea-b0db-f7f559dda51e.jpg','Probando a ver si se ve xa o texto','2020-07-04 18:53:48','2020-07-04 18:53:48');
/*!40000 ALTER TABLE `reel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travels`
--

DROP TABLE IF EXISTS `travels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travels` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `locality` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `category` varchar(50) NOT NULL,
  `budget` float DEFAULT '0',
  `id_user` int unsigned NOT NULL,
  `create_travel` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_travel` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travels`
--

LOCK TABLES `travels` WRITE;
/*!40000 ALTER TABLE `travels` DISABLE KEYS */;
INSERT INTO `travels` VALUES (1,' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut auctor ante. Nullam venenatis erat et pulvinar laoreet. In auctor vehicula mi quis posuere. Vestibulum accumsan sagittis felis, vitae placerat turpis sagittis id. Phasellus lacinia augue suscipit metus consequat imperdiet. Nulla facilisi. Phasellus id bibendum quam, et interdum tellus. Phasellus.','Santiago de Compostela','2020-07-30','Turismo',1234,1,'2020-07-01 18:57:30','2020-07-03 19:51:39'),(3,'   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut auctor ante. Nullam venenatis erat et pulvinar laoreet. In auctor vehicula mi quis posuere. Vestibulum accumsan sagittis felis, vitae placerat turpis sagittis id. Phasellus lacinia augue suscipit metus consequat imperdiet. Nulla facilisi. Phasellus id bibendum quam, et interdum tellus. Phasellus.','Maldivas','2020-07-01','Relax',1000,1,'2020-07-01 19:01:07','2020-07-01 23:11:01'),(4,'   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut auctor ante. Nullam venenatis erat et pulvinar laoreet. In auctor vehicula mi quis posuere. Vestibulum accumsan sagittis felis, vitae placerat turpis sagittis id. Phasellus lacinia augue suscipit metus consequat imperdiet. Nulla facilisi. Phasellus id bibendum quam, et interdum tellus. Phasellus.','New York','2020-07-22','Turismo',2222,1,'2020-07-01 19:01:23','2020-07-01 19:01:23'),(5,'   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut auctor ante. Nullam venenatis erat et pulvinar laoreet. In auctor vehicula mi quis posuere. Vestibulum accumsan sagittis felis, vitae placerat turpis sagittis id. Phasellus lacinia augue suscipit metus consequat imperdiet. Nulla facilisi. Phasellus id bibendum quam, et interdum tellus. Phasellus.','Africa','2020-07-31','Mochileo',111,1,'2020-07-01 19:01:42','2020-07-01 19:01:42'),(6,'dsadasdasdasdsa','dsadsadsa','2020-07-02','dasdsadasdsa',213235000000,1,'2020-07-02 16:05:46','2020-07-03 23:38:35'),(8,'Ruta 66','Estados Unidos','2020-07-21','Turismo',1000,3,'2020-07-03 22:47:57','2020-07-03 22:47:57'),(9,'Vamonos de chill a mayorca','Mallorca','2020-07-21','Playa',200,3,'2020-07-03 22:48:25','2020-07-03 22:48:25'),(10,'TESTESANDO COUSAS A VER SE FUNCIONAN BEN','Probando final','2020-07-01','TESTESANDO',222,1,'2020-07-04 16:55:43','2020-07-04 16:57:26');
/*!40000 ALTER TABLE `travels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_choose_travel`
--

DROP TABLE IF EXISTS `user_choose_travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_choose_travel` (
  `id_user` int unsigned NOT NULL,
  `id_travel` int unsigned NOT NULL,
  `choose_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_admitted` tinyint(1) DEFAULT '0',
  `join_message` varchar(255) DEFAULT NULL,
  `create_user_choose_travel` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_user_choose_travel` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`,`id_travel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_choose_travel`
--

LOCK TABLES `user_choose_travel` WRITE;
/*!40000 ALTER TABLE `user_choose_travel` DISABLE KEYS */;
INSERT INTO `user_choose_travel` VALUES (1,8,'2020-07-03 22:48:43',1,'Hola que tal','2020-07-03 22:48:43','2020-07-03 22:49:13'),(1,9,'2020-07-03 22:48:49',1,'Hola que tal','2020-07-03 22:48:49','2020-07-03 22:49:11'),(3,6,'2020-07-03 23:37:47',1,'dasdsa','2020-07-03 23:37:47','2020-07-03 23:38:24'),(5,6,'2020-07-03 23:38:07',1,'dasdsadsa','2020-07-03 23:38:07','2020-07-03 23:38:28');
/*!40000 ALTER TABLE `user_choose_travel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(50) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `biography` varchar(200) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `profile_name` varchar(50) NOT NULL,
  `birthday` date NOT NULL,
  `tlf` varchar(50) DEFAULT NULL,
  `locality` varchar(50) DEFAULT NULL,
  `avatar_img` varchar(50) DEFAULT NULL,
  `role` enum('normal','admin') NOT NULL DEFAULT 'normal',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `registrationCode` varchar(255) DEFAULT NULL,
  `user_password_last_update` datetime NOT NULL,
  `create_user` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_user` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_login` (`user_login`),
  UNIQUE KEY `user_password` (`user_password`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'daanibarreiro','$2b$10$QaGMU8APdgOx1FLR4q56jeNiHzASHsdVAkmWCsNTQZQ.XKw3Zlu6O','Forever a Warrior','danielgonzalezbarreiro@gmail.com','Daniel Gonzalez','2020-07-14',NULL,'Galicia','3c6a7e20-bcc6-11ea-b298-590c1aadea4a.jpg','admin',1,NULL,'2020-07-01 18:30:12','2020-07-01 18:30:12','2020-07-03 00:43:40'),(3,'test2','$2b$10$08yWBG.DdShjNpXeM2Rrm.worJVA9ZYSVVSNDw5IW8XOFP3fXZ15a',NULL,'danielgonzalezbarreiro+test2@gmail.com','Usuario test 2','2020-07-29',NULL,NULL,NULL,'normal',1,NULL,'2020-07-01 20:07:06','2020-07-01 20:07:06','2020-07-01 20:07:50'),(5,'test1','$2b$10$OfsUh/DBxGunfabwlrbpZuRYe1SM99WaLQe10/E1Fx.VBbvmV4Bqu',NULL,'danielgonzalezbarreiro+test1@gmail.com','test1','2020-07-22',NULL,NULL,NULL,'normal',1,NULL,'2020-07-02 18:22:57','2020-07-02 18:22:57','2020-07-03 02:04:15');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-04 21:31:17
