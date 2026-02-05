/**
 * Analytics Dashboard JavaScript
 * Handles real-time data fetching and visualization
 */

class AnalyticsDashboard {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      console.error('Analytics dashboard container not found');
      return;
    }
    
    this.apiUrl = options.apiUrl || this.container.dataset.apiUrl || 'https://affiliates.tryfleur.com/api/analytics';
    this.shop = options.shop || this.container.dataset.shop || '';
    this.refreshInterval = options.refreshInterval || 10; // seconds
    this.timeRange = options.timeRange || '24h';
    
    this.isWidget = this.container.classList.contains('analytics-dashboard-widget');
    this.refreshTimer = null;
    this.isLoading = false;
    
    this.init();
  }
  
  init() {
    // Set up refresh button
    const refreshBtn = this.container.querySelector('.analytics-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refresh());
    }
    
    // Set up time range selector
    const timeRangeSelect = this.container.querySelector('[data-time-range]');
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => {
        this.timeRange = e.target.value;
        this.refresh();
      });
    }
    
    // Initial load
    this.refresh();
    
    // Set up auto-refresh
    this.startAutoRefresh();
  }
  
  startAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    
    this.refreshTimer = setInterval(() => {
      this.refresh(false); // Silent refresh
    }, this.refreshInterval * 1000);
  }
  
  async refresh(showLoading = true) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    if (showLoading) {
      this.showLoading();
    }
    
    try {
      const data = await this.fetchAnalyticsData();
      this.render(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }
  
  async fetchAnalyticsData() {
    const url = `${this.apiUrl}/stats?shop=${encodeURIComponent(this.shop)}&timeRange=${this.timeRange}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  showLoading() {
    const loadingElements = this.container.querySelectorAll('.analytics-loading');
    loadingElements.forEach(el => {
      el.style.display = 'block';
    });
  }
  
  showError(message) {
    const errorHtml = `<div class="analytics-error">Error loading analytics: ${message}</div>`;
    
    // Replace loading states with error
    const loadingElements = this.container.querySelectorAll('.analytics-loading');
    loadingElements.forEach(el => {
      el.outerHTML = errorHtml;
    });
  }
  
  render(data) {
    if (!data) {
      this.showError('No data available');
      return;
    }
    
    // Render metrics
    this.renderMetrics(data.metrics || {});
    
    // Render visitors list
    if (this.container.querySelector('[data-visitors-list]')) {
      this.renderVisitorsList(data.activeVisitors || []);
    }
    
    // Render top pages
    if (this.container.querySelector('[data-top-pages]')) {
      this.renderTopPages(data.topPages || []);
    }
    
    // Render entry/exit pages
    if (this.container.querySelector('[data-entry-pages]')) {
      this.renderEntryPages(data.entryPages || []);
    }
    
    if (this.container.querySelector('[data-exit-pages]')) {
      this.renderExitPages(data.exitPages || []);
    }
    
    // Render traffic sources
    if (this.container.querySelector('[data-traffic-sources]')) {
      this.renderTrafficSources(data.trafficSources || []);
    }
    
    // Render devices
    if (this.container.querySelector('[data-devices]')) {
      this.renderDevices(data.devices || []);
    }
    
    // Render browsers
    if (this.container.querySelector('[data-browsers]')) {
      this.renderBrowsers(data.browsers || []);
    }
    
    // Render geography
    if (this.container.querySelector('[data-geography]')) {
      this.renderGeography(data.geography || []);
    }
    
    // Render visitors map
    if (this.container.querySelector('[data-visitors-map]')) {
      this.renderVisitorsMap(data.activeVisitors || []);
    }
  }
  
  renderMetrics(metrics) {
    const metricElements = this.container.querySelectorAll('[data-metric]');
    
    metricElements.forEach(el => {
      const metricName = el.dataset.metric;
      const value = metrics[metricName];
      
      if (value !== undefined && value !== null) {
        el.textContent = this.formatMetricValue(metricName, value);
        
        // Show change if available
        const changeEl = this.container.querySelector(`[data-metric-change="${metricName}"]`);
        if (changeEl && metrics[`${metricName}_change`] !== undefined) {
          const change = metrics[`${metricName}_change`];
          changeEl.textContent = change > 0 ? `+${change}%` : `${change}%`;
          changeEl.className = `metric-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
      } else {
        el.textContent = '-';
      }
    });
  }
  
  formatMetricValue(metricName, value) {
    if (typeof value !== 'number') return value;
    
    switch (metricName) {
      case 'bounce_rate':
        return `${value.toFixed(1)}%`;
      case 'avg_session_time':
        return this.formatTime(value);
      case 'pages_per_session':
        return value.toFixed(1);
      default:
        return value.toLocaleString();
    }
  }
  
  formatTime(seconds) {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}m ${secs}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    }
  }
  
  renderVisitorsList(visitors) {
    const container = this.container.querySelector('[data-visitors-list]');
    if (!container) return;
    
    if (visitors.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No active visitors</div>';
      return;
    }
    
    const html = visitors.map(visitor => `
      <div class="visitor-item">
        <div class="visitor-info">
          <div class="visitor-page">${this.escapeHtml(visitor.currentPage || '/')}</div>
          <div class="visitor-details">
            <span>${visitor.device || 'Unknown'}</span>
            <span>${visitor.location || 'Unknown'}</span>
          </div>
        </div>
        <div class="visitor-time">${this.formatTimeAgo(visitor.lastSeen)}</div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderTopPages(pages) {
    const container = this.container.querySelector('[data-top-pages]');
    if (!container) return;
    
    if (pages.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No page data available</div>';
      return;
    }
    
    const html = pages.map((page, index) => `
      <div class="page-item">
        <div class="page-url">${this.escapeHtml(page.path || page.url)}</div>
        <div class="page-stats">
          <span class="page-views">${page.views || 0} views</span>
          <span>${(page.bounceRate || 0).toFixed(1)}% bounce</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderEntryPages(pages) {
    const container = this.container.querySelector('[data-entry-pages]');
    if (!container) return;
    
    if (pages.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No entry page data</div>';
      return;
    }
    
    const html = pages.map(page => `
      <div class="page-item">
        <div class="page-url">${this.escapeHtml(page.path || page.url)}</div>
        <div class="page-stats">
          <span class="page-views">${page.entries || 0} entries</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderExitPages(pages) {
    const container = this.container.querySelector('[data-exit-pages]');
    if (!container) return;
    
    if (pages.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No exit page data</div>';
      return;
    }
    
    const html = pages.map(page => `
      <div class="page-item">
        <div class="page-url">${this.escapeHtml(page.path || page.url)}</div>
        <div class="page-stats">
          <span class="page-views">${page.exits || 0} exits</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderTrafficSources(sources) {
    const container = this.container.querySelector('[data-traffic-sources]');
    if (!container) return;
    
    if (sources.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No traffic source data</div>';
      return;
    }
    
    const html = sources.map(source => `
      <div class="traffic-source-item">
        <div class="traffic-source-name">${this.escapeHtml(source.source || 'Direct')}</div>
        <div class="traffic-source-stats">
          <span>${source.visitors || 0} visitors</span>
          <span>${(source.percentage || 0).toFixed(1)}%</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderDevices(devices) {
    const container = this.container.querySelector('[data-devices]');
    if (!container) return;
    
    if (devices.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No device data</div>';
      return;
    }
    
    const html = devices.map(device => `
      <div class="device-item">
        <div class="device-name">${this.escapeHtml(device.type || 'Unknown')}</div>
        <div class="device-stats">
          <span>${device.count || 0} (${(device.percentage || 0).toFixed(1)}%)</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderBrowsers(browsers) {
    const container = this.container.querySelector('[data-browsers]');
    if (!container) return;
    
    if (browsers.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No browser data</div>';
      return;
    }
    
    const html = browsers.map(browser => `
      <div class="browser-item">
        <div class="browser-name">${this.escapeHtml(browser.name || 'Unknown')}</div>
        <div class="browser-stats">
          <span>${browser.count || 0} (${(browser.percentage || 0).toFixed(1)}%)</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderGeography(geography) {
    const container = this.container.querySelector('[data-geography]');
    if (!container) return;
    
    if (geography.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No geographic data</div>';
      return;
    }
    
    const html = geography.map(geo => `
      <div class="geography-item">
        <div class="geography-country">${this.escapeHtml(geo.country || 'Unknown')}</div>
        <div class="geography-stats">
          <span>${geo.visitors || 0} visitors (${(geo.percentage || 0).toFixed(1)}%)</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
  }
  
  renderVisitorsMap(visitors) {
    const container = this.container.querySelector('[data-visitors-map]');
    if (!container) return;
    
    // Simple text-based map for now
    // In production, you'd use a library like Leaflet or Google Maps
    if (visitors.length === 0) {
      container.innerHTML = '<div class="analytics-empty">No active visitors to display on map</div>';
      return;
    }
    
    const locations = visitors
      .filter(v => v.location)
      .map(v => v.location)
      .reduce((acc, loc) => {
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
      }, {});
    
    const mapHtml = Object.entries(locations)
      .map(([location, count]) => `<div>${this.escapeHtml(location)}: ${count} visitor(s)</div>`)
      .join('');
    
    container.innerHTML = `<div style="text-align: left;">${mapHtml}</div>`;
  }
  
  formatTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize full dashboard
  const dashboard = document.querySelector('.analytics-dashboard');
  if (dashboard) {
    const apiUrl = dashboard.dataset.apiUrl || 'https://affiliates.tryfleur.com/api/analytics';
    const refreshInterval = parseInt(dashboard.dataset.refreshInterval) || 10;
    
    new AnalyticsDashboard(dashboard, {
      apiUrl: apiUrl,
      refreshInterval: refreshInterval
    });
  }
  
  // Initialize widget
  const widget = document.querySelector('.analytics-dashboard-widget');
  if (widget) {
    const apiUrl = widget.dataset.apiUrl || 'https://affiliates.tryfleur.com/api/analytics';
    const refreshInterval = parseInt(widget.dataset.refreshInterval) || 10;
    
    new AnalyticsDashboard(widget, {
      apiUrl: apiUrl,
      refreshInterval: refreshInterval
    });
  }
});
