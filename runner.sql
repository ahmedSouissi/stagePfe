-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  Dim 21 juin 2020 à 09:09
-- Version du serveur :  10.1.39-MariaDB
-- Version de PHP :  7.1.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `runner`
--

-- --------------------------------------------------------

--
-- Structure de la table `Acces_User_Event`
--

CREATE TABLE `Acces_User_Event` (
  `id` int(10) NOT NULL,
  `fk_event_id` int(10) NOT NULL,
  `fk_user_id` int(10) NOT NULL,
  `etat` int(3) NOT NULL COMMENT '0 en attende / 1 refusé / 2 accepté'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Acces_User_Event`
--

INSERT INTO `Acces_User_Event` (`id`, `fk_event_id`, `fk_user_id`, `etat`) VALUES
(1, 4, 5, 0);

-- --------------------------------------------------------

--
-- Structure de la table `Coordinate`
--

CREATE TABLE `Coordinate` (
  `id` int(20) NOT NULL,
  `fk_event_id` int(20) NOT NULL,
  `latitude` decimal(8,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Coordinate`
--

INSERT INTO `Coordinate` (`id`, `fk_event_id`, `latitude`, `longitude`) VALUES
(45, 1, '35.636571', '10.879527'),
(46, 1, '35.643721', '10.871373'),
(47, 1, '35.646458', '10.869485'),
(48, 1, '35.648516', '10.874356'),
(49, 1, '35.648690', '10.875064'),
(50, 1, '35.648743', '10.876716'),
(51, 1, '35.648359', '10.878905'),
(52, 1, '35.648342', '10.879356'),
(53, 1, '35.648359', '10.879720'),
(54, 1, '35.648185', '10.881566'),
(55, 1, '35.647923', '10.882639'),
(56, 1, '35.647452', '10.883776'),
(57, 1, '35.647417', '10.885149'),
(58, 1, '35.645709', '10.886458'),
(59, 1, '35.645063', '10.887359'),
(60, 1, '35.644802', '10.888153'),
(61, 1, '35.643930', '10.888282'),
(62, 1, '35.643477', '10.887424'),
(63, 1, '35.641628', '10.885428'),
(64, 1, '35.639884', '10.882930'),
(65, 1, '35.636925', '10.879912');

-- --------------------------------------------------------

--
-- Structure de la table `EVENT`
--

CREATE TABLE `EVENT` (
  `id` int(20) NOT NULL,
  `nom` varchar(30) NOT NULL,
  `genre` int(10) NOT NULL,
  `date` datetime NOT NULL,
  `ville` varchar(30) NOT NULL,
  `descriptionlocation` varchar(100) NOT NULL,
  `distance` varchar(30) NOT NULL,
  `nbrmaxinscrit` int(10) NOT NULL,
  `agemin` int(3) NOT NULL,
  `agemax` int(3) NOT NULL,
  `dossards` int(2) NOT NULL COMMENT '1 vrai / 0 faux',
  `nbrdossards` int(10) NOT NULL,
  `locationdassards` varchar(30) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `EVENT`
--

INSERT INTO `EVENT` (`id`, `nom`, `genre`, `date`, `ville`, `descriptionlocation`, `distance`, `nbrmaxinscrit`, `agemin`, `agemax`, `dossards`, `nbrdossards`, `locationdassards`, `description`) VALUES
(1, 'marathon kasr helal', 0, '2020-05-21 05:00:00', 'kasr helal', 'descrption location ', '5 km', 500, 12, 60, 1, 300, 'kasr helal', 'un marathon organisé par kasr helal'),
(2, 'marathon sayada', 0, '2020-06-11 12:00:00', 'sayada', 'descrption location ', '5 km', 500, 12, 60, 1, 300, 'sayada', 'un marathon organisé par sayada'),
(3, 'marathon etoile', 0, '2020-04-23 03:00:00', 'sayada', 'devant municipalite de sayada ', '6 km', 600, 12, 66, 0, 0, '', 'marathon description '),
(4, 'marathon name', 0, '2020-07-25 09:00:00', 'ksiba', 'ksiba location description', '7 km', 700, 11, 80, 1, 600, 'ksiba', 'un marathon organis2 par ksiba'),
(5, 'marathon lamta', 0, '2020-08-21 10:00:00', 'lamta', 'lamta chapati', '3 km', 300, 11, 70, 1, 150, 'lamta 9odem dar ka3biya', 'organisé par ka3biya ');

-- --------------------------------------------------------

--
-- Structure de la table `Event_User`
--

CREATE TABLE `Event_User` (
  `id` int(10) NOT NULL,
  `fk_event_id` int(10) NOT NULL,
  `fk_user_id` int(10) NOT NULL,
  `dossard` int(2) NOT NULL COMMENT '0 non / 1 oui',
  `number` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Event_User`
--

INSERT INTO `Event_User` (`id`, `fk_event_id`, `fk_user_id`, `dossard`, `number`) VALUES
(1, 3, 5, 0, 0),
(2, 1, 5, 0, 0),
(5, 3, 9, 0, 0),
(6, 2, 10, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `USER`
--

CREATE TABLE `USER` (
  `id` int(10) NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `motdepasse` varchar(20) NOT NULL,
  `sexe` int(1) NOT NULL DEFAULT '0' COMMENT '0 : man / 1 : female',
  `adresse` varchar(30) NOT NULL,
  `dateNaissance` date NOT NULL,
  `taille` int(3) NOT NULL,
  `poids` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `USER`
--

INSERT INTO `USER` (`id`, `nom`, `prenom`, `email`, `motdepasse`, `sexe`, `adresse`, `dateNaissance`, `taille`, `poids`) VALUES
(4, 'undefined', '', 'undefined', 'undefined', 0, '', '0000-00-00', 0, 0),
(5, 'ahmed', 'souissi', 'ahmedsouissi06@gmail.com', 'azerty', 0, '', '0000-00-00', 0, 0),
(9, 'ahmed', 'souissi', 'ahmedsouissi07@gmail.com', 'azerty', 0, '', '0000-00-00', 0, 0),
(10, 'ahmed', 'souissi', 'ahmedsouissi08@gmail.com', 'azerty', 0, '', '0000-00-00', 0, 0),
(11, 'ahmed', 'souissi', 'ahmedsouissi09@gmail.com', 'azerty', 0, '', '0000-00-00', 0, 0),
(13, 'haithem', 'ka3biya', 'ka3biya@live.fr', 'azerty', 0, 'lamta', '1994-04-23', 173, 78);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Acces_User_Event`
--
ALTER TABLE `Acces_User_Event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_id` (`fk_event_id`),
  ADD KEY `fk_user_id` (`fk_user_id`);

--
-- Index pour la table `Coordinate`
--
ALTER TABLE `Coordinate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_id_coordinate` (`fk_event_id`);

--
-- Index pour la table `EVENT`
--
ALTER TABLE `EVENT`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Event_User`
--
ALTER TABLE `Event_User`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eventid` (`fk_event_id`),
  ADD KEY `fk_userid` (`fk_user_id`);

--
-- Index pour la table `USER`
--
ALTER TABLE `USER`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Acces_User_Event`
--
ALTER TABLE `Acces_User_Event`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Coordinate`
--
ALTER TABLE `Coordinate`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT pour la table `EVENT`
--
ALTER TABLE `EVENT`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `Event_User`
--
ALTER TABLE `Event_User`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `USER`
--
ALTER TABLE `USER`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Acces_User_Event`
--
ALTER TABLE `Acces_User_Event`
  ADD CONSTRAINT `fk_event_id` FOREIGN KEY (`fk_event_id`) REFERENCES `EVENT` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`fk_user_id`) REFERENCES `USER` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Coordinate`
--
ALTER TABLE `Coordinate`
  ADD CONSTRAINT `fk_event_id_coordinate` FOREIGN KEY (`fk_event_id`) REFERENCES `EVENT` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Event_User`
--
ALTER TABLE `Event_User`
  ADD CONSTRAINT `fk_eventid` FOREIGN KEY (`fk_event_id`) REFERENCES `EVENT` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userid` FOREIGN KEY (`fk_user_id`) REFERENCES `USER` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
