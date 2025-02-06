-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.7.26 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 musicplayer 的数据库结构
CREATE DATABASE IF NOT EXISTS `musicplayer` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `musicplayer`;

-- 导出  表 musicplayer.datas 结构
CREATE TABLE IF NOT EXISTS `datas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `author` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '佚名',
  `album` varchar(255) COLLATE utf8_unicode_ci DEFAULT '无专辑',
  `format` varchar(50) COLLATE utf8_unicode_ci DEFAULT 'mp3',
  `duration` time DEFAULT NULL,
  `chorusIn` float DEFAULT NULL,
  `chorusOut` float DEFAULT NULL,
  `BPM` int(11) DEFAULT NULL,
  `language` varchar(50) COLLATE utf8_unicode_ci DEFAULT '未知',
  `isTranslate` tinyint(1) DEFAULT NULL,
  `bgPositionY` int(11) DEFAULT NULL,
  `mainColor` varchar(50) COLLATE utf8_unicode_ci DEFAULT '#ffffff',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 正在导出表  musicplayer.datas 的数据：18 rows
DELETE FROM `datas`;
/*!40000 ALTER TABLE `datas` DISABLE KEYS */;
INSERT INTO `datas` (`id`, `title`, `author`, `album`, `format`, `duration`, `chorusIn`, `chorusOut`, `BPM`, `language`, `isTranslate`, `bgPositionY`, `mainColor`) VALUES
	(0, '三妖精SAY YA!!!', '森羅万象', 'エイセイパレード (Eternity parade)', 'mp3', '00:04:10', 77.2, 103, 150, 'jp', 1, 174, '#22161e');
/*!40000 ALTER TABLE `datas` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
