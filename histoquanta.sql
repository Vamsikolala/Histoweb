-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 15, 2026 at 07:15 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `histoquanta`
--

-- --------------------------------------------------------

--
-- Table structure for table `disease`
--

CREATE TABLE `disease` (
  `disease_id` int(11) NOT NULL,
  `patient_id` varchar(50) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `report_type` varchar(255) DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `report` longtext DEFAULT NULL,
  `images` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disease`
--

INSERT INTO `disease` (`disease_id`, `patient_id`, `doctor_id`, `report_type`, `diagnosis`, `notes`, `report`, `images`, `created_at`) VALUES
(1, 'PT001', 10, 'Nan', 'Cancer', '', 'Diagnosis: Cancer\nNotes: \nReport Type: Nan', NULL, '2026-04-03 10:42:55'),
(2, 'PT004', 10, 'NAN', 'Neck', '', 'Diagnosis: Neck\nNotes: \nReport Type: NAN', NULL, '2026-04-07 10:18:16'),
(3, 'PT005', 10, 'Positive', 'Head', '', 'Diagnosis: Head\nNotes: \nReport Type: Nan', NULL, '2026-04-07 10:23:29'),
(5, 'PT012', 10, 'Naa', 'Positive', '', 'Diagnosis: Positive\nNotes: \nReport Type: Naa', '', '2026-04-22 04:06:12'),
(6, 'PT013', 10, 'Breast - Ki-67 Analysis', 'Ki-67: Intermediate Proliferation', 'Selected Range: 11–15%', 'CLINICAL ANALYSIS REPORT: KI-67 PROLIFERATION INDEX\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nPROLIFERATION INDEX (Ki-67): 11–15%\nINFERENCE: Intermediate Proliferation\n\nInterpretation: Intermediate proliferation index. Clinical correlation with other markers (ER/PR/HER2) is required.', '', '2026-04-22 04:20:11'),
(10, 'PT014', 10, 'HER2', 'Lungs', 'Equivocal (2  by gastric criteria)', 'CLINICAL ANALYSIS REPORT: LUNGS HER2\n-------------------------------------------\nPatient Name: Jeelni\nPatient ID: 11\n\nSELECTION: Equivocal (2  by gastric criteria)\nINFERENCE: Equivocal\n\nInterpretation: Weak/moderate basolateral staining in ≥9%of cells.\nInterpretation: Equivocal — NGS or ISH recommended for confirmation.', '', '2026-05-07 07:33:38'),
(19, 'PT018', 10, 'Er', 'Cancer', '', 'Diagnosis: cancer\nNotes: cancer\nReport Type:cancer', '', '2026-05-15 03:39:00'),
(20, 'PT019', 10, '', '', '', 'Diagnosis: \nNotes: \nReport Type:', '', '2026-05-27 02:54:45'),
(21, 'PT020', 10, '', '', '', 'Diagnosis: \nNotes: \nReport Type:', '', '2026-05-27 03:23:25'),
(22, 'PT001', 11, '', '', '', 'Diagnosis: \nNotes: \nReport Type:', '', '2026-05-27 03:50:51'),
(23, 'PT021', 10, '', '', '', 'Diagnosis: \nNotes: \nReport Type:', '', '2026-05-28 05:25:27');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `doctor_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `license_no` varchar(100) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `hospital_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `cover_pic` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_otp` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctor_id`, `name`, `license_no`, `specialization`, `hospital_name`, `email`, `phone_number`, `profile_pic`, `cover_pic`, `password`, `created_at`, `reset_otp`, `otp_expiry`) VALUES
(1, 'Dr. Antigravity', '123', 'Coding Expert', 'DeepMind HQ', '', '', NULL, NULL, '$2y$10$bsXbV9q/u83ke7w6sfP/yulWlPqrLdCQyTwpXenZOq3F5591OfgWO', '2026-04-01 10:31:27', NULL, NULL),
(2, 'Dr. Sarah Smith', 'MD12345', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$vlIPdzjB5G6YctuKGjGrIeteiOgyWOZJZY/hNABQ4zVHoF7oK7kGi', '2026-04-01 10:38:55', NULL, NULL),
(3, 'Dr.Suguna', 'MD80', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$wpWhsKnN5dOPP3MScUw5dunZJYgmuHDJd34tjqFrpIABDqPdMRUAK', '2026-04-02 09:47:47', NULL, NULL),
(4, 'Dr.priya', 'Ph123', 'Pathology', 'Saveetha', 'Priya@gmail.com', '6325897415', 'doctor_4_1775645347.jpg', NULL, '$2y$10$LcPydo6pNngrPZENzIh9Zu7dFjiyxaHjXt77wVZYiFYyHWKs3Ud0W', '2026-04-03 09:42:07', NULL, NULL),
(5, 'Dr.Nandha', 'LT0004', NULL, NULL, 'kolalavamsi123@gmail.com', NULL, NULL, NULL, '$2y$10$6u4zyNtYcCHxWBEKpInrh.BQgNqzNcHOEPPqPIG8.QWeZzY18uLzW', '2026-04-09 10:05:19', NULL, NULL),
(6, 'Bandha', 'LT1234', NULL, NULL, 'vamsik2062.sse@saveetha.com', NULL, NULL, NULL, '$2y$10$39XdXT6R7wLm48SRBrCAqeynWb2sWwwbM3gSy97beDNqaFBDxDsL.', '2026-04-09 10:06:47', NULL, NULL),
(7, 'Test Doctor', 'TEST1234', NULL, NULL, 'test@example.com', NULL, NULL, NULL, '$2y$10$UFbAj03Y1CnxaXblciUxbeesSUkbEesvxLNQa8Vq1IVaVYtPXBJky', '2026-04-10 10:02:38', NULL, NULL),
(8, 'Dr.priya', 'LT123', 'Pathology', 'Saveetha', 'priya@gmail.com', '9632587415', 'doctor_8_1777883094.jpg', NULL, '$2y$10$LcPydo6pNngrPZENzIh9Zu7dFjiyxaHjXt77wVZYiFYyHWKs3Ud0W', '2026-04-22 03:34:48', NULL, NULL),
(9, 'Dr.sanjay', 'LT122', NULL, NULL, 'sanjay@gmail.com', NULL, NULL, NULL, '$2y$10$3Zrp600vOG0DCSfMEUBEVOajd4tbOyosyLnLOLRzG3xB5c.bH.kLK', '2026-04-25 08:31:20', NULL, NULL),
(10, 'Dr.Hari', 'LT897', 'Pathology', 'Saveetha', 'kolalavamsivamsigoud@gmail.com', '8025963415', 'profile_10_1778816304.jpg', NULL, '$2y$10$AOro8T3wodD2yE16OGkhRue.Cc6V3P7dhJHtT9mSS26ivGHTSY2tK', '2026-05-07 05:01:29', '059986', '2026-05-07 07:20:40'),
(11, 'Sinega', 'PT12', NULL, NULL, 'Sinega@gmail.com', NULL, NULL, NULL, '$2y$10$Vyh4QOSG4et1sLpQBmSfnOkcxqbiR9KrP0Obu0U6Gm25xWCaIbQ7O', '2026-05-27 03:50:03', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `patient_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `doctor_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_id`, `name`, `age`, `gender`, `phone`, `address`, `doctor_id`, `created_at`) VALUES
('PT001', 'K Vamsi', 21, 'Male', '321456987', 'Chennai', 10, '2026-04-03 10:42:55'),
('PT001', 'Kiran', 65, 'Male', '6325897415', '', 11, '2026-05-27 03:50:51'),
('PT002', 'Hari', 25, 'Male', '369845213', 'Chennai', 10, '2026-04-07 10:08:38'),
('PT003', 'Hari', 25, 'Male', '80963258', 'Chennai', 10, '2026-04-07 10:15:29'),
('PT004', 'Hari', 25, 'Male', '8963257410', 'Chennai', 10, '2026-04-07 10:18:16'),
('PT005', 'Balaji', 25, 'Male', '69325874120', 'Mumbai', 10, '2026-04-07 10:23:29'),
('PT006', 'PTTestPatient', 22, 'Female', '', '', 10, '2026-04-08 10:22:17'),
('PT007', 'PTTestPatient2', 23, 'Male', '', '', 10, '2026-04-08 10:22:55'),
('PT008', 'Hardik', 30, 'Male', '321687522232', 'Chennai', 10, '2026-04-08 10:28:20'),
('PT009', 'Test Patient', 20, 'Male', '', '', 10, '2026-04-22 03:58:01'),
('PT010', 'Test Patient 1', 20, 'Male', '', '', 10, '2026-04-22 04:03:22'),
('PT011', 'New Test', 20, 'Male', '', '', 10, '2026-04-22 04:04:00'),
('PT012', 'Hari', 45, 'Male', '3698521478', 'Chennai', 10, '2026-04-22 04:06:12'),
('PT013', 'Deva', 35, 'Male', '698523698', 'Chennai', 10, '2026-04-22 04:20:11'),
('PT014', 'Jeelni', 31, 'Male', '9658741236', 'mysore', 10, '2026-04-27 06:55:21'),
('PT015', 'Vamsi', 21, 'Male', '6987451236', 'Chennai', 10, '2026-05-07 07:17:59'),
('PT016', 'Madhu', 56, 'Male', '6398214785', 'Chennai', 10, '2026-05-07 08:51:28'),
('PT017', 'Mano', 25, 'Male', '3698521478', 'Thandalam', 10, '2026-05-08 08:55:41'),
('PT018', 'Manoj', 35, 'Male', '96325874125', 'Chennai', 10, '2026-05-15 03:39:00'),
('PT019', 'dhanush', 25, 'Male', '69785653', 'Rangampeta', 10, '2026-05-27 02:54:45'),
('PT020', 'ravi', 45, 'Female', '369745123', '', 10, '2026-05-27 03:23:25'),
('PT021', 'Manoj kumar', 65, 'Male', '6398745125', 'Manoj@gmail.com', 10, '2026-05-28 05:25:27');

-- --------------------------------------------------------

--
-- Table structure for table `patient_analysis_reports`
--

CREATE TABLE `patient_analysis_reports` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT 0,
  `patient_id` varchar(50) NOT NULL,
  `tissue_type` varchar(50) NOT NULL,
  `marker` varchar(50) NOT NULL,
  `total_score` varchar(50) NOT NULL,
  `inference` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_analysis_reports`
--

INSERT INTO `patient_analysis_reports` (`id`, `doctor_id`, `patient_id`, `tissue_type`, `marker`, `total_score`, `inference`, `created_at`) VALUES
(1, 10, 'PT013', 'Breast', 'ER', 'Allred 6/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Deva\nPatient ID:      10\n\nSTAINING INTENSITY:   Moderate (2)\nPROPORTION SCORE:     36-60% (Score 4)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   6 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 6). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-04-22 08:57:54'),
(2, 10, 'PT013', 'Breast', 'ER', 'Allred 6/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Deva\nPatient ID:      10\n\nSTAINING INTENSITY:   Moderate (2)\nPROPORTION SCORE:     36-60% (Score 4)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   6 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 6). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-04-22 08:57:55'),
(3, 10, 'PT013', 'Breast', 'ER H-Score', 'H-Score: 38', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nSTAINING COMPONENTS:\n- Weak (1 ): 2%\n- Moderate (2 ): 6%\n- Strong (3 ): 8%\n\nTOTAL H-SCORE: 38\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-04-22 08:58:18'),
(4, 10, 'PT013', 'Breast', 'PR', 'Allred 7/8', 'CLINICAL ANALYSIS REPORT: BREAST PR (ALLRED)\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nSTAINING INTENSITY: Strong (3)\nPROPORTION SCORE: 36-60% (Score 4)\n\nTOTAL ALLRED SCORE: 7\nINFERENCE: Positive\n\nInterpretation: The sample shows significant PR positivity, indicating likely response to hormonal therapy.', '2026-04-22 08:58:40'),
(5, 10, 'PT013', 'Breast', 'PR H-Score', 'H-Score: 34', 'CLINICAL ANALYSIS REPORT: BREAST PR (H-SCORE)\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nSTAINING COMPONENTS:\n- Weak (1 ): 6%\n- Moderate (2 ): 5%\n- Strong (3 ): 6%\n\nTOTAL H-SCORE: 34\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows PR reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-04-22 08:58:54'),
(6, 10, 'PT013', 'Breast', 'HER2', 'Score 1', 'CLINICAL ANALYSIS REPORT: BREAST HER2\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nSTAINING INTENSITY: 1 \nPERCENTAGE OF TUMOR CELLS: > 10%\n\nINFERENCE: Negative\n\nInterpretation: HER2 negative. No clinical indication for targeted therapy.', '2026-04-22 08:59:05'),
(7, 10, 'PT013', 'Breast', 'Ki-67', '41–50%', 'CLINICAL ANALYSIS REPORT: KI-67 PROLIFERATION INDEX\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nPROLIFERATION INDEX (Ki-67): 41–50%\nINFERENCE: High Proliferation\n\nInterpretation: A high proliferation index (>30%) suggests a more aggressive tumor biology and may influence decisions regarding adjuvant chemotherapy.', '2026-04-22 08:59:11'),
(8, 10, 'PT013', 'Thyroid', 'Ki-67', '21%', 'CLINICAL ANALYSIS REPORT: THYROID Ki-67\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nKi-67 PROLIFERATION INDEX: 21%\nINFERENCE: High Risk / Aggressive\n\nAssociated Findings:\n1. Poorly differentiated thyroid carcinoma\n2. Anaplastic carcinoma\n\nClinical Interpretation: \nThe elevated Ki-67 index suggests higher proliferative activity, which may be associated with more invasive follicular variants or poorly differentiated morphology.', '2026-04-22 09:00:14'),
(9, 10, 'PT013', 'GIT', 'Adenocarcinoma HER2 (Surgical)', 'Score 1', 'CLINICAL ANALYSIS REPORT: GIT ADENOCARCINOMA HER2\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nSTAINING INTENSITY: 1 \nINFERENCE: Negative\n\nInterpretation: Negative for HER2 expression.', '2026-04-22 09:00:32'),
(10, 10, 'PT013', 'GIT', 'Adenocarcinoma HER2 (Surgical)', 'Score 1', 'CLINICAL ANALYSIS REPORT: GIT ADENOCARCINOMA HER2\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nSTAINING INTENSITY: 1 \nINFERENCE: Negative\n\nInterpretation: Negative for HER2 expression.', '2026-04-22 09:00:32'),
(11, 10, 'PT013', 'Soft Tissue', 'Ki-67', '41%', 'CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67\n-------------------------------------------\nPatient Name: Deva\nPatient ID: 10\n\nKi-67 PROLIFERATION INDEX: 41%\nWHO GRADE equivalent: Grade 3\n\nInterpretation: Grade 3 (High proliferation). Suggests a more aggressive Clinical behavior.', '2026-04-22 09:00:57'),
(12, 10, 'PT012', 'Breast', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-04-27 04:07:32'),
(13, 10, 'PT011', 'Breast', 'ER', 'Allred 6/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    New Test\nPatient ID:      8\n\nSTAINING INTENSITY:   Strong (3)\nPROPORTION SCORE:     11-35% (Score 3)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   6 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 6). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-02 04:24:49'),
(14, 10, 'PT011', 'Breast', 'ER H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: New Test\nPatient ID: 8\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-02 04:25:14'),
(15, 10, 'PT011', 'Thyroid', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT (THYROID)\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-02 04:25:35'),
(16, 10, 'PT011', 'Soft Tissue', 'Ki-67', '10–29%', 'CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67\n-------------------------------------------\nPatient Name: New Test\nPatient ID: 8\n\nSELECTED RANGE: 10–29%\nWHO GRADE equivalent: Grade 2\n\nInterpretation: Moderate proliferation. Intermediate risk — consider adjuvant RT in high-risk cases.', '2026-05-02 04:25:47'),
(17, 10, 'PT014', 'Lungs', 'HER2', 'Equivocal (2  by gastric criteria)', 'CLINICAL ANALYSIS REPORT: LUNGS HER2\n-------------------------------------------\nPatient Name: Jeelni\nPatient ID: 11\n\nSELECTION: Equivocal (2  by gastric criteria)\nINFERENCE: Equivocal\n\nInterpretation: Weak/moderate basolateral staining in ≥10% of cells.\nInterpretation: Equivocal — NGS or ISH recommended for confirmation.', '2026-05-05 03:55:19'),
(18, 10, 'PT015', 'Breast', 'ER', 'Allred 4/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Vamsi\nPatient ID:      PT001\n\nSTAINING INTENSITY:   Weak (1)\nPROPORTION SCORE:     11-35% (Score 3)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   4 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 4). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-07 07:18:21'),
(19, 10, 'PT015', 'Breast', 'ER H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: Vamsi\nPatient ID: PT001\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-07 07:18:30'),
(20, 10, 'PT002', 'Breast', 'ER', 'Allred 5/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Hari kumar\nPatient ID:      PT002\n\nSTAINING INTENSITY:   Weak (1)\nPROPORTION SCORE:     36-60% (Score 4)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   5 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 5). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-07 08:35:23'),
(22, 10, 'PT002', 'Breast', 'ER H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-07 08:35:37'),
(23, 10, 'PT002', 'Breast', 'PR', 'Allred 7/8', 'CLINICAL ANALYSIS REPORT: BREAST PR (ALLRED)\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nSTAINING INTENSITY: Strong (3)\nPROPORTION SCORE: 36-60% (Score 4)\n\nTOTAL ALLRED SCORE: 7\nINFERENCE: Positive\n\nInterpretation: The sample shows significant PR positivity, indicating likely response to hormonal therapy.', '2026-05-07 08:36:03'),
(24, 10, 'PT002', 'Breast', 'PR H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST PR (H-SCORE)\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows PR reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-07 08:36:10'),
(25, 10, 'PT002', 'Breast', 'HER2', 'Score 2', 'CLINICAL ANALYSIS REPORT: BREAST HER2\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nSTAINING INTENSITY: 2 \nPERCENTAGE OF TUMOR CELLS: ≤ 10%\n\nINFERENCE: Equivocal\n\nInterpretation: The result is Equivocal. Reflex testing using FISH is strongly recommended for final classification.', '2026-05-07 08:36:23'),
(26, 10, 'PT002', 'Breast', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-07 08:36:40'),
(27, 10, 'PT002', 'Thyroid', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT (THYROID)\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-07 08:36:51'),
(28, 10, 'PT002', 'GIT', 'Adenocarcinoma HER2 (Biopsy)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT BIOPSY HER2\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nSTAINING INTENSITY (Biopsy): 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-07 08:37:12'),
(29, 10, 'PT002', 'GIT', 'NET Stomach Grading', '21-55%', 'CLINICAL ANALYSIS REPORT: STOMACH NET GRADING\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nKi-67 INDEX RANGE: 21-55%\nGRADE: Grade 3 (G3)\n\nInterpretation: Well-differentiated neuroendocrine tumor — Grade 3 (G3)', '2026-05-07 08:37:21'),
(30, 10, 'PT002', 'GIT', 'NET Grading', '>20%', 'CLINICAL ANALYSIS REPORT: GIT NET GRADING\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nKi-67 INDEX RANGE: >20%\nWHO GRADE: Grade 3\nCLASS: Well differentiated neuroendocrine tumour - Grade 3\n\nInterpretation: Grade 3 (G3) neuroendocrine carcinoma indicated by high Ki-67 index. Highly aggressive biology.', '2026-05-07 08:37:28'),
(31, 10, 'PT002', 'GIT', 'GIST Ki-67', '41-50%', 'CLINICAL ANALYSIS REPORT: GIST KI-67\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nKi-67 INDEX RANGE: 41-50%\nCLASSIFICATION: High proliferative index\n\nInterpretation (Based on clinical criteria):\n- 0-5%: Low proliferative index\n- 6-20%: Intermediate proliferative index\n- >20%: High proliferative index', '2026-05-07 08:37:37'),
(32, 10, 'PT002', 'Soft Tissue', 'Ki-67', '10–29%', 'CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67\n-------------------------------------------\nPatient Name: Hari kumar\nPatient ID: PT002\n\nSELECTED RANGE: 10–29%\nWHO GRADE equivalent: Grade 2\n\nInterpretation: Moderate proliferation. Intermediate risk — consider adjuvant RT in high-risk cases.', '2026-05-07 08:37:46'),
(33, 10, 'PT002', 'Head', 'P16', 'Equivocal (50-70% staining)', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-07 08:37:55'),
(34, 10, 'PT002', 'Head', 'HER2', '3  positive', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-07 08:38:02'),
(37, 10, 'PT016', 'Breast', 'ER', 'Allred 3/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Madhu\nPatient ID:      PT003\n\nSTAINING INTENSITY:   Weak (1)\nPROPORTION SCORE:     1-10% (Score 2)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   3 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 3). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-07 08:51:39'),
(38, 10, 'PT016', 'Breast', 'ER H-Score', 'H-Score: 130', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 55%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 130\nINFERENCE: Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-07 08:51:49'),
(39, 10, 'PT016', 'Breast', 'PR', 'Allred 6/8', 'CLINICAL ANALYSIS REPORT: BREAST PR (ALLRED)\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSTAINING INTENSITY: Moderate (2)\nPROPORTION SCORE: 36-60% (Score 4)\n\nTOTAL ALLRED SCORE: 6\nINFERENCE: Positive\n\nInterpretation: The sample shows significant PR positivity, indicating likely response to hormonal therapy.', '2026-05-07 08:52:11'),
(40, 10, 'PT016', 'Breast', 'PR H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST PR (H-SCORE)\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows PR reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-07 08:52:21'),
(41, 10, 'PT016', 'Breast', 'HER2', 'Score 2', 'CLINICAL ANALYSIS REPORT: BREAST HER2\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSTAINING INTENSITY: 2 \nPERCENTAGE OF TUMOR CELLS: ≤ 10%\n\nINFERENCE: Equivocal\n\nInterpretation: The result is Equivocal. Reflex testing using FISH is strongly recommended for final classification.', '2026-05-07 08:52:43'),
(42, 10, 'PT016', 'Breast', 'Ki-67', '≥5%', 'KI67 ANALYSIS REPORT\nRange: ≥5%\nResult: High proliferative index.\nDescription: Suggestive of:\n• Hobnail/micropapillary variant PTC\n• Follicular Thyroid carcinoma', '2026-05-07 08:52:50'),
(43, 10, 'PT016', 'Thyroid', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT (THYROID)\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-07 08:52:58'),
(45, 10, 'PT016', 'GIT', 'NET Stomach Grading', '>55%', 'CLINICAL ANALYSIS REPORT: STOMACH NET GRADING\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nKi-67 INDEX RANGE: >55%\nGRADE: High grade\n\nInterpretation: Poorly-differentiated neuroendocrine carcinoma (NEC) — High grade', '2026-05-07 08:53:21'),
(47, 10, 'PT016', 'GIT', 'NET Grading', '>20%', 'CLINICAL ANALYSIS REPORT: GIT NET GRADING\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nKi-67 INDEX RANGE: >20%\nWHO GRADE: Grade 3\nCLASS: Well differentiated neuroendocrine tumour - Grade 3\n\nInterpretation: Grade 3 (G3) neuroendocrine carcinoma indicated by high Ki-67 index. Highly aggressive biology.', '2026-05-07 08:53:33'),
(48, 10, 'PT016', 'GIT', 'GIST Ki-67', '31-40%', 'CLINICAL ANALYSIS REPORT: GIST KI-67\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nKi-67 INDEX RANGE: 31-40%\nCLASSIFICATION: High proliferative index\n\nInterpretation (Based on clinical criteria):\n- 0-5%: Low proliferative index\n- 6-20%: Intermediate proliferative index\n- >20%: High proliferative index', '2026-05-07 08:53:44'),
(49, 10, 'PT016', 'GIT', 'GIST KIT', 'Dot like peri-nuclear staining', 'CLINICAL ANALYSIS REPORT: GIST KIT (CD117)\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nKIT STAINING PATTERN: Dot like peri-nuclear staining\n\nClinical Interpretation: \nAtypical or focal expression pattern. Consider correlation with DOG1 and molecular testing for mutation analysis.', '2026-05-07 08:53:51'),
(50, 10, 'PT016', 'Soft Tissue', 'Ki-67', '10–29%', 'CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSELECTED RANGE: 10–29%\nWHO GRADE equivalent: Grade 2\n\nInterpretation: Moderate proliferation. Intermediate risk — consider adjuvant RT in high-risk cases.', '2026-05-07 08:53:59'),
(51, 10, 'PT016', 'Head', 'P16', 'Equivocal (50-70% staining)', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-07 08:54:10'),
(53, 10, 'PT016', 'Lungs', 'HER2', 'Equivocal (2  by gastric criteria)', 'CLINICAL ANALYSIS REPORT: LUNGS HER2\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSELECTION: Equivocal (2  by gastric criteria)\nINFERENCE: Equivocal\n\nInterpretation: Weak/moderate basolateral staining in ≥10% of cells.\nInterpretation: Equivocal — NGS or ISH recommended for confirmation.', '2026-05-07 08:54:24'),
(55, 10, 'PT016', 'GIT', 'Adenocarcinoma HER2 (Biopsy)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT BIOPSY HER2\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSTAINING INTENSITY (Biopsy): 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-08 02:46:29'),
(58, 10, 'PT016', 'GIT', 'Adenocarcinoma HER2 (Surgical)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT ADENOCARCINOMA HER2\n-------------------------------------------\nPatient Name: Madhu\nPatient ID: PT003\n\nSTAINING INTENSITY: 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-08 02:51:57'),
(59, 10, 'PT017', 'Breast', 'ER', 'Allred 5/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Mano\nPatient ID:      PT004\n\nSTAINING INTENSITY:   Moderate (2)\nPROPORTION SCORE:     11-35% (Score 3)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   5 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 5). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-08 08:57:04'),
(60, 10, 'PT017', 'Breast', 'ER H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-08 08:57:14'),
(61, 10, 'PT017', 'Breast', 'PR', 'Allred 5/8', 'CLINICAL ANALYSIS REPORT: BREAST PR (ALLRED)\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSTAINING INTENSITY: Moderate (2)\nPROPORTION SCORE: 11-35% (Score 3)\n\nTOTAL ALLRED SCORE: 5\nINFERENCE: Positive\n\nInterpretation: The sample shows significant PR positivity, indicating likely response to hormonal therapy.', '2026-05-08 08:57:35'),
(62, 10, 'PT017', 'Breast', 'PR H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST PR (H-SCORE)\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows PR reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-08 08:57:45'),
(63, 10, 'PT017', 'Breast', 'HER2', 'Score 3', 'CLINICAL ANALYSIS REPORT: BREAST HER2\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSTAINING INTENSITY: 3 \nPERCENTAGE OF TUMOR CELLS: ≤ 10%\n\nINFERENCE: Equivocal\n\nInterpretation: HER2 negative. No clinical indication for targeted therapy.', '2026-05-08 08:57:56'),
(64, 10, 'PT017', 'Breast', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-08 08:58:09'),
(65, 10, 'PT017', 'Thyroid', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT (THYROID)\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-08 08:58:29'),
(66, 10, 'PT017', 'GIT', 'Adenocarcinoma HER2 (Surgical)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT ADENOCARCINOMA HER2\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSTAINING INTENSITY: 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-08 08:58:40'),
(67, 10, 'PT017', 'GIT', 'Adenocarcinoma HER2 (Biopsy)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT BIOPSY HER2\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSTAINING INTENSITY (Biopsy): 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-08 08:58:53'),
(68, 10, 'PT017', 'GIT', 'NET Stomach Grading', '21-55%', 'CLINICAL ANALYSIS REPORT: STOMACH NET GRADING\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nKi-67 INDEX RANGE: 21-55%\nGRADE: Grade 3 (G3)\n\nInterpretation: Well-differentiated neuroendocrine tumor — Grade 3 (G3)', '2026-05-08 08:59:07'),
(72, 10, 'PT017', 'GIT', 'NET Grading', '>20%', 'CLINICAL ANALYSIS REPORT: GIT NET GRADING\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nKi-67 INDEX RANGE: >20%\nWHO GRADE: Grade 3\nCLASS: Well differentiated neuroendocrine tumour - Grade 3\n\nInterpretation: Grade 3 (G3) neuroendocrine carcinoma indicated by high Ki-67 index. Highly aggressive biology.', '2026-05-08 08:59:44'),
(73, 10, 'PT017', 'GIT', 'GIST Ki-67', '41-50%', 'CLINICAL ANALYSIS REPORT: GIST KI-67\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nKi-67 INDEX RANGE: 41-50%\nCLASSIFICATION: High proliferative index\n\nInterpretation (Based on clinical criteria):\n- 0-5%: Low proliferative index\n- 6-20%: Intermediate proliferative index\n- >20%: High proliferative index', '2026-05-08 08:59:57'),
(74, 10, 'PT017', 'GIT', 'GIST KIT', 'Membranous pattern', 'CLINICAL ANALYSIS REPORT: GIST KIT (CD117)\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nKIT STAINING PATTERN: Membranous pattern\n\nClinical Interpretation: \nAtypical or focal expression pattern. Consider correlation with DOG1 and molecular testing for mutation analysis.', '2026-05-08 09:00:02'),
(75, 10, 'PT017', 'Soft Tissue', 'Ki-67', '10–29%', 'CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSELECTED RANGE: 10–29%\nWHO GRADE equivalent: Grade 2\n\nInterpretation: Moderate proliferation. Intermediate risk — consider adjuvant RT in high-risk cases.', '2026-05-08 09:00:24'),
(76, 10, 'PT017', 'Head', 'P16', 'Equivocal (50-70% staining)', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-08 09:00:30'),
(77, 10, 'PT017', 'Head', 'HER2', '1  negative', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-08 09:00:40'),
(78, 10, 'PT017', 'Lungs', 'HER2', 'Equivocal (2  by gastric criteria)', 'CLINICAL ANALYSIS REPORT: LUNGS HER2\n-------------------------------------------\nPatient Name: Mano\nPatient ID: PT004\n\nSELECTION: Equivocal (2  by gastric criteria)\nINFERENCE: Equivocal\n\nInterpretation: Weak/moderate basolateral staining in ≥10% of cells.\nInterpretation: Equivocal — NGS or ISH recommended for confirmation.', '2026-05-08 09:00:51'),
(79, 10, 'PT018', 'Breast', 'ER', 'Allred 6/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    Manoj\nPatient ID:      PT005\n\nSTAINING INTENSITY:   Moderate (2)\nPROPORTION SCORE:     36-60% (Score 4)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   6 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 6). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-15 03:39:32'),
(81, 10, 'PT018', 'Breast', 'PR', 'Allred 5/8', 'CLINICAL ANALYSIS REPORT: BREAST PR (ALLRED)\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nSTAINING INTENSITY: Moderate (2)\nPROPORTION SCORE: 11-35% (Score 3)\n\nTOTAL ALLRED SCORE: 5\nINFERENCE: Positive\n\nInterpretation: The sample shows significant PR positivity, indicating likely response to hormonal therapy.', '2026-05-15 03:39:55'),
(82, 10, 'PT018', 'Breast', 'PR H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST PR (H-SCORE)\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows PR reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-15 03:40:05'),
(83, 10, 'PT018', 'Breast', 'HER2', 'Score 3', 'CLINICAL ANALYSIS REPORT: BREAST HER2\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nSTAINING INTENSITY: 3 \nPERCENTAGE OF TUMOR CELLS: ≤ 10%\n\nINFERENCE: Equivocal\n\nInterpretation: HER2 negative. No clinical indication for targeted therapy.', '2026-05-15 03:40:16'),
(84, 10, 'PT018', 'Breast', 'Ki-67', '16–20%', 'BREAST KI67 ANALYSIS REPORT\n-------------------------------------------\nRange: 16–20%\nInference: intermediate', '2026-05-15 03:40:27'),
(85, 10, 'PT018', 'Thyroid', 'Ki-67', '≥3% to <5%', 'KI67 ANALYSIS REPORT (THYROID)\nRange: ≥3% to <5%\nResult: Mild-moderate proliferation.\nDescription: Correlate with histomorphology (e.g., follicular variant PTC).', '2026-05-15 03:40:36'),
(86, 10, 'PT018', 'GIT', 'Adenocarcinoma HER2 (Surgical)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT ADENOCARCINOMA HER2\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nSTAINING INTENSITY: 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-15 03:40:46'),
(87, 10, 'PT018', 'GIT', 'Adenocarcinoma HER2 (Biopsy)', 'Score 2', 'CLINICAL ANALYSIS REPORT: GIT BIOPSY HER2\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nSTAINING INTENSITY (Biopsy): 2  — Weak/moderate complete membrane staining\nINFERENCE: Equivocal\n\nInterpretation: HER2 Equivocal (Score 2 ) — ISH (FISH/SISH) testing required for amplification status.', '2026-05-15 03:40:56'),
(88, 10, 'PT018', 'GIT', 'NET Stomach Grading', '21-55%', 'CLINICAL ANALYSIS REPORT: STOMACH NET GRADING\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nKi-67 INDEX RANGE: 21-55%\nGRADE: Grade 3 (G3)\n\nInterpretation: Well-differentiated neuroendocrine tumor — Grade 3 (G3)', '2026-05-15 03:41:08'),
(90, 10, 'PT018', 'GIT', 'GIST Ki-67', '41-50%', 'CLINICAL ANALYSIS REPORT: GIST KI-67\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nKi-67 INDEX RANGE: 41-50%\nCLASSIFICATION: High proliferative index\n\nInterpretation (Based on clinical criteria):\n- 0-5%: Low proliferative index\n- 6-20%: Intermediate proliferative index\n- >20%: High proliferative index', '2026-05-15 03:41:26'),
(91, 10, 'PT018', 'GIT', 'GIST KIT', 'Dot like peri-nuclear staining', 'CLINICAL ANALYSIS REPORT: GIST KIT (CD117)\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nKIT STAINING PATTERN: Dot like peri-nuclear staining\n\nClinical Interpretation: \nAtypical or focal expression pattern. Consider correlation with DOG1 and molecular testing for mutation analysis.', '2026-05-15 03:41:32'),
(92, 10, 'PT018', 'Soft Tissue', 'Ki-67', '10–29%', 'CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67\n-------------------------------------------\nPatient Name: Manoj\nPatient ID: PT005\n\nSELECTED RANGE: 10–29%\nWHO GRADE equivalent: Grade 2\n\nInterpretation: Moderate proliferation. Intermediate risk — consider adjuvant RT in high-risk cases.', '2026-05-15 03:41:41'),
(93, 10, 'PT018', 'Head', 'P16', 'Positive (nuclear', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-15 03:41:49'),
(94, 10, 'PT018', 'Head', 'HER2', '1  negative', 'CLINICAL ANALYSIS REPORT: HEAD', '2026-05-15 03:41:58'),
(96, 10, 'PT018', 'Breast', 'ER H-Score', 'H-Score: 8', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient ID: PT005\n\nSTAINING COMPONENTS:\n- Weak (1+): 6%\n- Moderate (2+): 1%\n- Strong (3+): 0%\n\nTOTAL H-SCORE: 8\nINFERENCE: Negative\n\nInterpretation: The sample is considered negative by H-score criteria.', '2026-05-25 05:23:18'),
(97, 10, 'PT020', 'Breast', 'ER', 'Allred 5/8', 'CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)\n====================================================\nPatient Name:    ravi\nPatient ID:      PT020\n\nSTAINING INTENSITY:   Moderate (2)\nPROPORTION SCORE:     11-35% (Score 3)\n─────────────────────────────────────────\nTOTAL ALLRED SCORE:   5 / 8\nRESULT:               Positive\n\nINTERPRETATION:\nER POSITIVE — The sample shows significant ER positivity (Allred 5). This indicates the tumor is likely hormone receptor-positive and may respond to hormonal therapies such as Tamoxifen or Aromatase Inhibitors.', '2026-05-28 05:22:59'),
(98, 10, 'PT020', 'Breast', 'ER H-Score', 'H-Score: 30', 'CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)\n-------------------------------------------\nPatient Name: ravi\nPatient ID: PT020\n\nSTAINING COMPONENTS:\n- Weak (1 ): 5%\n- Moderate (2 ): 5%\n- Strong (3 ): 5%\n\nTOTAL H-SCORE: 30\nINFERENCE: Weakly Positive\n\nInterpretation: The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.', '2026-05-28 05:23:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `disease`
--
ALTER TABLE `disease`
  ADD PRIMARY KEY (`disease_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `disease_ibfk_1` (`patient_id`,`doctor_id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`doctor_id`),
  ADD UNIQUE KEY `license_no` (`license_no`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`patient_id`,`doctor_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `patient_analysis_reports`
--
ALTER TABLE `patient_analysis_reports`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `disease`
--
ALTER TABLE `disease`
  MODIFY `disease_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `patient_analysis_reports`
--
ALTER TABLE `patient_analysis_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `disease`
--
ALTER TABLE `disease`
  ADD CONSTRAINT `disease_ibfk_1` FOREIGN KEY (`patient_id`,`doctor_id`) REFERENCES `patient` (`patient_id`, `doctor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `disease_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE CASCADE;

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
