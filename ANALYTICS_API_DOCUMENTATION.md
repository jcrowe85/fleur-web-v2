# Real-Time Visitor Analytics API Documentation

This document describes the backend API endpoints required for the real-time visitor analytics system.

## Base URL
```
https://affiliates.tryfleur.com/api/analytics
```

## Endpoints

### 1. Track Page View / Event
**POST** `/track`

Tracks visitor page views and events.

#### Request Body
```json
{
  "event": "page_view",
  "session_id": "sess_1234567890_abc123",
  "visitor_id": "visitor_abc123",
  "shop": "your-shop.myshopify.com",
  "page": {
    "url": "https://yourshop.com/products/item",
    "path": "/products/item",
    "title": "Product Page",
    "referrer": "https://google.com"
  },
  "session": {
    "start_time": 1234567890000,
    "page_views": 3,
    "pages_visited": ["/", "/products/item", "/cart"],
    "entry_page": "/",
    "time_on_page": 45000
  },
  "referrer": {
    "type": "external",
    "url": "https://google.com",
    "domain": "google.com"
  },
  "device": {
    "type": "desktop",
    "userAgent": "Mozilla/5.0...",
    "screenWidth": 1920,
    "screenHeight": 1080,
    "language": "en-US",
    "timezone": "America/New_York"
  },
  "timestamp": 1234567890000
}
```

#### Response
```json
{
  "success": true,
  "message": "Event tracked"
}
```

---

### 2. Get Analytics Stats
**GET** `/stats?shop={shop}&timeRange={timeRange}`

Retrieves aggregated analytics statistics.

#### Query Parameters
- `shop` (required): Shop domain (e.g., "your-shop.myshopify.com")
- `timeRange` (optional): Time range filter - `1h`, `24h`, `7d`, `30d` (default: `24h`)

#### Response
```json
{
  "metrics": {
    "total_visitors": 1250,
    "unique_visitors": 980,
    "sessions": 1450,
    "bounce_rate": 45.2,
    "avg_session_time": 185,
    "pages_per_session": 3.2,
    "total_visitors_change": 12.5,
    "bounce_rate_change": -2.3,
    "avg_session_time_change": 5.1
  },
  "activeVisitors": [
    {
      "session_id": "sess_1234567890_abc123",
      "currentPage": "/products/item",
      "device": "desktop",
      "location": "United States",
      "lastSeen": 1234567890000
    }
  ],
  "topPages": [
    {
      "path": "/products/item",
      "url": "https://yourshop.com/products/item",
      "views": 450,
      "bounceRate": 35.2
    }
  ],
  "entryPages": [
    {
      "path": "/",
      "url": "https://yourshop.com/",
      "entries": 320
    }
  ],
  "exitPages": [
    {
      "path": "/cart",
      "url": "https://yourshop.com/cart",
      "exits": 180
    }
  ],
  "trafficSources": [
    {
      "source": "direct",
      "visitors": 450,
      "percentage": 36.0
    },
    {
      "source": "google.com",
      "visitors": 320,
      "percentage": 25.6
    }
  ],
  "devices": [
    {
      "type": "desktop",
      "count": 750,
      "percentage": 60.0
    },
    {
      "type": "mobile",
      "count": 400,
      "percentage": 32.0
    },
    {
      "type": "tablet",
      "count": 100,
      "percentage": 8.0
    }
  ],
  "browsers": [
    {
      "name": "Chrome",
      "count": 800,
      "percentage": 64.0
    },
    {
      "name": "Safari",
      "count": 300,
      "percentage": 24.0
    }
  ],
  "geography": [
    {
      "country": "United States",
      "visitors": 600,
      "percentage": 48.0
    },
    {
      "country": "United Kingdom",
      "visitors": 200,
      "percentage": 16.0
    }
  ]
}
```

---

## Database Schema Recommendations

### Events Table
```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  shop VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  visitor_id VARCHAR(255) NOT NULL,
  page_url TEXT,
  page_path VARCHAR(500),
  page_title VARCHAR(500),
  referrer TEXT,
  referrer_type VARCHAR(50),
  device_type VARCHAR(50),
  user_agent TEXT,
  screen_width INT,
  screen_height INT,
  language VARCHAR(10),
  timezone VARCHAR(100),
  location_country VARCHAR(100),
  location_city VARCHAR(100),
  session_data JSONB,
  event_data JSONB,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_shop_timestamp (shop, timestamp),
  INDEX idx_session_id (session_id),
  INDEX idx_visitor_id (visitor_id)
);
```

### Sessions Table
```sql
CREATE TABLE analytics_sessions (
  id BIGSERIAL PRIMARY KEY,
  shop VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  visitor_id VARCHAR(255) NOT NULL,
  entry_page VARCHAR(500),
  exit_page VARCHAR(500),
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  page_views INT DEFAULT 0,
  pages_visited TEXT[],
  total_time INT,
  is_bounce BOOLEAN DEFAULT false,
  device_type VARCHAR(50),
  location_country VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_shop_start_time (shop, start_time),
  INDEX idx_session_id (session_id)
);
```

---

## Implementation Notes

### Real-Time Updates
- Use WebSockets or Server-Sent Events (SSE) for real-time visitor updates
- Consider using Redis for real-time session tracking
- Cache aggregated stats with TTL (e.g., 10 seconds) to reduce database load

### Bounce Rate Calculation
A bounce is defined as a session with only one page view:
```
bounce_rate = (bounced_sessions / total_sessions) * 100
```

### Session Time Calculation
```
session_time = sum(time_on_page for all pages in session)
```

### Active Visitors
Visitors are considered "active" if they have had activity in the last 5 minutes.

### Performance Considerations
- Use database indexes on frequently queried fields (shop, timestamp, session_id)
- Implement pagination for large result sets
- Use materialized views or pre-aggregated tables for common queries
- Consider using a time-series database (e.g., InfluxDB, TimescaleDB) for better performance

### Security
- Validate and sanitize all input data
- Implement rate limiting on tracking endpoints
- Use CORS headers appropriately
- Consider implementing authentication for admin endpoints

---

## Example Implementation (Node.js/Express)

```javascript
const express = require('express');
const router = express.Router();

// POST /api/analytics/track
router.post('/track', async (req, res) => {
  try {
    const { shop, session_id, visitor_id, event, page, device, timestamp } = req.body;
    
    // Store event in database
    await db.query(
      'INSERT INTO analytics_events (shop, event_type, session_id, visitor_id, page_url, page_path, device_type, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [shop, event, session_id, visitor_id, page.url, page.path, device.type, timestamp]
    );
    
    // Update session if needed
    await updateSession(shop, session_id, visitor_id, page, timestamp);
    
    res.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    const { shop, timeRange = '24h' } = req.query;
    const timeRangeMs = getTimeRangeMs(timeRange);
    const startTime = Date.now() - timeRangeMs;
    
    // Get metrics
    const metrics = await calculateMetrics(shop, startTime);
    
    // Get active visitors
    const activeVisitors = await getActiveVisitors(shop);
    
    // Get top pages
    const topPages = await getTopPages(shop, startTime);
    
    // ... other aggregations
    
    res.json({
      metrics,
      activeVisitors,
      topPages,
      // ... other data
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

function getTimeRangeMs(timeRange) {
  const ranges = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  return ranges[timeRange] || ranges['24h'];
}
```

---

## Testing

You can test the API endpoints using curl:

```bash
# Track a page view
curl -X POST https://affiliates.tryfleur.com/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "page_view",
    "session_id": "test_session_123",
    "visitor_id": "test_visitor_123",
    "shop": "test-shop.myshopify.com",
    "page": {
      "url": "https://test-shop.com/products/test",
      "path": "/products/test",
      "title": "Test Product"
    },
    "timestamp": 1234567890000
  }'

# Get stats
curl "https://affiliates.tryfleur.com/api/analytics/stats?shop=test-shop.myshopify.com&timeRange=24h"
```
