CREATE TABLE `customer_types` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL,
  `shorttype` char(1) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `note` json NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `customer_types.type__UN` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
