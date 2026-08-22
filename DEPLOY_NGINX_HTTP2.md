# Nginx HTTP/2 Configuration for goproxe.com

## Problem

Current deployment serves content over **HTTP/1.1**, causing sequential resource loading.

**Lighthouse estimates ~1.6s savings** from enabling HTTP/2, which allows:
- Parallel resource downloads (CSS, JS, images)
- Header compression (reduces overhead)
- Server push (optional, for critical resources)

## Impact on LCP

HTTP/1.1 forces browsers to download stylesheets sequentially. With 6 render-blocking CSS files, this creates a waterfall:
1. HTML loads
2. CSS #1 downloads → blocks
3. CSS #2 downloads → blocks
4. CSS #3–6 download sequentially
5. **Only then** can hero text paint

HTTP/2 allows parallel downloads, reducing this waterfall significantly.

## Required Configuration

### Minimal nginx HTTP/2 Setup

Add to your nginx server block:

```nginx
server {
    listen 443 ssl http2;  # Add http2 here
    listen [::]:443 ssl http2;  # IPv6 support
    
    server_name goproxe.com www.goproxe.com;
    
    # SSL cert paths (Let's Encrypt recommended)
    ssl_certificate /etc/letsencrypt/live/goproxe.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/goproxe.com/privkey.pem;
    
    # SSL optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # HTTP/2 push (optional - for critical CSS)
    # http2_push /path/to/critical.css;
    
    root /var/www/goproxe.com;
    index index.html;
    
    # Next.js static assets cache
    location /_next/static {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Other Next.js routes
    location / {
        try_files $uri $uri/ @nextjs;
    }
    
    location @nextjs {
        proxy_pass http://localhost:3000;  # Or your Next.js port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name goproxe.com www.goproxe.com;
    return 301 https://$server_name$request_uri;
}
```

### Verification

After enabling HTTP/2, verify with:

```bash
# Check protocol in browser
curl -I --http2 https://goproxe.com

# Should show:
# HTTP/2 200

# Or use browser DevTools:
# 1. Open Network tab
# 2. Right-click columns → show "Protocol"
# 3. Should see "h2" instead of "http/1.1"
```

### Expected Performance Impact

- **LCP:** Reduce by ~1–1.6s (parallel CSS loading)
- **FCP:** Reduce by ~500ms–1s
- **Overall Lighthouse Score:** +5–10 points

### Browser Support

HTTP/2 is supported by:
- Chrome 41+ (2015)
- Firefox 36+ (2015)
- Safari 9+ (2015)
- Edge (all versions)
- Mobile browsers (iOS 9+, Android 5+)

**Fallback:** Older browsers automatically fall back to HTTP/1.1.

## Testing Before Production

1. **Enable on staging** first
2. Run Lighthouse audit on staging URL
3. Verify LCP improvement
4. Check for any CDN/proxy compatibility issues
5. Deploy to production

## Related Resources

- [Nginx HTTP/2 Module Docs](https://nginx.org/en/docs/http/ngx_http_v2_module.html)
- [HTTP/2 Spec (RFC 7540)](https://tools.ietf.org/html/rfc7540)
- [Can I Use HTTP/2](https://caniuse.com/http2)

---

**Priority:** HIGH - Single config change for ~1.6s LCP improvement.

**Effort:** 5 minutes (if SSL is already configured).

**Risk:** LOW - Automatic fallback to HTTP/1.1 for old browsers.
