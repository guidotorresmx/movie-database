-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 23, 2022 at 02:44 AM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recipes`
--

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(10) UNSIGNED NOT NULL,
  `recipe` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `encoded_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `recipe`, `name`, `encoded_name`) VALUES
(1, 'hamburger', '1 pound ground lean beef', 'pound-ground-lean-beef'),
(2, 'hamburger', '1 large egg', 'large-egg'),
(4, 'hamburger', '1/2 cup minced onion', 'cup-minced-onion'),
(5, 'hamburger', 'sliced cheese ', 'sliced-cheese'),
(6, 'hamburger', 'hamburger bread', 'hamburger-bread'),
(9, 'tacos', 'Tortilla ', 'tortilla-'),
(10, 'tacos', 'Eggs', 'eggs'),
(11, 'tacos', 'Sauce', 'sauce');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `encoded_name` varchar(50) NOT NULL,
  `descr` text,
  `date` date DEFAULT NULL,
  `filename` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `name`, `encoded_name`, `descr`, `date`, `filename`) VALUES
(1, 'hamburger', 'hamburger', 'Delicious restaurant-style, hamburger recipe made from lean beef. About 1 minute before burgers are done', '2022-04-22', 'hamburger.jpg'),
(9, 'Tacos', 'tacos', 'Food on a soft wrap', NULL, 'tacos.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `steps`
--

CREATE TABLE `steps` (
  `id` int(10) UNSIGNED NOT NULL,
  `recipe` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `encoded_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `steps`
--

INSERT INTO `steps` (`id`, `recipe`, `name`, `encoded_name`) VALUES
(1, 'hamburger', 'grill beef', 'grill-beef'),
(2, 'hamburger', 'put bread and beef together', 'put-bread-and-beef-together'),
(3, 'hamburger', 'put cheese on top', 'put-cheese-on-top'),
(4, 'hamburger', 'finish the assembly', 'finish-the-assembly'),
(5, 'tacos', 'heat the tortilla', 'heat-the-tortilla'),
(6, 'tacos', 'add the food on it', 'add-the-food-on-it'),
(7, 'tacos', 'enjoy', 'enjoy');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `steps`
--
ALTER TABLE `steps`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `steps`
--
ALTER TABLE `steps`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
