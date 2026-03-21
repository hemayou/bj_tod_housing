// ========================================
// 北京轨道交通TOD — App (v2 using real GeoJSON)
// ========================================

(function() {
  'use strict';

  let map;
  let activeZone = null;
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let metroLinesData = null;
  let metroLinesUcData = null;
  let metroStationsData = null;

  const $loading = document.getElementById('loading-screen');
  const $themeToggle = document.getElementById('theme-toggle');
  const $legendToggle = document.getElementById('legend-toggle');
  const $legendPanel = document.getElementById('legend-panel');
  const $legendClose = document.getElementById('legend-close');
  const $sidePanel = document.getElementById('side-panel');
  const $panelClose = document.getElementById('panel-close');
  const $panelContent = document.getElementById('panel-content');
  const $zoneNavInner = document.getElementById('zone-nav-inner');
  const $northBtn = document.getElementById('north-btn');

  // ========================================
  // Theme
  // ========================================
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (map) {
      map.setStyle(getMapStyle());
      map.once('style.load', () => {
        addAllMapLayers();
        if (activeZone) highlightZone(activeZone);
      });
    }
  }

  function getMapStyle() {
    return isDark
      ? 'https://tiles.openfreemap.org/styles/dark'
      : 'https://tiles.openfreemap.org/styles/positron';
  }

  $themeToggle.addEventListener('click', () => { isDark = !isDark; applyTheme(); });
  applyTheme();

  // ========================================
  // Legend
  // ========================================
  $legendToggle.addEventListener('click', () => { $legendPanel.classList.toggle('visible'); });
  $legendClose.addEventListener('click', () => { $legendPanel.classList.remove('visible'); });

  // ========================================
  // North Button
  // ========================================
  if ($northBtn) {
    $northBtn.addEventListener('click', () => {
      map.easeTo({ bearing: 0, pitch: 0, duration: 600 });
    });
  }

  // ========================================
  // Data Loading
  // ========================================
  async function loadData() {
    const [linesResp, ucResp, stationsResp] = await Promise.all([
      fetch('metro_lines.json'),
      fetch('metro_lines_uc.json'),
      fetch('metro_stations.json')
    ]);
    metroLinesData = await linesResp.json();
    metroLinesUcData = await ucResp.json();
    metroStationsData = await stationsResp.json();
  }

  // ========================================
  // Map Initialization
  // ========================================
  async function initMap() {
    await loadData();

    map = new maplibregl.Map({
      container: 'map',
      style: getMapStyle(),
      center: [116.4074, 39.9042],
      zoom: 10.5,
      pitch: 0,
      bearing: 0,
      maxZoom: 17,
      minZoom: 8,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      addAllMapLayers();
      buildZoneNav();
      hideLoading();
    });
  }

  // ========================================
  // Add All Map Layers
  // ========================================
  function addAllMapLayers() {
    if (!metroLinesData) return;

    // 1. Operating lines from real GeoJSON
    if (!map.getSource('operating-lines')) {
      map.addSource('operating-lines', { type: 'geojson', data: metroLinesData });

      // Glow
      map.addLayer({
        id: 'operating-lines-glow',
        type: 'line',
        source: 'operating-lines',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 4, 12, 8, 16, 12],
          'line-opacity': 0.12,
          'line-blur': 4
        }
      });

      // Main line
      map.addLayer({
        id: 'operating-lines-main',
        type: 'line',
        source: 'operating-lines',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 12, 3, 16, 5],
          'line-opacity': 0.9
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' }
      });
    }

    // 2. Under-construction lines from GeoJSON (citylines.co data)
    if (!map.getSource('uc-lines')) {
      map.addSource('uc-lines', { type: 'geojson', data: metroLinesUcData });
      map.addLayer({
        id: 'uc-lines-main',
        type: 'line',
        source: 'uc-lines',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 12, 3, 16, 5],
          'line-opacity': 0.7,
          'line-dasharray': [3, 2]
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' }
      });
    }

    // 3. Supplementary under-construction lines (not in citylines.co)
    SUPPLEMENTARY_UC_LINES.forEach(line => {
      const srcId = `suppl-uc-${line.id}`;
      if (map.getSource(srcId)) return;
      map.addSource(srcId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: line.name, color: line.color, status: line.status },
          geometry: { type: 'LineString', coordinates: line.coords }
        }
      });
      map.addLayer({
        id: `${srcId}-main`,
        type: 'line',
        source: srcId,
        paint: {
          'line-color': line.color,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 12, 3, 16, 5],
          'line-opacity': 0.7,
          'line-dasharray': [3, 2]
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' }
      });
    });

    // 4. Stations from real GeoJSON
    if (!map.getSource('stations')) {
      map.addSource('stations', { type: 'geojson', data: metroStationsData });

      // Transfer station outer ring
      map.addLayer({
        id: 'stations-transfer-ring',
        type: 'circle',
        source: 'stations',
        filter: ['==', ['get', 'transfer'], true],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 2, 12, 6, 16, 10],
          'circle-color': 'transparent',
          'circle-stroke-color': isDark ? '#FFCC33' : '#FFB703',
          'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1.2, 16, 2],
          'circle-stroke-opacity': 0.6
        }
      });

      // Station dots
      map.addLayer({
        id: 'stations-dots',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 1, 11, 2, 13, 4, 16, 7],
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'under_construction'],
            isDark ? '#FF6B6B' : '#E63946',
            isDark ? '#4A9EFF' : '#0066CC'
          ],
          'circle-stroke-color': isDark ? '#161920' : '#FFFFFF',
          'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1, 16, 2]
        }
      });

      // Station labels
      map.addLayer({
        id: 'stations-labels',
        type: 'symbol',
        source: 'stations',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 16, 13],
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
          'text-font': ['Noto Sans Regular'],
          'text-optional': true,
          'text-allow-overlap': false,
          'text-padding': 2
        },
        paint: {
          'text-color': isDark ? '#E8E8E8' : '#1A1A1A',
          'text-halo-color': isDark ? '#161920' : '#FFFFFF',
          'text-halo-width': 1.5
        }
      });
    }

    // 5. Opportunity zones
    addOpportunityZones();

    // 6. Station click popup
    if (!map._stationClickBound) {
      map._stationClickBound = true;
      map.on('click', 'stations-dots', (e) => {
        const props = e.features[0].properties;
        const coords = e.features[0].geometry.coordinates;
        let lines;
        try { lines = JSON.parse(props.lines); } catch(_) { lines = [props.lines]; }

        const linesBadges = lines.map(l => {
          return `<span class="popup-line" style="background:#666">${l}</span>`;
        }).join('');

        const statusBadge = props.status === 'under_construction'
          ? '<div class="popup-desc" style="color:#E63946">🚧 在建</div>' 
          : '';

        new maplibregl.Popup({ offset: 12, closeButton: true })
          .setLngLat(coords)
          .setHTML(`
            <div class="popup-title">${props.name}</div>
            <div>${linesBadges}</div>
            ${props.transfer ? '<div class="popup-desc">🔄 换乘站</div>' : ''}
            ${statusBadge}
          `)
          .addTo(map);
      });
      map.on('mouseenter', 'stations-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'stations-dots', () => { map.getCanvas().style.cursor = ''; });
    }
  }

  // ========================================
  // Opportunity Zones
  // ========================================
  function addOpportunityZones() {
    OPPORTUNITY_ZONES.forEach(zone => {
      const sourceId = `zone-${zone.id}`;
      if (map.getSource(sourceId)) return;

      const circleGeo = createCircle(zone.center, zone.radius);

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [circleGeo] },
          properties: { id: zone.id, name: zone.name }
        }
      });

      map.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': isDark ? 'rgba(74, 158, 255, 0.08)' : 'rgba(0, 102, 204, 0.06)',
          'fill-opacity': 0.8
        }
      });

      map.addLayer({
        id: `${sourceId}-border`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': isDark ? 'rgba(74, 158, 255, 0.4)' : 'rgba(0, 102, 204, 0.35)',
          'line-width': 2,
          'line-dasharray': [4, 3],
          'line-opacity': 0.8
        }
      });

      const labelSrcId = `zone-label-${zone.id}`;
      if (!map.getSource(labelSrcId)) {
        map.addSource(labelSrcId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: zone.center },
            properties: { name: zone.name }
          }
        });
        map.addLayer({
          id: `${labelSrcId}-text`,
          type: 'symbol',
          source: labelSrcId,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 8, 10, 12, 14, 16, 18],
            'text-font': ['Noto Sans Bold'],
            'text-anchor': 'center',
            'text-allow-overlap': true
          },
          paint: {
            'text-color': isDark ? '#FF6B6B' : '#E63946',
            'text-halo-color': isDark ? 'rgba(22,25,32,0.85)' : 'rgba(255,255,255,0.85)',
            'text-halo-width': 2
          }
        });
      }

      map.on('click', `${sourceId}-fill`, () => { selectZone(zone.id); });
      map.on('mouseenter', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', 1);
        map.setPaintProperty(`${sourceId}-fill`, 'fill-color',
          isDark ? 'rgba(74, 158, 255, 0.15)' : 'rgba(0, 102, 204, 0.12)');
      });
      map.on('mouseleave', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = '';
        if (activeZone !== zone.id) {
          map.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', 0.8);
          map.setPaintProperty(`${sourceId}-fill`, 'fill-color',
            isDark ? 'rgba(74, 158, 255, 0.08)' : 'rgba(0, 102, 204, 0.06)');
        }
      });
    });
  }

  function createCircle(center, radiusMeters, steps) {
    steps = steps || 64;
    const coords = [];
    const earthRadius = 6371000;
    const lat = center[1] * Math.PI / 180;
    const lng = center[0] * Math.PI / 180;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const dLat = (radiusMeters / earthRadius) * Math.cos(angle);
      const dLng = (radiusMeters / (earthRadius * Math.cos(lat))) * Math.sin(angle);
      coords.push([(lng + dLng) * 180 / Math.PI, (lat + dLat) * 180 / Math.PI]);
    }
    return coords;
  }

  // ========================================
  // Zone Navigation
  // ========================================
  function buildZoneNav() {
    const overviewBtn = document.createElement('button');
    overviewBtn.className = 'zone-btn active';
    overviewBtn.textContent = '全览';
    overviewBtn.addEventListener('click', () => { resetView(); });
    $zoneNavInner.appendChild(overviewBtn);

    OPPORTUNITY_ZONES.forEach(zone => {
      const btn = document.createElement('button');
      btn.className = 'zone-btn';
      btn.textContent = zone.name;
      btn.dataset.zoneId = zone.id;
      btn.addEventListener('click', () => selectZone(zone.id));
      $zoneNavInner.appendChild(btn);
    });
  }

  function selectZone(zoneId) {
    const zone = OPPORTUNITY_ZONES.find(z => z.id === zoneId);
    if (!zone) return;
    activeZone = zoneId;

    document.querySelectorAll('.zone-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.zoneId === zoneId);
    });

    map.flyTo({
      center: zone.center, zoom: 13, pitch: 30, bearing: -10,
      duration: 1500, essential: true
    });

    highlightZone(zoneId);
    showPanel(zone);
    $legendPanel.classList.remove('visible');
  }

  function highlightZone(zoneId) {
    OPPORTUNITY_ZONES.forEach(z => {
      const sid = `zone-${z.id}`;
      try {
        if (z.id === zoneId) {
          map.setPaintProperty(`${sid}-fill`, 'fill-color',
            isDark ? 'rgba(74, 158, 255, 0.18)' : 'rgba(0, 102, 204, 0.15)');
          map.setPaintProperty(`${sid}-border`, 'line-color',
            isDark ? 'rgba(74, 158, 255, 0.7)' : 'rgba(0, 102, 204, 0.6)');
          map.setPaintProperty(`${sid}-border`, 'line-width', 3);
        } else {
          map.setPaintProperty(`${sid}-fill`, 'fill-color',
            isDark ? 'rgba(74, 158, 255, 0.04)' : 'rgba(0, 102, 204, 0.03)');
          map.setPaintProperty(`${sid}-border`, 'line-color',
            isDark ? 'rgba(74, 158, 255, 0.2)' : 'rgba(0, 102, 204, 0.15)');
          map.setPaintProperty(`${sid}-border`, 'line-width', 1);
        }
      } catch(e) {}
    });
  }

  function resetView() {
    activeZone = null;
    document.querySelectorAll('.zone-btn').forEach(btn => {
      btn.classList.toggle('active', !btn.dataset.zoneId);
    });
    map.flyTo({
      center: [116.4074, 39.9042], zoom: 10.5, pitch: 0, bearing: 0,
      duration: 1200, essential: true
    });
    OPPORTUNITY_ZONES.forEach(z => {
      const sid = `zone-${z.id}`;
      try {
        map.setPaintProperty(`${sid}-fill`, 'fill-color',
          isDark ? 'rgba(74, 158, 255, 0.08)' : 'rgba(0, 102, 204, 0.06)');
        map.setPaintProperty(`${sid}-border`, 'line-color',
          isDark ? 'rgba(74, 158, 255, 0.4)' : 'rgba(0, 102, 204, 0.35)');
        map.setPaintProperty(`${sid}-border`, 'line-width', 2);
      } catch(e) {}
    });
    hidePanel();
  }

  // ========================================
  // Side Panel
  // ========================================
  function showPanel(zone) {
    const html = `
      <div class="animate-in">
        <div class="zone-badge">TOD机遇区</div>
        <h2 class="zone-title">${zone.name}</h2>
        <p class="zone-subtitle">${zone.description}</p>
      </div>
      <div class="panel-section animate-in">
        <div class="panel-section-title">关联轨道线路</div>
        <div class="line-info">
          ${zone.relatedLines.map(l => `
            <div class="line-card">
              <span class="line-badge" style="background:${l.color}">${l.name.replace(/号线.*/, '').replace('线.*','')}</span>
              <div class="line-detail">
                <div class="line-name">${l.name}</div>
                <div class="line-status">${l.status}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="panel-section animate-in">
        <div class="panel-section-title">核心数据</div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">${zone.stats.population}</div><div class="stat-label">常住人口</div></div>
          <div class="stat-card"><div class="stat-value">${zone.stats.commuters}</div><div class="stat-label">日均通勤</div></div>
          <div class="stat-card"><div class="stat-value">${zone.stats.housingDensity}</div><div class="stat-label">住房密度</div></div>
          <div class="stat-card"><div class="stat-value">${zone.stats.avgCommute}</div><div class="stat-label">平均通勤</div></div>
        </div>
      </div>
      <div class="panel-section animate-in">
        <div class="panel-section-title">发展指标</div>
        ${zone.progressData.map(p => `
          <div class="progress-item">
            <div class="progress-label"><span>${p.label}</span><span>${p.value}%</span></div>
            <div class="progress-bar"><div class="progress-fill ${p.type}" data-width="${p.value}"></div></div>
          </div>
        `).join('')}
      </div>
      <div class="panel-section animate-in">
        <div class="panel-section-title">产业基础</div>
        <div class="tag-list">${zone.industries.map(i => `<span class="tag tag-industry">${i}</span>`).join('')}</div>
      </div>
      <div class="panel-section animate-in">
        <div class="panel-section-title">住房供应情况</div>
        <div class="opportunity-list">
          <div class="opportunity-item"><div class="opportunity-icon">📊</div><div class="opportunity-text"><strong>现状：</strong>${zone.housingStatus.current}</div></div>
          <div class="opportunity-item"><div class="opportunity-icon">📋</div><div class="opportunity-text"><strong>供应：</strong>${zone.housingStatus.supply}</div></div>
          <div class="opportunity-item"><div class="opportunity-icon">💡</div><div class="opportunity-text"><strong>机遇：</strong>${zone.housingStatus.opportunity}</div></div>
        </div>
      </div>
      <div class="panel-section animate-in">
        <div class="panel-section-title">优化机会</div>
        <div class="opportunity-list">
          ${zone.opportunities.map(o => `
            <div class="opportunity-item"><div class="opportunity-icon">${o.icon}</div><div class="opportunity-text"><strong>${o.title}：</strong>${o.desc}</div></div>
          `).join('')}
        </div>
      </div>
    `;
    $panelContent.innerHTML = html;
    $sidePanel.classList.add('visible');
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.progress-fill[data-width]').forEach(el => {
          el.style.width = el.dataset.width + '%';
        });
      }, 300);
    });
  }

  function hidePanel() { $sidePanel.classList.remove('visible'); }
  $panelClose.addEventListener('click', () => { resetView(); });

  // ========================================
  // Loading
  // ========================================
  function hideLoading() {
    setTimeout(() => {
      $loading.classList.add('hide');
      map.flyTo({ center: [116.4074, 39.9042], zoom: 10.5, duration: 2000, essential: true });
    }, 800);
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($sidePanel.classList.contains('visible')) resetView();
      $legendPanel.classList.remove('visible');
    }
  });

  // Init
  initMap();
})();
