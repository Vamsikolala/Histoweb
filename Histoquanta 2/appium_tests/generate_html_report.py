import os
from datetime import datetime

def generate_html_report(results, output_dir=None):
    """Generate a premium interactive HTML report of the Appium test results."""
    if output_dir is None:
        output_dir = os.path.dirname(os.path.abspath(__file__))

    timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    filename = f"Appium_Test_Report_HistoQuanta_{timestamp}.html"
    filepath = os.path.join(output_dir, filename)

    total = len(results)
    passed = sum(1 for r in results if r["status"] == "PASS")
    failed = sum(1 for r in results if r["status"] == "FAIL")
    pass_rate = round((passed / total * 100), 1) if total > 0 else 0
    total_exec_time = sum(r.get("execution_time", 0) for r in results)

    # Compile modules stats
    modules = {}
    for r in results:
        mod = r.get("module", "Unknown")
        if mod not in modules:
            modules[mod] = {"total": 0, "passed": 0, "failed": 0}
        modules[mod]["total"] += 1
        if r["status"] == "PASS":
            modules[mod]["passed"] += 1
        else:
            modules[mod]["failed"] += 1

    # HTML Template (Premium Purple Mobile Theme)
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HistoQuanta Mobile - Appium Test Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg-page: #fdf8ff;
            --bg-card: #ffffff;
            --primary: #8f3e97;
            --primary-light: #fbeeff;
            --text-main: #1f0f24;
            --text-muted: #78647c;
            --success: #16a34a;
            --success-light: #f0fdf4;
            --error: #dc2626;
            --error-light: #fef2f2;
            --border: #ebdbea;
            --radius: 16px;
            --shadow: 0 4px 6px -1px rgb(120 40 120 / 0.05), 0 2px 4px -2px rgb(120 40 120 / 0.05);
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Outfit', sans-serif;
        }}

        body {{
            background: var(--bg-page);
            color: var(--text-main);
            padding: 2.5rem 1.5rem;
            min-height: 100vh;
        }}

        .container {{
            max-width: 1280px;
            margin: 0 auto;
        }}

        header {{
            margin-bottom: 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .title-area h1 {{
            font-size: 2.25rem;
            font-weight: 800;
            color: var(--primary);
            letter-spacing: -0.5px;
        }}

        .title-area p {{
            color: var(--text-muted);
            margin-top: 0.25rem;
            font-size: 0.95rem;
        }}

        .timestamp {{
            background: var(--primary-light);
            color: var(--primary);
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.875rem;
        }}

        /* Dashboard grid */
        .dashboard-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }}

        .stat-card {{
            background: var(--bg-card);
            border-radius: var(--radius);
            padding: 1.5rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }}

        .stat-card .label {{
            font-size: 0.875rem;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .stat-card .value {{
            font-size: 2rem;
            font-weight: 800;
        }}

        .stat-card.pass {{ border-left: 5px solid var(--success); }}
        .stat-card.pass .value {{ color: var(--success); }}
        .stat-card.fail {{ border-left: 5px solid var(--error); }}
        .stat-card.fail .value {{ color: var(--error); }}
        .stat-card.rate {{ border-left: 5px solid var(--primary); }}
        .stat-card.rate .value {{ color: var(--primary); }}

        /* Filters and Tabs */
        .controls-area {{
            background: var(--bg-card);
            border-radius: var(--radius);
            padding: 1.25rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }}

        .search-box {{
            flex: 1;
            min-width: 280px;
            position: relative;
        }}

        .search-box input {{
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 10px;
            border: 1px solid var(--border);
            font-size: 0.95rem;
            outline: none;
            transition: 0.2s;
        }}

        .search-box input:focus {{
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(143, 62, 151, 0.1);
        }}

        .filter-buttons {{
            display: flex;
            gap: 0.5rem;
        }}

        .btn-filter {{
            background: var(--bg-page);
            border: 1px solid var(--border);
            padding: 0.5rem 1.25rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: 0.2s;
        }}

        .btn-filter:hover {{
            background: var(--primary-light);
            color: var(--primary);
        }}

        .btn-filter.active {{
            background: var(--primary);
            color: #fff;
            border-color: var(--primary);
        }}

        /* Table container */
        .table-container {{
            background: var(--bg-card);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            overflow: hidden;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }}

        th {{
            background: #faf7fc;
            padding: 1rem 1.5rem;
            font-weight: 600;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        td {{
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--border);
            font-size: 0.95rem;
            vertical-align: middle;
        }}

        tr:last-child td {{
            border-bottom: none;
        }}

        tr:hover {{
            background: #fbf8fc;
        }}

        .badge {{
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            display: inline-block;
        }}

        .badge.pass {{
            background: var(--success-light);
            color: var(--success);
        }}

        .badge.fail {{
            background: var(--error-light);
            color: var(--error);
        }}

        .tc-steps {{
            white-space: pre-line;
            color: var(--text-muted);
            font-size: 0.875rem;
            line-height: 1.5;
        }}

        .text-bold {{
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-area">
                <h1>HistoQuanta Mobile Appium Test Report</h1>
                <p>iOS Application Automated Testing Dashboard</p>
            </div>
            <div class="timestamp">
                Generated: {datetime.now().strftime('%b %d, %Y at %I:%M %p')}
            </div>
        </header>

        <div class="dashboard-grid">
            <div class="stat-card rate">
                <span class="label">Pass Rate</span>
                <span class="value">{pass_rate}%</span>
            </div>
            <div class="stat-card">
                <span class="label">Total Cases</span>
                <span class="value">{total}</span>
            </div>
            <div class="stat-card pass">
                <span class="label">Passed</span>
                <span class="value">{passed}</span>
            </div>
            <div class="stat-card fail">
                <span class="label">Failed</span>
                <span class="value">{failed}</span>
            </div>
            <div class="stat-card">
                <span class="label">Execution Time</span>
                <span class="value">{round(total_exec_time, 1)}s</span>
            </div>
        </div>

        <div class="controls-area">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search by Test Case name, ID or Module...">
            </div>
            <div class="filter-buttons">
                <button class="btn-filter active" onclick="filterResults('all')">All</button>
                <button class="btn-filter" onclick="filterResults('PASS')">Passed ({passed})</button>
                <button class="btn-filter" onclick="filterResults('FAIL')">Failed ({failed})</button>
            </div>
        </div>

        <div class="table-container">
            <table id="resultsTable">
                <thead>
                    <tr>
                        <th style="width: 8%">Test ID</th>
                        <th style="width: 15%">Module</th>
                        <th style="width: 25%">Test Case</th>
                        <th style="width: 32%">Steps & Expected Result</th>
                        <th style="width: 10%">Status</th>
                        <th style="width: 10%">Time</th>
                    </tr>
                </thead>
                <tbody>
        """

    for tc in sorted(results, key=lambda x: int(x["test_id"].split("_")[1]) if "_" in x.get("test_id", "") else 999):
        status_class = "pass" if tc.get("status") == "PASS" else "fail"
        html_content += f"""
                    <tr class="result-row" data-status="{tc.get('status')}">
                        <td class="text-bold">{tc.get('test_id', '')}</td>
                        <td><span style="font-weight:600; color: #6b21a8;">{tc.get('module', '')}</span></td>
                        <td>
                            <div class="text-bold">{tc.get('test_case', '')}</div>
                            <div style="font-size:0.85rem; color: var(--text-muted); margin-top: 4px;">{tc.get('description', '')}</div>
                        </td>
                        <td>
                            <div class="tc-steps"><span style="font-weight:600;color:#581c87;">Steps:</span>\n{tc.get('steps', '')}</div>
                            <div style="margin-top:6px; font-size:0.875rem;"><span style="font-weight:600;color:#581c87;">Expected:</span> {tc.get('expected_result', '')}</div>
                        </td>
                        <td><span class="badge {status_class}">{tc.get('status')}</span></td>
                        <td style="color: var(--text-muted); font-size: 0.9rem;">{tc.get('execution_time', 0.0)}s</td>
                    </tr>
        """

    html_content += """
                </tbody>
            </table>
        </div>
    </div>

    <script>
        function filterResults(status) {
            const buttons = document.querySelectorAll('.btn-filter');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            const rows = document.querySelectorAll('.result-row');
            rows.forEach(row => {
                const rowStatus = row.getAttribute('data-status');
                if (status === 'all' || rowStatus === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        document.getElementById('searchInput').addEventListener('keyup', function() {
            const query = this.value.toLowerCase();
            const rows = document.querySelectorAll('.result-row');
            
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>
"""

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"\n============================================================")
    print(f"  APPIUM HTML TEST REPORT GENERATED SUCCESSFULLY!")
    print(f"============================================================")
    print(f"  File: {filepath}")
    print(f"============================================================\n")

    return filepath
