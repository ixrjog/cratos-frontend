>>>> Cratos

+ LOCAL
```json
{
  "/api": {
    "target": "http://localhost:8081",
    "secure": false,
    "changeOrigin": true
  }
}
```

+ PRE
```json
{
  "/api": {
    "target": "https://cratos-pre.palmpay-inc.com",
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

### Version
+ Node Version: v18.19.0 (NPM 10.2.3)
+ Angular: 15.2.0
+ DevUI Design Of Angular: 15.1.0

