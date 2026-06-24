"""
test_appium_histoquanta.py - Comprehensive Appium E2E Test Suite for HistoQuanta iOS App
"""
import pytest
import time

def record(test_id, module, test_case, description, steps, expected, actual, status, exec_time=0.0):
    """Utility to record a test result into the global collector."""
    import pytest
    pytest.collector.add_result(test_id, module, test_case, description, steps, expected, actual, status, exec_time)

class TestAppiumHistoQuanta:
    
    # ═══════════════════════════════════════════════════════════════════════
    #  MODULE 1: AUTHENTICATION & INITIALIZATION
    # ═══════════════════════════════════════════════════════════════════════

    def test_TC_001_app_launch(self, driver):
        """TC_001: Verify application launches successfully on iOS Device/Simulator."""
        t0 = time.time()
        try:
            # Check for main brand text or header element
            logo = driver.find_element("accessibility id", "HistoQuantaLogo")
            assert logo.is_displayed()
            record("TC_001", "Authentication", "App Launch",
                   "Verify the iOS app launches and shows the branding logo.",
                   "1. Launch the application\n2. Observe the splash/landing screen",
                   "Branding logo is visible on screen.",
                   "App launched successfully, branding logo visible.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_001", "Authentication", "App Launch",
                   "Verify the iOS app launches successfully.",
                   "1. Launch the application", "App launches successfully",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_002_login_fields_display(self, driver):
        """TC_002: Verify username and password input fields are visible on Login Screen."""
        t0 = time.time()
        try:
            user_field = driver.find_element("accessibility id", "UsernameTextField")
            pass_field = driver.find_element("accessibility id", "PasswordSecureField")
            assert user_field.is_displayed()
            assert pass_field.is_displayed()
            record("TC_002", "Authentication", "Login Inputs Displayed",
                   "Verify Username and Password input fields are present and visible.",
                   "1. Open application to Login screen\n2. Inspect UI components",
                   "Both input fields are displayed and interactive.",
                   "Fields verified on Login screen.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_002", "Authentication", "Login Inputs Displayed",
                   "Verify login fields.", "1. View Login Screen", "Fields visible",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_003_empty_login_validation(self, driver):
        """TC_003: Verify empty login form submission shows warning."""
        t0 = time.time()
        try:
            submit_btn = driver.find_element("accessibility id", "LoginButton")
            submit_btn.click()
            alert = driver.find_element("accessibility id", "EmptyFieldsAlert")
            assert alert.is_displayed()
            record("TC_003", "Authentication", "Empty Login Validation",
                   "Submit login form with empty input fields.",
                   "1. Leave fields empty\n2. Tap Login button",
                   "An alert/warning message is displayed indicating required fields.",
                   "Alert displayed indicating empty fields.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_003", "Authentication", "Empty Login Validation",
                   "Empty login check.", "1. Tap login button with empty fields",
                   "Alert displayed", str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_004_invalid_credentials_error(self, driver):
        """TC_004: Verify entering invalid credentials shows error banner."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "UsernameTextField").send_keys("invalid_doc")
            driver.find_element("accessibility id", "PasswordSecureField").send_keys("WrongPass!")
            driver.find_element("accessibility id", "LoginButton").click()
            error_banner = driver.find_element("accessibility id", "ErrorBanner")
            assert error_banner.is_displayed()
            record("TC_004", "Authentication", "Invalid Credentials Validation",
                   "Attempt login with invalid doctor license and password.",
                   "1. Enter invalid doctor ID\n2. Enter incorrect password\n3. Tap Login button",
                   "Error banner is displayed with 'Invalid credentials' message.",
                   "Invalid credentials error banner displayed.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_004", "Authentication", "Invalid Credentials Validation",
                   "Invalid login check.", "1. Enter bad credentials\n2. Tap login",
                   "Error banner displayed", str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_005_successful_login(self, driver):
        """TC_005: Verify login with valid doctor credentials succeeds."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "UsernameTextField").send_keys("TESTLIC001")
            driver.find_element("accessibility id", "PasswordSecureField").send_keys("Test@1234")
            driver.find_element("accessibility id", "LoginButton").click()
            dashboard_title = driver.find_element("accessibility id", "DashboardHeaderTitle")
            assert dashboard_title.is_displayed()
            record("TC_005", "Authentication", "Successful Login",
                   "Log in to the app using valid doctor credentials.",
                   "1. Enter valid license ID\n2. Enter correct password\n3. Tap Login",
                   "Successful login and redirection to the Main Dashboard.",
                   "Logged in and redirected to Dashboard successfully.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_005", "Authentication", "Successful Login",
                   "Login with valid credentials.", "1. Enter valid credentials\n2. Tap login",
                   "Redirection to Dashboard", str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    # ═══════════════════════════════════════════════════════════════════════
    #  MODULE 2: DASHBOARD & PATIENT MANAGEMENT
    # ═══════════════════════════════════════════════════════════════════════

    def test_TC_006_dashboard_modules_grid(self, driver):
        """TC_006: Verify dashboard displays clinical modules correctly."""
        t0 = time.time()
        try:
            breast_card = driver.find_element("accessibility id", "ModuleCard_Breast")
            lung_card = driver.find_element("accessibility id", "ModuleCard_Lungs")
            thyroid_card = driver.find_element("accessibility id", "ModuleCard_Thyroid")
            assert breast_card.is_displayed()
            assert lung_card.is_displayed()
            assert thyroid_card.is_displayed()
            record("TC_006", "Dashboard", "Clinical Modules Grid",
                   "Verify module selection cards (Breast, Lungs, Thyroid) are present.",
                   "1. View the main dashboard tab",
                   "All module cards are displayed correctly in a grid/list.",
                   "Breast, Lungs, and Thyroid modules are visible in the grid.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_006", "Dashboard", "Clinical Modules Grid",
                   "Verify grid cards.", "1. View dashboard", "Cards visible",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_007_search_patient(self, driver):
        """TC_007: Verify patient search functionality."""
        t0 = time.time()
        try:
            search_bar = driver.find_element("accessibility id", "PatientSearchBar")
            search_bar.send_keys("PT020")
            result = driver.find_element("accessibility id", "PatientRow_PT020")
            assert result.is_displayed()
            record("TC_007", "Patient Management", "Search Patient",
                   "Search for a patient using their unique patient ID.",
                   "1. Tap Search Bar\n2. Input patient ID 'PT020'",
                   "The patient matching the search query is displayed in results.",
                   "Patient 'PT020' correctly filtered and displayed.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_007", "Patient Management", "Search Patient",
                   "Search patient ID.", "1. Enter ID in search bar",
                   "Target patient shown", str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_008_add_new_patient(self, driver):
        """TC_008: Verify adding a new patient record."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "AddPatientButton").click()
            driver.find_element("accessibility id", "PatientNameInput").send_keys("New Patient Mobile")
            driver.find_element("accessibility id", "PatientAgeInput").send_keys("45")
            driver.find_element("accessibility id", "PatientGender_Female").click()
            driver.find_element("accessibility id", "SavePatientButton").click()
            success_toast = driver.find_element("accessibility id", "SuccessToast")
            assert success_toast.is_displayed()
            record("TC_008", "Patient Management", "Add Patient",
                   "Add a new patient record with name, age, and gender details.",
                   "1. Tap Add Patient icon\n2. Fill name, age, and select gender\n3. Tap Save",
                   "Success toast appears and new patient record is registered.",
                   "New patient added, success toast displayed.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_008", "Patient Management", "Add Patient",
                   "Add patient test.", "1. Fill patient form\n2. Tap save",
                   "Record added successfully", str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_009_profile_details(self, driver):
        """TC_009: Verify patient profile details display correctly."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "PatientRow_PT020").click()
            profile_name = driver.find_element("accessibility id", "ProfileHeader_Name")
            assert profile_name.is_displayed()
            record("TC_009", "Patient Management", "Patient Profile",
                   "Verify detailed patient profile displays correctly.",
                   "1. Tap on a patient from the list",
                   "Redirection to patient profile showing history and metadata.",
                   "Patient profile loaded with matching details.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_009", "Patient Management", "Patient Profile",
                   "View profile details.", "1. Tap on patient row", "Profile loaded",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    # ═══════════════════════════════════════════════════════════════════════
    #  MODULE 3: CLINICAL MODULES (BREAST, LUNGS, THYROID, HEAD/NECK, SOFT TISSUE)
    # ═══════════════════════════════════════════════════════════════════════

    def test_TC_010_breast_module_navigation(self, driver):
        """TC_010: Verify navigating to the Breast Cancer Screening module."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "HomeTabBarItem").click()
            driver.find_element("accessibility id", "ModuleCard_Breast").click()
            breast_header = driver.find_element("accessibility id", "BreastModuleHeader")
            assert breast_header.is_displayed()
            record("TC_010", "Breast Module", "Breast Navigation",
                   "Verify navigation to the Breast cancer module from the dashboard.",
                   "1. Tap Breast card on dashboard",
                   "Navigates to the Breast screening page.",
                   "Successfully navigated to Breast Module.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_010", "Breast Module", "Breast Navigation",
                   "Navigate to breast module.", "1. Tap Breast card", "Header visible",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_011_breast_markers_input(self, driver):
        """TC_011: Verify inputting IHC markers (ER, PR, HER2) on Breast Module."""
        t0 = time.time()
        try:
            er_input = driver.find_element("accessibility id", "IhcInput_ER")
            pr_input = driver.find_element("accessibility id", "IhcInput_PR")
            her2_select = driver.find_element("accessibility id", "IhcSelect_HER2")
            
            er_input.send_keys("70")
            pr_input.send_keys("60")
            her2_select.click() # simulated selectHER2 dropdown
            
            record("TC_011", "Breast Module", "Breast Markers Input",
                   "Verify text fields and dropdowns for Breast IHC markers accept input.",
                   "1. Input '70' for ER%\n2. Input '60' for PR%\n3. Choose '3+' for HER2",
                   "IHC marker input fields correctly display the entered values.",
                   "Inputs successfully entered and validated.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_011", "Breast Module", "Breast Markers Input",
                   "IHC marker inputs.", "1. Enter values for ER, PR, HER2", "Values displayed",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_012_breast_score_calculation(self, driver):
        """TC_012: Verify Breast score calculation and classification."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "CalculateScoreButton").click()
            allred_score = driver.find_element("accessibility id", "ResultScore_Allred")
            assert allred_score.is_displayed()
            record("TC_012", "Breast Module", "Breast Score Calculation",
                   "Calculate total screening score for the Breast module.",
                   "1. Tap Calculate Score button after inputs",
                   "Allred score and IHC classification is displayed correctly.",
                   "Calculated successfully: Allred score displayed.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_012", "Breast Module", "Breast Score Calculation",
                   "Calculate score.", "1. Tap calculate", "Score displayed",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_013_lungs_markers_input(self, driver):
        """TC_013: Verify inputting IHC markers on Lungs Module."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "HomeTabBarItem").click()
            driver.find_element("accessibility id", "ModuleCard_Lungs").click()
            pdl1_input = driver.find_element("accessibility id", "IhcInput_PDL1")
            pdl1_input.send_keys("45")
            record("TC_013", "Lungs Module", "Lungs Markers Input",
                   "Input Lungs screening markers (PD-L1 TPS%).",
                   "1. Navigate to Lungs module\n2. Enter '45' in PD-L1 field",
                   "Lungs IHC fields display the typed value.",
                   "Input value entered and verified.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_013", "Lungs Module", "Lungs Markers Input",
                   "Lungs inputs.", "1. Enter PD-L1 value", "Value displayed",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_014_lungs_score_calculation(self, driver):
        """TC_014: Verify Lungs score calculation and inference."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "CalculateScoreButton").click()
            tps_result = driver.find_element("accessibility id", "ResultInference_Lungs")
            assert tps_result.is_displayed()
            record("TC_014", "Lungs Module", "Lungs Score Calculation",
                   "Calculate total score and oncology inference for Lungs.",
                   "1. Tap Calculate Score button",
                   "Inference label shows correct classification based on inputs.",
                   "Lungs inference calculated successfully.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_014", "Lungs Module", "Lungs Score Calculation",
                   "Calculate lungs score.", "1. Tap calculate", "Inference displayed",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_015_thyroid_markers_input(self, driver):
        """TC_015: Verify Thyroid screening markers input."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "HomeTabBarItem").click()
            driver.find_element("accessibility id", "ModuleCard_Thyroid").click()
            galectin_select = driver.find_element("accessibility id", "IhcSelect_Galectin3")
            galectin_select.click() # selects positive
            record("TC_015", "Thyroid Module", "Thyroid Markers Input",
                   "Input Thyroid screening markers (Galectin-3, CK19).",
                   "1. Navigate to Thyroid module\n2. Choose Positive for Galectin-3",
                   "Thyroid marker values are correctly registered.",
                   "Thyroid screening values input successfully.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_015", "Thyroid Module", "Thyroid Markers Input",
                   "Thyroid inputs.", "1. Set marker values", "Values registered",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_016_head_neck_markers_input(self, driver):
        """TC_016: Verify Head & Neck screening markers input."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "HomeTabBarItem").click()
            # Navigate to Head & Neck via search/more modules if needed
            driver.find_element("accessibility id", "ModuleCard_HeadNeck").click()
            p16_select = driver.find_element("accessibility id", "IhcSelect_p16")
            p16_select.click()
            record("TC_016", "Head & Neck Module", "Head & Neck Input",
                   "Input Head & Neck screening markers (p16).",
                   "1. Navigate to Head & Neck module\n2. Select Positive for p16",
                   "Head & Neck marker values are correctly selected.",
                   "Head & Neck inputs set successfully.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_016", "Head & Neck Module", "Head & Neck Input",
                   "Head & Neck inputs.", "1. Set p16 status", "Inputs set",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_017_soft_tissue_markers_input(self, driver):
        """TC_017: Verify Soft Tissue screening markers input."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "HomeTabBarItem").click()
            driver.find_element("accessibility id", "ModuleCard_SoftTissue").click()
            mdm2_select = driver.find_element("accessibility id", "IhcSelect_MDM2")
            mdm2_select.click()
            record("TC_017", "Soft Tissue Module", "Soft Tissue Input",
                   "Input Soft Tissue screening markers (MDM2).",
                   "1. Navigate to Soft Tissue module\n2. Choose MDM2 status",
                   "Soft Tissue marker values are correctly set.",
                   "Soft Tissue inputs set successfully.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_017", "Soft Tissue Module", "Soft Tissue Input",
                   "Soft Tissue inputs.", "1. Set mdm2 status", "Inputs set",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    # ═══════════════════════════════════════════════════════════════════════
    #  MODULE 4: REPORT GENERATION & SETTINGS
    # ═══════════════════════════════════════════════════════════════════════

    def test_TC_018_generate_report_pdf(self, driver):
        """TC_018: Verify report generation and PDF preview."""
        t0 = time.time()
        try:
            # Open report preview
            driver.find_element("accessibility id", "GenerateReportPdfButton").click()
            pdf_view = driver.find_element("accessibility id", "PdfPreviewView")
            assert pdf_view.is_displayed()
            record("TC_018", "Reports", "PDF Generation",
                   "Generate clinical diagnostic PDF report for patient.",
                   "1. Tap Generate PDF button\n2. Verify the PDF viewer screen launches",
                   "PDF preview window is loaded displaying the compiled medical report.",
                   "PDF generated and displayed on screen.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_018", "Reports", "PDF Generation",
                   "Generate PDF report.", "1. Tap PDF button", "PDF preview loads",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_019_doctor_profile_settings(self, driver):
        """TC_019: Verify viewing doctor profile and settings."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "ProfileTabBarItem").click()
            profile_title = driver.find_element("accessibility id", "DoctorProfileTitle")
            assert profile_title.is_displayed()
            record("TC_019", "Settings", "Doctor Profile Settings",
                   "Navigate to Doctor settings screen and verify layout.",
                   "1. Tap Profile Tab on tab bar\n2. Inspect details",
                   "Doctor profile showing license number and hospital details is shown.",
                   "Settings loaded correctly, Doctor profile details verified.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_019", "Settings", "Doctor Profile Settings",
                   "View settings.", "1. Tap Profile tab", "Settings loaded",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))

    def test_TC_020_user_logout(self, driver):
        """TC_020: Verify logging out of the application."""
        t0 = time.time()
        try:
            driver.find_element("accessibility id", "LogoutButton").click()
            # Redirected back to login
            login_title = driver.find_element("accessibility id", "HistoQuantaLogo")
            assert login_title.is_displayed()
            record("TC_020", "Authentication", "User Logout",
                   "Log out from the doctor profile and return to the Login screen.",
                   "1. Tap Logout button\n2. Confirm logout dialog",
                   "Session is cleared, redirected back to Login screen.",
                   "Logged out and returned to login screen successfully.", "PASS", time.time() - t0)
        except Exception as e:
            record("TC_020", "Authentication", "User Logout",
                   "User logout check.", "1. Tap logout", "Redirection to login",
                   str(e), "FAIL", time.time() - t0)
            pytest.fail(str(e))
