-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 15, 2021 at 07:09 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `EpidCavalry`
--

-- --------------------------------------------------------

--
-- Table structure for table `advertissements`
--

CREATE TABLE `advertissements` (
  `idadvertissements` int(100) NOT NULL,
  `title` varchar(1000) DEFAULT NULL,
  `short_description` varchar(1000) DEFAULT NULL,
  `full_description` varchar(1000) DEFAULT NULL,
  `wages` int(100) DEFAULT NULL,
  `place` varchar(1000) DEFAULT NULL,
  `working_time` varchar(1000) DEFAULT NULL,
  `type` varchar(1000) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `advertissements`
--

INSERT INTO `advertissements` (`idadvertissements`, `title`, `short_description`, `full_description`, `wages`, `place`, `working_time`, `type`) VALUES
(1, 'The standard Lorem Ipsum passage, used since the 1500s', '\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"', 1500, 'Lorem Ipsum', ' used since the 1500s', 'Lorem'),
(2, 'Rackham', 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings', 'of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are ext', 1914, 'Section 1.10.33 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC', '1.10.33 ', ' 45 BC'),
(6, 'sqsqs', 'qsqs', 'qsqs', 1772727, 'qsqsqs', 'qsqsqs', 'qsqs');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `idcompanies` int(11) NOT NULL,
  `identity` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`idcompanies`, `identity`, `address`) VALUES
(1, 'Ramery', 'ramery@mail.fr'),
(2, 'renault', 'renault@mail.fr');

-- --------------------------------------------------------

--
-- Table structure for table `job_application`
--

CREATE TABLE `job_application` (
  `idjob_application` int(11) NOT NULL,
  `mail_sent` varchar(45) DEFAULT NULL,
  `name_concerned` varchar(45) DEFAULT NULL,
  `title` varchar(45) NOT NULL,
  `message` varchar(1000) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `job_application`
--

INSERT INTO `job_application` (`idjob_application`, `mail_sent`, `name_concerned`, `title`, `message`) VALUES
(1, 'toto@toto', 'LOUIS', 'toto', 'BONJOUR C\'EST MOI');

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `idnote` int(11) NOT NULL,
  `note` varchar(45) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `category` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `category`) VALUES
(1, 'lolo', 'lolo@gmail.com', '$2a$10$kCmXBoIjvzW6sjlBPKI2ZetTooDjIw.7DbOJ7b4HRwmgMPaKzqasi', 1),
(10, 'tibo', 'tibo@gmail.com', '$2a$10$IAnVEbuipTv53yRR35quWO5fQrlUQgNeaktrMsfwMBLSuH0H1hVOS', NULL),
(11, 'toto', 'toto@mail.com', '$2a$10$vOuBH2JCOi.WVLeJ9RLbreZsj6bU1WHQK4uEQqN/uQTJ.EB388ML.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_informations`
--

CREATE TABLE `users_informations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `graduate` varchar(100) DEFAULT NULL,
  `experience_lvl` varchar(100) DEFAULT NULL,
  `preffered_langage` varchar(100) DEFAULT NULL,
  `language_spoken` varchar(100) DEFAULT NULL,
  `skills` varchar(100) DEFAULT NULL,
  `hobbies` varchar(100) DEFAULT NULL,
  `educational_path` varchar(100) DEFAULT NULL,
  `professional_career` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_informations`
--

INSERT INTO `users_informations` (`id`, `name`, `surname`, `graduate`, `experience_lvl`, `preffered_langage`, `language_spoken`, `skills`, `hobbies`, `educational_path`, `professional_career`) VALUES
(1, 'azaz', 'azaz', 'azaza', '12', 'eses', 'xddx', 'dxddx', 'dxdxd', 'xdxdx', 'dx'),
(3, 'azaz', 'azaz', 'azaza', '12', 'eses', 'xddx', 'dxddx', 'dxdxd', 'xdxdx', 'dx'),
(4, 'azaz', 'azaz', 'azaza', '12', 'eses', 'xddx', 'dxddx', 'dxdxd', 'xdxdx', 'dx'),
(10, 'azaz', 'azaz', 'azaza', '12', 'eses', 'xddx', 'dxddx', 'dxdxd', 'xdxdx', 'dx'),
(11, 'aaa', 'aaa', 'aaa', '12', 'aa', 'aa', 'aaa', 'aaa', 'aa', 'aa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertissements`
--
ALTER TABLE `advertissements`
  ADD PRIMARY KEY (`idadvertissements`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`idcompanies`);

--
-- Indexes for table `job_application`
--
ALTER TABLE `job_application`
  ADD PRIMARY KEY (`idjob_application`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`idnote`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_informations`
--
ALTER TABLE `users_informations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advertissements`
--
ALTER TABLE `advertissements`
  MODIFY `idadvertissements` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `idcompanies` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `job_application`
--
ALTER TABLE `job_application`
  MODIFY `idjob_application` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `idnote` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users_informations`
--
ALTER TABLE `users_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
