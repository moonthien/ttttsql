-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.36 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for oncuoiky
CREATE DATABASE IF NOT EXISTS `oncuoiky` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `oncuoiky`;

-- Dumping structure for table oncuoiky.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table oncuoiky.users: ~6 rows (approximately)
INSERT INTO `users` (`id`, `username`, `password`, `avatar`, `email`, `role`, `birthday`) VALUES
	(1, 'Mai Quốc Trường', '123', 'https://randomuser.me/api/portraits/men/1.jpg', 'maiquoctruong2403@gmail.com', 'Admin', '2004-12-09'),
	(2, 'Jane Smith', '123', 'https://randomuser.me/api/portraits/women/2.jpg', 'jane@example.com', 'User', '2014-11-05'),
	(3, 'Mai Truong Mai', '123456789', 'http://localhost:3000/uploads/1733755381641.jpeg', 'maitruong24113@gmail.com', 'User', '2004-01-02'),
	(4, 'aaa', '123', 'http://localhost:3000/uploads/1733720765746.jpg', 'aa@gmail.com', 'User', '2024-11-03'),
	(5, 'bb chang', '12345', 'http://localhost:3000/uploads/1733759454248.jpg', 'nbbchang@gmail.com', 'User', '2003-01-13'),
	(6, 'Karina', '123456789', 'http://localhost:3000/uploads/1733759568132.jpeg', 'karinaaes1@gmail.com', 'User', '2002-12-16');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
