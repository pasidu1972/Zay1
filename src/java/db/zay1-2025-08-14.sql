-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: zay1
-- ------------------------------------------------------
-- Server version	8.4.0

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
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `line_1` text NOT NULL,
  `line_2` text NOT NULL,
  `city_id` int NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `user_id` int NOT NULL,
  `first_name` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `last_name` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `fk_address_city1_idx` (`city_id`),
  KEY `fk_address_user1_idx` (`user_id`),
  CONSTRAINT `fk_address_city1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`),
  CONSTRAINT `fk_address_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'no 48','sirisanga podesa',1,'51001',40,'pasidu','piyumantha'),(2,'158','Thalgahakatuwa',2,'23423',41,'Chamod','Fernando');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'prada'),(2,'nike'),(3,'lv'),(4,'zara');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `qty` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_user1_idx` (`user_id`),
  KEY `fk_cart_product1_idx` (`product_id`),
  CONSTRAINT `fk_cart_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_cart_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'polonnaruwa'),(2,'colombo');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_type`
--

DROP TABLE IF EXISTS `delivery_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_type`
--

LOCK TABLES `delivery_type` WRITE;
/*!40000 ALTER TABLE `delivery_type` DISABLE KEYS */;
INSERT INTO `delivery_type` VALUES (1,'WITHIN_COLOMBO',100),(2,'OUT_OF_COLOMBO',200);
/*!40000 ALTER TABLE `delivery_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `orders_id` int NOT NULL,
  `qty` int NOT NULL,
  `order_status_id` int NOT NULL,
  `delivery_type_id` int NOT NULL,
  `rating` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_item_product1_idx` (`product_id`),
  KEY `fk_order_item_order_status1_idx` (`order_status_id`),
  KEY `fk_order_item_delivery_type1_idx` (`delivery_type_id`),
  KEY `fk_order_item_orders1_idx` (`orders_id`),
  CONSTRAINT `fk_order_item_delivery_type1` FOREIGN KEY (`delivery_type_id`) REFERENCES `delivery_type` (`id`),
  CONSTRAINT `fk_order_item_order_status1` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`id`),
  CONSTRAINT `fk_order_item_orders1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_item_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,1,1,2,1,1,2),(7,1,32,2,3,2,0),(8,2,32,4,3,2,0),(9,1,33,1,3,2,0),(10,1,34,1,3,2,0),(11,1,35,1,3,2,0),(12,2,36,1,3,2,0),(13,1,37,1,3,2,0),(14,2,38,1,3,1,0);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status`
--

DROP TABLE IF EXISTS `order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status`
--

LOCK TABLES `order_status` WRITE;
/*!40000 ALTER TABLE `order_status` DISABLE KEYS */;
INSERT INTO `order_status` VALUES (1,'diliverd'),(2,'ware house'),(3,'pending');
/*!40000 ALTER TABLE `order_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_user1_idx` (`user_id`),
  KEY `fk_order_address1_idx` (`address_id`),
  CONSTRAINT `fk_order_address1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `fk_order_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,40,1,'2025-08-12 16:35:33'),(32,40,1,'2025-08-12 20:44:03'),(33,40,1,'2025-08-12 20:48:01'),(34,40,1,'2025-08-12 20:51:26'),(35,40,1,'2025-08-12 21:13:52'),(36,40,1,'2025-08-12 21:20:43'),(37,40,1,'2025-08-13 12:37:27'),(38,41,2,'2025-08-14 10:18:27');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `qty` int NOT NULL,
  `created_at` datetime NOT NULL,
  `status_id` int NOT NULL,
  `user_id` int NOT NULL,
  `brand_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_status1_idx` (`status_id`),
  KEY `fk_product_user1_idx` (`user_id`),
  KEY `fk_product_brand1_idx` (`brand_id`),
  CONSTRAINT `fk_product_brand1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `fk_product_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_product_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'1st product',' 1st product discription',10,6,'2025-08-08 21:22:19',2,40,3),(2,'2nd product',' 2nd product discription',20,8,'2021-08-08 21:29:54',2,40,1),(14,'Frock','good frock',1000,2,'2025-08-14 11:09:26',2,41,2);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'inactive'),(2,'active');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(45) NOT NULL,
  `verification` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL,
  `user_role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_user_role1_idx` (`user_role_id`),
  CONSTRAINT `fk_user_user_role1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (40,'pasidu','piyumantha','pasidu123@gmail.com','Pasidu!@#!133','693088','2025-08-08 21:10:00',1),(41,'Chamod','Fernando','chamodsanjula55@gmail.com','Chamo@123','680641','2025-08-14 08:53:47',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `id` int NOT NULL,
  `value` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-14 11:49:41
