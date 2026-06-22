import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 300, // 300 virtual users
  duration: '1m', // Running continuously for 1 minute
  thresholds: {
    // 95% of requests must complete below 500ms
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  // Target the URL from environment variable, falling back to local IPv6 address
  const targetUrl = __ENV.TARGET_URL || 'http://[::1]:3000';
  const res = http.get(targetUrl);
  
  // Verify that the server responds with a 200 OK status
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  // Wait a short time between requests to simulate real user behavior
  sleep(1);
}
