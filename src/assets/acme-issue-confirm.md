**Domain:** {{domain}}

**Domains:** {{domains}}

#### Issuance Process

+ Create ACME order
+ Add DNS-01 challenge records
+ Wait for DNS propagation (~60s)
+ Trigger DNS challenge verification
+ Submit CSR and wait for certificate
+ Download and store certificate
+ Auto deploy to EDS instances


> ⚠️ This process takes approximately **2-3 minutes**.
