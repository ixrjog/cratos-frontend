## 1. Overview

This document provides a standardized procedure for diagnosing and resolving channel network failures, ensuring consistent and efficient incident response with minimal business disruption.

## 2. Severity Classification

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| `P0` | Channel completely down, all transactions failing | < 5 min | Link down, DNS failure |
| `P1` | Partial failure, error rate >10% | < 15 min | Timeout spikes, packet loss |
| `P2` | Degraded performance, increased latency | < 30 min | Slow response, intermittent errors |
| `P3` | Minor issue, no business impact | < 2 hours | Certificate expiring soon, monitoring alert |

## 3. Initial Triage (First 5 Minutes)

### 3.1 Confirm the Issue

```
□ Check monitoring dashboard for alerts
□ Verify from multiple sources (rule out single probe false alarm)
□ Confirm business impact: transaction success rate, error codes
□ Identify affected channel(s) and scope (all traffic vs partial)
```

### 3.2 Quick Health Check

```bash
# DNS resolution
dig <channel-domain>
nslookup <channel-domain>

# Connectivity
ping <channel-ip>
telnet <channel-ip> <port>
curl -v https://<channel-endpoint>/health

# SSL/TLS check
openssl s_client -connect <channel-ip>:443 -servername <channel-domain>

# Traceroute
traceroute <channel-ip>
mtr <channel-ip>
```

### 3.3 Determine Failure Type

| Symptom | Likely Cause | Next Step |
|---------|-------------|-----------|
| DNS resolution fails | DNS misconfiguration / provider issue | → Section 4.1 |
| Connection refused | Service down / firewall block | → Section 4.2 |
| Connection timeout | Network path issue / routing | → Section 4.3 |
| SSL handshake failure | Certificate issue | → Section 4.4 |
| HTTP 5xx errors | Upstream service failure | → Section 4.5 |
| High latency / packet loss | Network congestion / link degradation | → Section 4.6 |

## 4. Diagnosis & Resolution

### 4.1 DNS Failure

**Symptoms:** NXDOMAIN, SERVFAIL, resolution returns wrong IP

**Steps:**
1. Verify DNS records: `dig <domain> @8.8.8.8`
2. Check DNS propagation: `dig <domain> @<authoritative-ns>`
3. Compare with expected IP/CNAME
4. If incorrect: check DNS provider console for recent changes
5. If provider outage: switch to backup DNS or update local hosts temporarily

### 4.2 Connection Refused

**Symptoms:** Connection refused, port not open

**Steps:**
1. Verify target port is correct
2. Test from different source IPs (rule out IP whitelist issue)
3. Contact channel partner to confirm service status
4. Check if our source IP changed (NAT gateway, EIP)
5. Verify security group / firewall rules

### 4.3 Connection Timeout

**Symptoms:** Connection timed out, no response

**Steps:**
1. Traceroute to identify where packets are dropped
2. Determine if issue is on our side (outbound) or channel side (inbound)
3. Check routing tables and NAT gateway status
4. Check ISP / cloud provider network status page
5. Test from alternative network path if available

### 4.4 SSL/TLS Failure

**Symptoms:** SSL handshake failure, certificate expired, certificate mismatch

**Steps:**
1. Check certificate expiry: `openssl s_client -connect <host>:443 | openssl x509 -noout -dates`
2. Verify certificate chain: `openssl s_client -connect <host>:443 -showcerts`
3. Check SNI is correct
4. Verify TLS version compatibility
5. Check if certificate was recently renewed/changed

### 4.5 HTTP Errors (5xx)

**Symptoms:** 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout

**Steps:**
1. Determine if error is from CDN/proxy or origin
2. Check response headers for error source (X-Cache, Via, Server)
3. Check channel partner status page
4. If possible, bypass CDN and test direct to origin
5. Check request payload for issues (size, format, encoding)

### 4.6 High Latency / Packet Loss

**Symptoms:** Slow response, intermittent failures, jitter

**Steps:**
1. MTR to identify packet loss hop: `mtr -r -c 100 <channel-ip>`
2. Determine if issue is persistent or intermittent
3. Compare with baseline latency
4. Check bandwidth utilization on our side
5. Check for network congestion at specific hops

## 5. Escalation Matrix

| Time Elapsed | Action |
|-------------|--------|
| 0-5 min | On-call engineer begins triage |
| 5-15 min | If P0: notify team lead, begin mitigation |
| 15-30 min | If unresolved: escalate to network team / cloud provider |
| 30-60 min | If P0 unresolved: escalate to management, activate DR plan |
| 1 hour+ | Send incident communication to stakeholders |

## 6. Mitigation Actions

| Action | When to Use |
|--------|-------------|
| Failover to backup channel | Primary channel completely down |
| Switch to backup link/ISP | Network path failure |
| Bypass CDN (direct to origin) | CDN layer issue |
| Enable circuit breaker | Prevent cascade failures |
| Rate limiting | Partial degradation, protect remaining capacity |
| DNS failover | DNS provider issue |

## 7. Communication Templates

### Internal Notification
```
[P0/P1] Channel Network Issue - <Channel Name>
Time: <timestamp>
Impact: <description of business impact>
Status: Investigating / Mitigating / Resolved
Action: <current action being taken>
ETA: <estimated resolution time>
```

### Evidence Requirements
> Screenshots and evidence must be collected during troubleshooting for post-incident review and external communication:

| Type | Content | Description |
|------|---------|-------------|
| Monitoring | Dashboard key metrics | Success rate, error rate, latency curves during anomaly |
| Reachability | ping / traceroute / mtr results | Screenshot or text, annotate packet loss hops |
| Port Probe | telnet / curl results | Record connection status (success/refused/timeout) |
| Logs | Gateway/application error logs | Key error message screenshots |
| Timeline | Operation timestamps | Discovery time, action time, recovery time |

> Note: All screenshots must include timestamps for post-incident timeline alignment.

### Channel Partner Escalation
```
Subject: [Urgent] Connectivity Issue to <endpoint>

We are experiencing connectivity issues to your endpoint:
- Endpoint: <url>
- Error: <error description>
- Since: <timestamp>
- Our source IP: <ip>

Please investigate and advise.
```

## 8. Post-Incident

- Document timeline of events
- Identify root cause
- Update monitoring/alerting if gaps found
- Update this SOP if new scenario encountered
- Schedule post-mortem for P0/P1 incidents
- Implement preventive measures
