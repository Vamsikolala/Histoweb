import urllib.request, json, gzip, io
try:
    jobs = json.loads(urllib.request.urlopen('https://api.github.com/repos/Vamsikolala/Histoweb/actions/runs/27940882759/jobs').read())
    job = jobs['jobs'][0]
    log_url = f"https://api.github.com/repos/Vamsikolala/Histoweb/actions/jobs/{job['id']}/logs"
    req = urllib.request.Request(log_url)
    # GitHub requires authorization for logs if private, but if public it works.
    # Actually, we don't have the token. So if it's public we can get it.
    res = urllib.request.urlopen(req)
    # The response is plain text logs
    logs = res.read().decode('utf-8')
    lines = logs.splitlines()
    print("\n".join(lines[-50:]))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.reason)
except Exception as e:
    print("Error:", e)
