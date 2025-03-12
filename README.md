#### proxy.conf.json


+ LOCAL
```json
{
  "/api": {
    "target": "http://localhost:8081",
    "secure": true,
    "changeOrigin": true
  }
}
```

+ PROD
```json
{
  "/api": {
    "target": "https://cratos.palmpay-inc.com",
    "secure": true,
    "changeOrigin": true
  }
}
```

