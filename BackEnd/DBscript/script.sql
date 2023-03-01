-- ***************** DEBUT BASE DE DONEES tmp_db *****************

-- suppression de la base données tmp_db
DROP DATABASE IF EXISTS `tmp_db`;

-- création de la base de données tmp_db
CREATE DATABASE IF NOT EXISTS `tmp_db`;

-- accées à la base de données tmp_db
USE `tmp_db`;


-- Table structure for table `collaborator`
--

CREATE TABLE `collaborator` (
  `id` bigint(20) NOT NULL,
  `firstName` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `lastName` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `memberType` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '3',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('-1','0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `invitationToken` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT 0,
  `picture` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default.jpeg',
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- insertion dans la table collaborators
INSERT IGNORE INTO `collaborator` VALUES (1, 'Eric', 'Perdon', '98000000', "1", 'ericperdon@gmail.com', '$2y$10$hAHx2mytnjes9seSO5WNBeyw5ikfp1TW9e9nTFEyM/70CtrCdjRYG',"1",null, 'default.jpeg', CURRENT_TIME),
                                          (2, 'Sadek', 'Selmi', '99000001',"1", 'sadekselmi@gmail.com', '$2y$10$hAHx2mytnjes9seSO5WNBeyw5ikfp1TW9e9nTFEyM/70CtrCdjRYG',"1",null, 'default.jpeg', CURRENT_TIME),
                                          (3, 'Elon', 'Musk', '99000002',"2", 'elonmusk@gmail.com', '$2y$10$hAHx2mytnjes9seSO5WNBeyw5ikfp1TW9e9nTFEyM/70CtrCdjRYG',"1",null, 'default.jpeg', CURRENT_TIME),
                                          (4, 'Bill', 'Gates', '99000003',"3", 'billgates@gmail.com', '$2y$10$hAHx2mytnjes9seSO5WNBeyw5ikfp1TW9e9nTFEyM/70CtrCdjRYG',"1",null, 'default.jpeg', CURRENT_TIME),
                                          (5, 'Kais', 'Saied', '99000004',"1", 'kaissaied@gmail.com', '$2y$10$hAHx2mytnjes9seSO5WNBeyw5ikfp1TW9e9nTFEyM/70CtrCdjRYG',"1",null, 'default.jpeg', CURRENT_TIME);
-- password is equal to 1234

-- --------------------------------------------------------

--
-- Table structure for table `dependencies`
--

CREATE TABLE `dependencies` (
                                `id` bigint(20) UNSIGNED NOT NULL,
                                `dependencyType` int(11) NOT NULL DEFAULT 1,
                                `mainTask` bigint(20) UNSIGNED DEFAULT NULL,
                                `dependentTask` bigint(20) UNSIGNED DEFAULT NULL,
                                `created_at` timestamp NULL DEFAULT NULL,
                                `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- --------------------------------------------------------

--
--
-- Table structure for table `functional_requirement`
--

CREATE TABLE `functional_requirement` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version` bigint(20) UNSIGNED DEFAULT NULL,
  `author` bigint(20) NOT NULL,
  `parentId` bigint(20) UNSIGNED DEFAULT NULL,
  `labelId` bigint(20) UNSIGNED DEFAULT NULL,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `estimationTime` integer UNSIGNED DEFAULT NULL,
  `elapsedTime` integer UNSIGNED DEFAULT NULL,
  `status` integer UNSIGNED DEFAULT 0,
  `responsible` bigint(20) DEFAULT NULL,
  `statusKanban` bigint(20) UNSIGNED DEFAULT 1,
  `backlogID` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- insertion dans la table functional_requirements
INSERT IGNORE INTO `functional_requirement` VALUES (1, 2, 1, NULL,1, 'Exigence 1', 'description exigence 1', CURRENT_TIMESTAMP, 7200, 5400, 1, 1, 1, 1);
INSERT IGNORE INTO `functional_requirement` VALUES (2, 2, 1, 1,1,'Exigence 1.1', 'description exigence 1.1', CURRENT_TIMESTAMP, 7200, 5400, 1, 2, 1, 1);
INSERT IGNORE INTO `functional_requirement` VALUES (3, 2, 1, 1,1,'Exigence 1.2', 'description exigence 1.2', CURRENT_TIMESTAMP, 7200, 5400, 1, 1, 1, 1);
INSERT IGNORE INTO `functional_requirement` VALUES (4, 2, 1, NULL, 1,'Exigence 2', 'description exigence 2', CURRENT_TIMESTAMP, 7200, 8000, 0, 2, 1, 1);
INSERT IGNORE INTO `functional_requirement` VALUES (5, 2, 1, NULL, 1,'Exigence 3', 'description exigence 3', CURRENT_TIMESTAMP, 7200, 9200, 0, 1, 1, 1);

-- --------------------------------------------------------
-- --------------------------------------------------------
--
-- Structure de la table `meetings`
--

CREATE TABLE `meetings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `idSCRUMTeam` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- Structure de la table `join_meetings`
--

CREATE TABLE `join_meetings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `idMeeting` bigint(20) UNSIGNED DEFAULT NULL,
  `idCollaborator` bigint(20) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci ,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci  DEFAULT NULL,
  `githubRepo` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner` bigint(20) DEFAULT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- insertion dans la table projects
INSERT IGNORE INTO `project` VALUES (1, 'Platforme Educative', 'platforme e-learning ', 'ERP', 'https://github.com/...',1, CURRENT_TIME),
                                    (2, 'Chat App', 'application ', 'ERP', 'https://github.com/...',2, CURRENT_TIME),
                                    (3, 'Scrabble Game', 'jeu educative pour les enfants', 'ERP', 'https://github.com/...',3, CURRENT_TIME);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20)  UNSIGNED PRIMARY KEY AUTO_INCREMENT ,
  `tokenable_type` varchar(191)  COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id`   bigint(20) UNSIGNED   COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `token` varchar(64) UNIQUE COLLATE utf8mb4_unicode_ci DEFAULT '',
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL ,
  `last_used_at` timestamp NULL,
  `expires_at` timestamp  NULL ,
  `created_at` timestamp  NULL ,
  `updated_at` timestamp  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--
-- Table structure for table `labels`
--

CREATE TABLE `labels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT '',
  `color` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- insertion dans la table labels
INSERT IGNORE INTO `labels` VALUES (1, 'backend', 'label1', 'orange');

-- --------------------------------------------------------

--
-- Table structure for table `version`
--

CREATE TABLE `version` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` timestamp NULL DEFAULT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `project` bigint(20) UNSIGNED DEFAULT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- insertion dans la table versions
INSERT IGNORE INTO `version` VALUES (2, '1.0.0', NULL, NULL, 2, CURRENT_TIME);

-- --------------------------------------------------------
--
-- Table structure for table `scrum_team`
--
CREATE TABLE `scrum_team` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `productOwner` bigint(20) DEFAULT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --------------------------------------------------------
-- insertion dans la table scrum_team
INSERT IGNORE INTO `scrum_team` VALUES (1,'Robots', 1, CURRENT_TIME),
                                       (2,'DevTime', 1, CURRENT_TIME);

-- --------------------------------------------------------

--
-- Table structure for table `join_team`
--
CREATE TABLE `join_team` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `idCollaborator` bigint(20) NOT NULL,
  `idSCRUMTeam` bigint(20) UNSIGNED NOT NULL,
  `role` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `status` int DEFAULT 0,
  `dateJoined` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- insertion dans la table join_team
INSERT IGNORE INTO `join_team` VALUES (1,1,1, 'developer', 1, CURRENT_TIME);
-- --------------------------------------------------------
--
-- Table structure for table `works_on`
--
CREATE TABLE `works_on` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `idProject` bigint(20) UNSIGNED NOT NULL,
  `idSCRUMTeam` bigint(20) UNSIGNED NOT NULL,
  `startDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `endDate` timestamp  NULL,
  `status` int(1) NOT NULL,
  `kanbanTable` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --------------------------------------------------------
-- insertion dans la table works_on
INSERT IGNORE INTO `works_on` VALUES (1,1,1, CURRENT_TIME, 25-09-2022, 1, 1);
-- --------------------------------------------------------

--
-- Table structure for table `kanban_table`
--
CREATE TABLE `kanban_table` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --------------------------------------------------------
-- insertion dans la table kanban_table
INSERT IGNORE INTO `kanban_table` VALUES (1, 'Kanban');
-- --------------------------------------------------------

--
-- Table structure for table `kanban_column`
--
CREATE TABLE `kanban_column` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `kanbanTable` bigint(20) UNSIGNED NOT NULL,
  `order` integer NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --------------------------------------------------------
-- insertion dans la table kanban_column
INSERT IGNORE INTO `kanban_column` VALUES (1, 'To do', 1, 1),
                                          (2, 'Pending', 1, 2),
                                          (3, 'Done', 1, 3);

-- --------------------------------------------------------
--
-- Table structure for table `sprint`
--
CREATE TABLE `sprint` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `startDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `endDate`  timestamp  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --------------------------------------------------------
-- insertion dans la table sprint
INSERT IGNORE INTO `sprint` VALUES (1, 'sprint 1', CURRENT_TIME, 26-08-2022);

--
-- Table structure for table `backlog`
--
CREATE TABLE `backlog` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sprintID` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --------------------------------------------------------
-- insertion dans la table backlog
INSERT IGNORE INTO `backlog` VALUES (1, 1);



-- --------------------------------------------------------

--
-- Table structure for table `forgot_password_request`
--

CREATE TABLE `forgot_password_request` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `collaborator` bigint(20) NOT NULL,
  `token` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





-- --------------------------------------------------------


--
-- Indexes for dumped tables
--

--
-- Indexes for table `collaborator`
--
ALTER TABLE `collaborator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `collaborator_email_unique` (`email`),
  ADD UNIQUE KEY `collaborator_invitationtoken_unique` (`invitationToken`);


--
-- Indexes for table `dependencies`
--
ALTER TABLE `dependencies`
    ADD PRIMARY KEY (`id`),
  ADD KEY `dependencies_maintask_foreign` (`mainTask`),
  ADD KEY `dependencies_dependenttask_foreign` (`dependentTask`);


--
-- Indexes for table `functional_requirement`
--
ALTER TABLE `functional_requirement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `functional_requirement_parentid_foreign` (`parentId`),
  ADD KEY `functional_requirement_labelid_foreign` (`labelId`),
  ADD KEY `functional_requirement_version_foreign` (`version`),
  ADD KEY `author` (`author`);

--
-- Index pour la table `join_meetings`
--
ALTER TABLE `join_meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idMeeting` (`idMeeting`),
  ADD KEY `idCollaborator` (`idCollaborator`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `version`
--
ALTER TABLE `version`
  ADD PRIMARY KEY (`id`),
  ADD KEY `version_project_foreign` (`project`);

--
-- Indexes for table `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idSCRUMTeam` (`idSCRUMTeam`);

  --
-- Indexes for table `scrum_team`
--
ALTER TABLE `scrum_team`
  ADD PRIMARY KEY (`id`);
--
-- Indexes for table `join_team`
--
ALTER TABLE `join_team`
  ADD PRIMARY KEY (`id`);
--
-- Indexes for table `works_on`
--
ALTER TABLE `works_on`
  ADD PRIMARY KEY (`id`);
--
-- Indexes for table `kanban_table`
--
ALTER TABLE `kanban_table`
  ADD PRIMARY KEY (`id`);
--
-- Indexes for table `kanban_column`
--
ALTER TABLE `kanban_column`
  ADD PRIMARY KEY (`id`);

  -- Indexes for table `personal_access_tokens`

--

ALTER TABLE `personal_access_tokens`
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

-- Indexes for table `sprint`
--
ALTER TABLE `sprint`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `backlog`
--
ALTER TABLE `backlog`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `forgot_password_request`
--
ALTER TABLE `forgot_password_request`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `forgot_password_request_token_unique` (`token`),
  ADD KEY `forgot_password_request_collaborator_foreign` (`collaborator`);

--
-- AUTO_INCREMENT for dumped tables
--

--

--
-- AUTO_INCREMENT for table `collaborator`
--
ALTER TABLE `collaborator`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;


--

--
-- AUTO_INCREMENT for table `dependencies`
--
ALTER TABLE `dependencies`
    MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


--
-- AUTO_INCREMENT for table `functional_requirement`
--
ALTER TABLE `functional_requirement`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `version`
--
ALTER TABLE `version`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `join_labels`
--
ALTER TABLE `labels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `scrum_team`
--
ALTER TABLE `scrum_team`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


--
-- AUTO_INCREMENT for table `join_team`
--
ALTER TABLE `join_team`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


--
-- AUTO_INCREMENT for table `works_on`
--
ALTER TABLE `works_on`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kanban_table`
--
ALTER TABLE `kanban_table`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kanban_column`
--
ALTER TABLE `kanban_column`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sprint`
--
ALTER TABLE `sprint`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `backlog`
--
ALTER TABLE `backlog`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


--
-- Constraints for table `dependencies`
--
ALTER TABLE `dependencies`
    ADD CONSTRAINT `dependencies_dependenttask_foreign` FOREIGN KEY (`dependentTask`) REFERENCES `functional_requirement` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `dependencies_maintask_foreign` FOREIGN KEY (`mainTask`) REFERENCES `functional_requirement` (`id`) ON DELETE CASCADE;


--
-- AUTO_INCREMENT for table `forgot_password_request`
--
ALTER TABLE `forgot_password_request`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `join_meetings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `meetings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


--
-- Constraints for table `functional_requirement`
--
ALTER TABLE `functional_requirement`
  ADD CONSTRAINT `functional_requirement_ibfk_1` FOREIGN KEY (`author`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `functional_requirement_parentid_foreign` FOREIGN KEY (`parentId`) REFERENCES `functional_requirement` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `functional_requirement_labelid_foreign` FOREIGN KEY (`labelId`) REFERENCES `labels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `responsible_fk` FOREIGN KEY (`responsible`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `functional_requirement_version_foreign` FOREIGN KEY (`version`) REFERENCES `version` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kanban_column_foreign` FOREIGN KEY (`statusKanban`) REFERENCES `kanban_column` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `backlog_id_foreign` FOREIGN KEY (`backlogID`) REFERENCES `backlog` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `join_meetings`
--
ALTER TABLE `join_meetings`
  ADD CONSTRAINT `join_meetings_ibfk_1` FOREIGN KEY (`idMeeting`) REFERENCES `meetings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `join_meetings_ibfk_2` FOREIGN KEY (`idCollaborator`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `version`
--
ALTER TABLE `version`
  ADD CONSTRAINT `version_project_foreign` FOREIGN KEY (`project`) REFERENCES `project` (`id`) ON DELETE CASCADE;
COMMIT;

--
-- Constraints for table `scrum_team`
--
ALTER TABLE `scrum_team`
  ADD CONSTRAINT `productOwner_freign` FOREIGN KEY (`productOwner`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE;
COMMIT;

--
-- Constraints for table `join_team`
--
ALTER TABLE `join_team`
  ADD CONSTRAINT `idCollaborator_foreign` FOREIGN KEY (`idCollaborator`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `idSCRUMTeam_foreign` FOREIGN KEY (`idSCRUMTeam`) REFERENCES `scrum_team` (`id`) ON DELETE CASCADE;
--
-- Constraints for table `works_on`
--
ALTER TABLE `works_on`
  ADD CONSTRAINT `idProject_foreign2` FOREIGN KEY (`idProject`) REFERENCES `project` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `idSCRUMTeam_foreign2` FOREIGN KEY (`idSCRUMTeam`) REFERENCES `scrum_team` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kanbanTable_foreign2` FOREIGN KEY (`kanbanTable`) REFERENCES `kanban_table` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kanban_column`
--
ALTER TABLE `kanban_column`
  ADD CONSTRAINT `kanbanTable_foreign` FOREIGN KEY (`kanbanTable`) REFERENCES `kanban_table` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`idSCRUMTeam`) REFERENCES `scrum_team` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `backlog`
--
ALTER TABLE `backlog`
  ADD CONSTRAINT `backlog_bfk_1` FOREIGN KEY (`sprintID`) REFERENCES `sprint` (`id`) ON DELETE CASCADE;


--
-- Constraints for table `forgot_password_request`
--
ALTER TABLE `forgot_password_request`
  ADD CONSTRAINT `forgot_password_request_collaborator_foreign` FOREIGN KEY (`collaborator`) REFERENCES `collaborator` (`id`) ON DELETE CASCADE;







