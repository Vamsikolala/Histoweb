# HistoQuanta Vulnerability Testing (Burp Suite)

This document outlines 50 documented active scan targets and manual penetration testing paths designed to secure the HistoQuanta application.

## 1. SQL Injection (SQLi) - 15 Test Cases
These payloads target the `doctor_login.php` and `search_patient.php` endpoints.
1. `admin' --`
2. `admin' #`
3. `' OR 1=1--`
4. `' OR '1'='1`
5. `" OR "1"="1`
6. `admin' AND 1=0 UNION ALL SELECT NULL, NULL, NULL--`
7. `1; DROP TABLE users`
8. `1'; WAITFOR DELAY '0:0:5'--`
9. `admin') OR ('1'='1`
10. `admin" OR "1"="1`
11. `' OR TRUE--`
12. `1 UNION SELECT username, password FROM doctors--`
13. `1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--`
14. `1' AND EXTRACTVALUE(1, CONCAT(0x5c, (SELECT version())))--`
15. `1' AND updatexml(1,concat(0x0a,(select database())),1)--`

## 2. Cross-Site Scripting (XSS) - 15 Test Cases
These payloads target `add_patient.php` and `update_doctor_profile.php` inputs.
16. `<script>alert(1)</script>`
17. `"><script>alert(1)</script>`
18. `<img src=x onerror=alert(1)>`
19. `<svg/onload=alert(1)>`
20. `javascript:alert(1)`
21. `"><svg/onload=alert(1)>`
22. `'-alert(1)-'`
23. `\x3cscript\x3ealert(1)\x3c/script\x3e`
24. `<a href="javascript:alert(1)">Click</a>`
25. `<iframe src="javascript:alert(1)"></iframe>`
26. `<body onload=alert(1)>`
27. `<input autofocus onfocus=alert(1)>`
28. `<details open ontoggle=alert(1)>`
29. `<marquee onstart=alert(1)>`
30. `<video><source onerror=alert(1)></video>`

## 3. Insecure Direct Object Reference (IDOR) - 10 Test Cases
Targeting `patient_profile.php?patient_id=X` and `delete_report.php`.
31. Accessing `patient_id` belonging to another doctor.
32. Accessing `patient_id` sequentially (brute-forcing IDs 1-100).
33. Modifying `doctor_id` in GET requests.
34. Attempting to delete `report_id` not belonging to current user.
35. Attempting to view `report_id` sequentially.
36. Changing POST parameter `patient_id` during Add Disease.
37. Modifying `patient_id` in Update Patient endpoint.
38. Accessing `patient_profile.php` without authentication token.
39. Escalating privileges by sending `role=admin` in JSON payload.
40. Attempting to edit another doctor's profile via `update_doctor_profile.php`.

## 4. Session & Auth Exploits - 10 Test Cases
Targeting `doctor_login.php`, `verify_otp.php`.
41. Session Fixation (reusing a PHPSESSID across logins).
42. Missing HttpOnly and Secure flags on session cookies.
43. Bypassing OTP by sending `otp=000000` or empty strings.
44. OTP Brute-force (no rate-limiting on `verify_otp.php`).
45. Insecure Password Reset (predictable token).
46. Concurrent log-in sessions (allowing same user on multiple devices).
47. Session timeout verification (does it expire after 30 mins?).
48. Logout flaw (can the user press 'Back' after logging out?).
49. Lack of account lockout mechanism after 5 failed login attempts.
50. Capturing plain-text credentials over HTTP.
