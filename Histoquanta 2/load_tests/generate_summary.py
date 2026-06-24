import json
import os
import sys

def main():
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_file:
        print("GITHUB_STEP_SUMMARY environment variable not set. Exiting.")
        return

    json_path = "summary.json"
    if not os.path.exists(json_path):
        # Check parent folder just in case
        json_path = os.path.join("Histoquanta 2", "summary.json")
        if not os.path.exists(json_path):
            print("summary.json not found in current folder or Histoquanta 2/.")
            return

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading summary.json: {e}")
        return

    metrics = data.get("metrics", {})

    # 1. Total Requests
    total_reqs = metrics.get("http_reqs", {}).get("values", {}).get("count", 0)

    # 2. Response Time Metrics
    duration_vals = metrics.get("http_req_duration", {}).get("values", {})
    avg_dur = duration_vals.get("avg", 0.0)
    min_dur = duration_vals.get("min", 0.0)
    med_dur = duration_vals.get("med", 0.0)
    max_dur = duration_vals.get("max", 0.0)
    p90_dur = duration_vals.get("p(90)", 0.0)
    p95_dur = duration_vals.get("p(95)", 0.0)

    # 3. Request Rate
    req_rate = metrics.get("http_reqs", {}).get("values", {}).get("rate", 0.0)

    # 4. Error Rate
    fail_vals = metrics.get("http_req_failed", {}).get("values", {})
    error_rate_pct = fail_vals.get("rate", 0.0) * 100.0

    # 5. Throughput (Data sent/received)
    sent_rate = metrics.get("data_sent", {}).get("values", {}).get("rate", 0.0)
    recv_rate = metrics.get("data_received", {}).get("values", {}).get("rate", 0.0)
    throughput_kb = (sent_rate + recv_rate) / 1024.0

    # 6. Virtual Users (VUs)
    vus_max = metrics.get("vus", {}).get("values", {}).get("max", 0)

    # Interpretations
    perf_status = "Good performance" if avg_dur < 200 else "Acceptable performance" if avg_dur < 500 else "Degraded performance"
    sla_status = "95% of requests completed quickly" if p95_dur < 500 else "95% SLA exceeded"
    error_status = "Very few errors" if error_rate_pct <= 1.0 else "High error rate detected"

    markdown = f"""### HistoQuanta Load Test Run Report 🚀

#### 📊 Performance Summary
| Metric | Value | Reference / Target |
|---|---|---|
| **Virtual Users (VUs)** | {vus_max} | 300 VUs |
| **Total Requests** | {total_reqs} | Total requests processed |
| **Request Rate (RPS)** | {req_rate:.2f} req/s | Processing rate |
| **Error Rate** | {error_rate_pct:.2f}% | Ideally < 1.0% |
| **Throughput** | {throughput_kb:.2f} KB/s | Data transfer rate |

#### ⏱️ Response Times
| Percentile | Time (ms) |
|---|---|
| **Minimum** | {min_dur:.2f} ms |
| **Average (avg)** | {avg_dur:.2f} ms |
| **Median (med)** | {med_dur:.2f} ms |
| **90% percentile (p90)** | {p90_dur:.2f} ms |
| **95% percentile (p95)** | {p95_dur:.2f} ms |
| **Maximum** | {max_dur:.2f} ms |

#### 💡 Interpretation
* **Average Response Time**: {avg_dur:.2f} ms → **{perf_status}**
* **95% SLA**: 95% of requests completed within {p95_dur:.2f} ms → **{sla_status}**
* **Failure Rate**: {error_rate_pct:.2f}% failures → **{error_status}**
* **Concurrent Users**: Test simulated {vus_max} concurrent users.
* **Processed Volume**: System successfully handled {total_reqs} requests.

#### 📝 Conclusion
The load test verifies the backend and frontend response time, system throughput (RPS), error rates, concurrent user limits, and overall server stability under expected load.
"""

    try:
        with open(summary_file, "a", encoding="utf-8") as sf:
            sf.write(markdown)
        print("GitHub Actions step summary generated successfully!")
    except Exception as e:
        print(f"Error writing to GITHUB_STEP_SUMMARY: {e}")

if __name__ == "__main__":
    main()
