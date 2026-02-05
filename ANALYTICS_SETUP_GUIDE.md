# Real-Time Visitor Analytics Setup Guide

This guide explains how to set up and use the real-time visitor analytics system.

## What Was Created

### Frontend Components

1. **Visitor Tracking Script** (`snippets/visitor-analytics-tracking.liquid`)
   - Automatically tracks page views, user interactions, and session data
   - Sends data to your analytics API in real-time

2. **Dashboard Widget** (`sections/analytics-dashboard-widget.liquid`)
   - Compact widget showing key metrics
   - Displays on the account dashboard overview

3. **Full Analytics Dashboard** (`sections/analytics-dashboard.liquid`)
   - Complete analytics page with all metrics
   - Real-time visitor map, top pages, traffic sources, etc.

4. **Analytics Page Template** (`templates/page.analytics.json`)
   - Template for the full analytics page

5. **Account Navigation** (`snippets/account-navigation.liquid`)
   - Navigation menu with Analytics link

6. **Styling & JavaScript**
   - `assets/analytics-dashboard.css` - All styling
   - `assets/analytics-dashboard.js` - Real-time data fetching and rendering

## Setup Steps

### 1. Configure API URL

Update the API URL in the following files:

**`snippets/visitor-analytics-tracking.liquid`** (line 26):
```javascript
const ANALYTICS_API_URL = 'https://your-api-domain.com/api/analytics/track';
```

**`sections/analytics-dashboard-widget.liquid`** (schema settings):
- Update the default `api_url` in the schema

**`sections/analytics-dashboard.liquid`** (schema settings):
- Update the default `api_url` in the schema

### 2. Create Analytics Page in Shopify

1. Go to Shopify Admin → Online Store → Pages
2. Click "Add page"
3. Set the page title to "Analytics"
4. Set the page handle to "analytics" (important!)
5. In the template dropdown, select "page.analytics"
6. Save the page

### 3. Verify Tracking Script

The tracking script is automatically included in `layout/theme.liquid`. Verify it's present:
```liquid
{% render 'visitor-analytics-tracking' %}
```

### 4. Set Up Backend API

Follow the instructions in `ANALYTICS_API_DOCUMENTATION.md` to implement the backend API endpoints.

Required endpoints:
- `POST /api/analytics/track` - Receives tracking data
- `GET /api/analytics/stats` - Returns aggregated analytics data

### 5. Test the System

1. Visit your storefront
2. Navigate to different pages
3. Check your browser console for tracking logs
4. Visit `/account` to see the dashboard widget
5. Visit `/pages/analytics` to see the full dashboard

## Features

### Metrics Tracked

- **Active Visitors** - Real-time count of visitors on site
- **Bounce Rate** - Percentage of single-page sessions
- **Average Session Time** - Average time visitors spend on site
- **Pages per Session** - Average number of pages viewed per session
- **Total Visitors** - Total unique visitors
- **Sessions** - Total number of sessions
- **Entry Pages** - Most common landing pages
- **Exit Pages** - Most common exit pages
- **Traffic Sources** - Where visitors come from
- **Device Types** - Desktop, mobile, tablet breakdown
- **Browsers** - Browser usage statistics
- **Geographic Distribution** - Visitor locations

### Real-Time Updates

- Dashboard automatically refreshes every 10 seconds (configurable)
- Active visitors list updates in real-time
- All metrics show percentage changes from previous period

### Widget vs Full Dashboard

**Widget** (on account dashboard):
- Shows key metrics at a glance
- Compact view with active visitors list
- Top pages summary

**Full Dashboard** (analytics page):
- Complete analytics overview
- All metrics with detailed breakdowns
- Time range selector (1h, 24h, 7d, 30d)
- Geographic distribution
- Device and browser breakdowns

## Customization

### Change Refresh Interval

In the section settings (Shopify theme editor):
- Find "Analytics Dashboard Widget" or "Analytics Dashboard" section
- Adjust "Refresh Interval" (5-60 seconds)

### Customize API URL

You can set different API URLs per section instance in the Shopify theme editor.

### Styling

All styles are in `assets/analytics-dashboard.css`. You can customize:
- Colors
- Spacing
- Card styles
- Responsive breakpoints

## Troubleshooting

### Widget/Dashboard Not Loading

1. Check browser console for errors
2. Verify API URL is correct
3. Ensure backend API is running and accessible
4. Check CORS settings on your API

### No Data Showing

1. Verify tracking script is loaded (check browser console)
2. Check that events are being sent to API
3. Verify backend is storing events correctly
4. Check API response format matches expected structure

### Analytics Link Not Showing

1. Verify the analytics page exists with handle "analytics"
2. Check that `account-navigation.liquid` snippet is being rendered
3. Verify header account menu includes analytics link

## Security Considerations

- The tracking script runs on the client side
- Consider implementing authentication for the analytics dashboard
- Use HTTPS for all API communications
- Implement rate limiting on tracking endpoints
- Sanitize all user input on the backend

## Performance

- Tracking uses `sendBeacon` API for reliable delivery
- Dashboard uses efficient polling (configurable interval)
- Consider caching aggregated stats on the backend
- Use database indexes for fast queries

## Support

For issues or questions:
1. Check browser console for errors
2. Review API documentation
3. Verify backend implementation matches API spec
4. Test API endpoints directly with curl/Postman
