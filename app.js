// ========================================
// 北京TOD+居住+OPC社区机遇区 — App v5.0
// Features: real GeoJSON, micro-centers, layer control,
//   opacity slider, export HD, line labels, enhanced TOD zones,
//   v4: employment data, dynamic POI on zoom
//   v4.1: POI as GeoJSON layers with text labels, zone splits
//   v4.2: POI coordinate fixes, zone boundary adjustments
//   v4.3: Comprehensive POI re-audit (242 POIs verified),
//         basemap switching (vector/satellite/OSM/terrain)
//   v5.0: OPC communities layer, report modal, podcast player
// ========================================

(function() {
  'use strict';

  let map;
  let activeZone = null;
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentBasemap = 'vector';

  // Whether the current basemap has a dark background (affects label colors)
  function isBasemapDark() {
    if (currentBasemap === 'satellite') return true;
    return isDark;
  }

  // Data stores
  let metroLinesData = null;
  let metroStationsData = null;
  let newOperatingLines = null;
  let newOperatingStations = null;
  let ucLinesData = null;
  let ucStationsData = null;
  let microCentersData = null;

  // POI markers on map (DOM markers)
  let currentPoiMarkers = [];

  // Layer visibility state
  const layerVisibility = {
    operating: true,
    underConstruction: true,
    stations: true,
    todZones: true,
    microCenters: true,
    lineLabels: true,
    opcCommunities: true
  };

  // Metro opacity
  let metroOpacity = 0.9;

  // DOM refs
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
  const $layerBtn = document.getElementById('layer-btn');
  const $layerPanel = document.getElementById('layer-panel');
  const $layerPanelClose = document.getElementById('layer-panel-close');
  const $opacitySlider = document.getElementById('opacity-slider');
  const $opacityValue = document.getElementById('opacity-value');
  const $exportBtn = document.getElementById('export-btn');
  const $podcastBtn = document.getElementById('podcast-btn');
  const $podcastModal = document.getElementById('podcast-modal');
  const $podcastClose = document.getElementById('podcast-close');
  const $podcastAudio = document.getElementById('podcast-audio');
  const $opcReportBtn = document.getElementById('opc-report-btn');
  const $opcReportModal = document.getElementById('opc-report-modal');
  const $opcReportClose = document.getElementById('opc-report-close');
  const $opcReportContent = document.getElementById('opc-report-content');

  // ========================================
  // POI config
  // ========================================
  const POI_CONFIG = {
    employment: {
      emoji: '🏢',
      label: '就业空间',
      color: '#3B82F6',
      darkColor: '#60A5FA'
    },
    residential: {
      emoji: '🏘',
      label: '居住区',
      color: '#F59E0B',
      darkColor: '#FBBF24'
    },
    publicSpace: {
      emoji: '🌳',
      label: '公共空间',
      color: '#10B981',
      darkColor: '#34D399'
    },
    publicService: {
      emoji: '🏥',
      label: '公共服务',
      color: '#8B5CF6',
      darkColor: '#A78BFA'
    }
  };

  // ========================================
  // Theme
  // ========================================
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (map) {
      map.setStyle(getMapStyle());
      map.once('styledata', () => {
        setTimeout(() => {
          addAllMapLayers();
          if (activeZone) {
            highlightZone(activeZone);
            const zone = OPPORTUNITY_ZONES.find(z => z.id === activeZone);
            if (zone) addPoiMarkers(zone);
          }
        }, 100);
      });
    }
  }

  // ========================================
  // Basemap Styles
  // ========================================
  function getRasterStyle(tiles, attribution, tileSize) {
    return {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
        'raster-basemap': {
          type: 'raster',
          tiles: tiles,
          tileSize: tileSize || 256,
          attribution: attribution || ''
        }
      },
      layers: [{
        id: 'raster-basemap-layer',
        type: 'raster',
        source: 'raster-basemap',
        minzoom: 0,
        maxzoom: 19
      }]
    };
  }

  function getMapStyle() {
    switch (currentBasemap) {
      case 'satellite':
        return getRasterStyle(
          ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
          256
        );
      case 'osm':
        return getRasterStyle(
          ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          256
        );
      case 'terrain':
        return getRasterStyle(
          ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
          '&copy; <a href="https://www.esri.com/">Esri</a>',
          256
        );
      case 'vector':
      default:
        return isDark
          ? 'https://tiles.openfreemap.org/styles/dark'
          : 'https://tiles.openfreemap.org/styles/positron';
    }
  }

  $themeToggle.addEventListener('click', () => { isDark = !isDark; applyTheme(); });
  applyTheme();

  // ========================================
  // Legend & Layer Panel
  // ========================================
  $legendToggle.addEventListener('click', () => {
    $legendPanel.classList.toggle('visible');
    $layerPanel.classList.remove('visible');
  });
  $legendClose.addEventListener('click', () => { $legendPanel.classList.remove('visible'); });

  if ($layerBtn) {
    $layerBtn.addEventListener('click', () => {
      $layerPanel.classList.toggle('visible');
      $legendPanel.classList.remove('visible');
    });
  }
  if ($layerPanelClose) {
    $layerPanelClose.addEventListener('click', () => { $layerPanel.classList.remove('visible'); });
  }

  // ========================================
  // North Button
  // ========================================
  if ($northBtn) {
    $northBtn.addEventListener('click', () => {
      map.easeTo({ bearing: 0, pitch: 0, duration: 600 });
    });
  }

  // ========================================
  // Opacity Slider
  // ========================================
  if ($opacitySlider) {
    $opacitySlider.addEventListener('input', (e) => {
      metroOpacity = parseFloat(e.target.value);
      if ($opacityValue) $opacityValue.textContent = Math.round(metroOpacity * 100) + '%';
      updateMetroOpacity();
    });
  }

  function updateMetroOpacity() {
    if (!map) return;
    const lineLayerIds = [
      'operating-lines-glow', 'operating-lines-main',
      'new-operating-lines-glow', 'new-operating-lines-main',
      'uc-lines-main', 'uc-lines-glow'
    ];
    lineLayerIds.forEach(id => {
      if (map.getLayer(id)) {
        const baseOp = id.includes('glow') ? 0.12 : (id.includes('uc') ? 0.7 : 0.9);
        map.setPaintProperty(id, 'line-opacity', baseOp * metroOpacity);
      }
    });
    ['stations-dots', 'stations-transfer-ring', 'uc-stations-dots',
     'new-op-stations-dots'].forEach(id => {
      if (map.getLayer(id)) {
        map.setPaintProperty(id, 'circle-opacity', metroOpacity);
        try { map.setPaintProperty(id, 'circle-stroke-opacity', metroOpacity); } catch(e) {}
      }
    });
    ['stations-labels', 'uc-stations-labels', 'new-op-stations-labels'].forEach(id => {
      if (map.getLayer(id)) {
        map.setPaintProperty(id, 'text-opacity', metroOpacity);
      }
    });
  }

  // ========================================
  // Layer Toggle
  // ========================================
  function setupLayerToggles() {
    document.querySelectorAll('.layer-toggle-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const layerKey = e.target.dataset.layer;
        layerVisibility[layerKey] = e.target.checked;
        applyLayerVisibility(layerKey);
      });
    });

    // Basemap switcher
    const basemapGrid = document.getElementById('basemap-grid');
    if (basemapGrid) {
      basemapGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.basemap-btn');
        if (!btn || btn.classList.contains('active')) return;
        const newBasemap = btn.dataset.basemap;
        currentBasemap = newBasemap;

        // Update active state
        basemapGrid.querySelectorAll('.basemap-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Switch map style
        switchBasemap();
      });
    }
  }

  function switchBasemap() {
    if (!map) return;
    const style = getMapStyle();
    map.setStyle(style);
    // Use idle event as fallback — style.load may fire before handler is registered for simple styles
    function onStyleReady() {
      addAllMapLayers();
      if (activeZone) {
        highlightZone(activeZone);
        const zone = OPPORTUNITY_ZONES.find(z => z.id === activeZone);
        if (zone) addPoiMarkers(zone);
      }
    }
    map.once('styledata', () => {
      // Small delay to ensure style is fully processed
      setTimeout(onStyleReady, 100);
    });
  }

  function applyLayerVisibility(layerKey) {
    const vis = layerVisibility[layerKey] ? 'visible' : 'none';
    const layerGroups = {
      operating: ['operating-lines-glow', 'operating-lines-main',
                  'new-operating-lines-glow', 'new-operating-lines-main',
                  'operating-line-labels', 'new-operating-line-labels'],
      underConstruction: ['uc-lines-main', 'uc-lines-glow', 'uc-line-labels',
                          'uc-stations-dots', 'uc-stations-labels'],
      stations: ['stations-dots', 'stations-transfer-ring', 'stations-labels',
                 'new-op-stations-dots', 'new-op-stations-labels'],
      todZones: [],
      microCenters: ['micro-centers-dots', 'micro-centers-labels', 'micro-centers-ring'],
      lineLabels: ['operating-line-labels', 'new-operating-line-labels', 'uc-line-labels']
    };

    const layers = layerGroups[layerKey] || [];
    layers.forEach(id => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', vis);
      }
    });

    if (layerKey === 'opcCommunities') {
      if (typeof OPC_COMMUNITIES !== 'undefined') {
        OPC_COMMUNITIES.forEach(c => {
          const sid = `opc-${c.id}`;
          [`${sid}-pulse`, `${sid}-glow`, `${sid}-fill`, `${sid}-border`, `${sid}-label`].forEach(id => {
            if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis);
          });
        });
      }
      return;
    }

    if (layerKey === 'todZones') {
      OPPORTUNITY_ZONES.forEach(z => {
        const sid = `zone-${z.id}`;
        [`${sid}-fill`, `${sid}-border`, `zone-label-${z.id}-text`].forEach(id => {
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', vis);
          }
        });
      });
      // Also toggle POI GeoJSON layers visibility
      const poiVis = layerVisibility.todZones ? 'visible' : 'none';
      ['employment', 'residential', 'publicSpace', 'publicService'].forEach(cat => {
        ['poi-labels-' + cat, 'poi-circles-' + cat, 'poi-circles-outline-' + cat].forEach(lid => {
          if (map.getLayer(lid)) map.setLayoutProperty(lid, 'visibility', poiVis);
        });
      });
    }
  }

  // ========================================
  // Export HD Image
  // ========================================
  if ($exportBtn) {
    $exportBtn.addEventListener('click', exportMap);
  }

  function exportMap() {
    $exportBtn.classList.add('exporting');
    $exportBtn.disabled = true;
    map.once('render', () => {
      try {
        const canvas = map.getCanvas();
        const link = document.createElement('a');
        link.download = `北京轨道交通TOD居住机遇区_${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch(e) {
        alert('导出失败，请尝试使用浏览器截图功能（Ctrl+Shift+S）');
      }
      $exportBtn.classList.remove('exporting');
      $exportBtn.disabled = false;
    });
    map.triggerRepaint();
  }

  // ========================================
  // Data Loading
  // ========================================
  async function loadData() {
    const [linesResp, stationsResp, newOpLinesResp, newOpStationsResp,
           ucLinesResp, ucStationsResp, microResp] = await Promise.all([
      fetch('metro_lines.json'),
      fetch('metro_stations.json'),
      fetch('new_operating_lines.json'),
      fetch('new_operating_stations.json'),
      fetch('new_uc_lines.json'),
      fetch('new_uc_stations.json'),
      fetch('micro_centers.json')
    ]);
    metroLinesData = await linesResp.json();
    metroStationsData = await stationsResp.json();
    newOperatingLines = await newOpLinesResp.json();
    newOperatingStations = await newOpStationsResp.json();
    ucLinesData = await ucLinesResp.json();
    ucStationsData = await ucStationsResp.json();
    microCentersData = await microResp.json();
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
      attributionControl: false,
      preserveDrawingBuffer: true
    });
    window._map = map; // Debug access

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      addAllMapLayers();
      buildZoneNav();
      setupLayerToggles();
      hideLoading();
    });
  }

  // ========================================
  // Add All Map Layers
  // ========================================
  function addAllMapLayers() {
    if (!metroLinesData) return;

    addOperatingLines();
    addNewOperatingLines();
    addUnderConstructionLines();
    addOperatingStations();
    addNewOperatingStations();
    addUnderConstructionStations();
    addLineLabels();
    addOpportunityZones();
    addMicroCenters();
    addOpcCommunities();
    bindStationClicks();
    bindMicroCenterClicks();
    bindOpcClicks();
  }

  // ---- Operating Lines (citylines.co) ----
  function addOperatingLines() {
    if (map.getSource('operating-lines')) return;
    map.addSource('operating-lines', { type: 'geojson', data: metroLinesData });

    map.addLayer({
      id: 'operating-lines-glow', type: 'line', source: 'operating-lines',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 4, 12, 8, 16, 12],
        'line-opacity': 0.12 * metroOpacity, 'line-blur': 4
      }
    });
    map.addLayer({
      id: 'operating-lines-main', type: 'line', source: 'operating-lines',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 12, 3, 16, 5],
        'line-opacity': 0.9 * metroOpacity
      },
      layout: { 'line-cap': 'round', 'line-join': 'round' }
    });
  }

  // ---- New Operating Lines (18号线) ----
  function addNewOperatingLines() {
    if (!newOperatingLines || map.getSource('new-operating-lines')) return;
    map.addSource('new-operating-lines', { type: 'geojson', data: newOperatingLines });

    map.addLayer({
      id: 'new-operating-lines-glow', type: 'line', source: 'new-operating-lines',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 4, 12, 8, 16, 12],
        'line-opacity': 0.12 * metroOpacity, 'line-blur': 4
      }
    });
    map.addLayer({
      id: 'new-operating-lines-main', type: 'line', source: 'new-operating-lines',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 12, 3, 16, 5],
        'line-opacity': 0.9 * metroOpacity
      },
      layout: { 'line-cap': 'round', 'line-join': 'round' }
    });
  }

  // ---- Under-construction Lines (uploaded) ----
  function addUnderConstructionLines() {
    if (!ucLinesData || map.getSource('uc-lines')) return;
    map.addSource('uc-lines', { type: 'geojson', data: ucLinesData });

    map.addLayer({
      id: 'uc-lines-glow', type: 'line', source: 'uc-lines',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 3, 12, 6, 16, 10],
        'line-opacity': 0.08 * metroOpacity, 'line-blur': 3
      }
    });
    map.addLayer({
      id: 'uc-lines-main', type: 'line', source: 'uc-lines',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 12, 3, 16, 5],
        'line-opacity': 0.7 * metroOpacity,
        'line-dasharray': [3, 2]
      },
      layout: { 'line-cap': 'round', 'line-join': 'round' }
    });
  }

  // ---- Operating Stations (citylines.co) ----
  function addOperatingStations() {
    if (map.getSource('stations')) return;
    map.addSource('stations', { type: 'geojson', data: metroStationsData });

    map.addLayer({
      id: 'stations-transfer-ring', type: 'circle', source: 'stations',
      filter: ['==', ['get', 'transfer'], true],
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 2, 12, 6, 16, 10],
        'circle-color': 'transparent',
        'circle-stroke-color': isBasemapDark() ? '#FFCC33' : '#FFB703',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1.2, 16, 2],
        'circle-stroke-opacity': 0.6, 'circle-opacity': metroOpacity
      }
    });
    map.addLayer({
      id: 'stations-dots', type: 'circle', source: 'stations',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 1, 11, 2, 13, 4, 16, 7],
        'circle-color': ['case', ['==', ['get', 'status'], 'under_construction'],
          isBasemapDark() ? '#FF6B6B' : '#E63946', isBasemapDark() ? '#4A9EFF' : '#0066CC'],
        'circle-stroke-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1, 16, 2],
        'circle-opacity': metroOpacity, 'circle-stroke-opacity': metroOpacity
      }
    });
    map.addLayer({
      id: 'stations-labels', type: 'symbol', source: 'stations', minzoom: 13,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 16, 13],
        'text-offset': [0, 1.2], 'text-anchor': 'top',
        'text-font': ['Noto Sans Regular'],
        'text-optional': true, 'text-allow-overlap': false, 'text-padding': 2
      },
      paint: {
        'text-color': isBasemapDark() ? '#E8E8E8' : '#1A1A1A',
        'text-halo-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'text-halo-width': 1.5, 'text-opacity': metroOpacity
      }
    });
  }

  // ---- New Operating Stations (18号线) ----
  function addNewOperatingStations() {
    if (!newOperatingStations || map.getSource('new-op-stations')) return;
    map.addSource('new-op-stations', { type: 'geojson', data: newOperatingStations });

    map.addLayer({
      id: 'new-op-stations-dots', type: 'circle', source: 'new-op-stations',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 1, 11, 2, 13, 4, 16, 7],
        'circle-color': isBasemapDark() ? '#4A9EFF' : '#0066CC',
        'circle-stroke-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1, 16, 2],
        'circle-opacity': metroOpacity, 'circle-stroke-opacity': metroOpacity
      }
    });
    map.addLayer({
      id: 'new-op-stations-labels', type: 'symbol', source: 'new-op-stations', minzoom: 13,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 13, 9, 16, 13],
        'text-offset': [0, 1.2], 'text-anchor': 'top',
        'text-font': ['Noto Sans Regular'],
        'text-optional': true, 'text-allow-overlap': false, 'text-padding': 2
      },
      paint: {
        'text-color': isBasemapDark() ? '#E8E8E8' : '#1A1A1A',
        'text-halo-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'text-halo-width': 1.5, 'text-opacity': metroOpacity
      }
    });
  }

  // ---- Under-construction Stations ----
  function addUnderConstructionStations() {
    if (!ucStationsData || map.getSource('uc-stations')) return;
    map.addSource('uc-stations', { type: 'geojson', data: ucStationsData });

    map.addLayer({
      id: 'uc-stations-dots', type: 'circle', source: 'uc-stations',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 1, 11, 2, 13, 4, 16, 6],
        'circle-color': isBasemapDark() ? '#FF6B6B' : '#E63946',
        'circle-stroke-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1, 16, 1.5],
        'circle-opacity': metroOpacity * 0.8, 'circle-stroke-opacity': metroOpacity * 0.8
      }
    });
    map.addLayer({
      id: 'uc-stations-labels', type: 'symbol', source: 'uc-stations', minzoom: 13,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 13, 8, 16, 12],
        'text-offset': [0, 1.2], 'text-anchor': 'top',
        'text-font': ['Noto Sans Regular'],
        'text-optional': true, 'text-allow-overlap': false, 'text-padding': 2
      },
      paint: {
        'text-color': isBasemapDark() ? '#FF9999' : '#C0392B',
        'text-halo-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'text-halo-width': 1.5, 'text-opacity': metroOpacity
      }
    });
  }

  // ---- Line Labels (along lines) ----
  function addLineLabels() {
    if (map.getSource('operating-lines') && !map.getLayer('operating-line-labels')) {
      map.addLayer({
        id: 'operating-line-labels', type: 'symbol', source: 'operating-lines',
        minzoom: 10,
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'line'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 10, 9, 14, 12],
          'text-font': ['Noto Sans Regular'],
          'text-max-angle': 30, 'text-padding': 40, 'symbol-spacing': 300,
          'text-allow-overlap': false
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': isBasemapDark() ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
          'text-halo-width': 2, 'text-opacity': metroOpacity * 0.8
        }
      });
    }
    if (map.getSource('new-operating-lines') && !map.getLayer('new-operating-line-labels')) {
      map.addLayer({
        id: 'new-operating-line-labels', type: 'symbol', source: 'new-operating-lines',
        minzoom: 10,
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 10, 9, 14, 12],
          'text-font': ['Noto Sans Regular'],
          'text-max-angle': 30, 'text-padding': 40, 'symbol-spacing': 300,
          'text-allow-overlap': false
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': isBasemapDark() ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
          'text-halo-width': 2, 'text-opacity': metroOpacity * 0.8
        }
      });
    }
    if (map.getSource('uc-lines') && !map.getLayer('uc-line-labels')) {
      map.addLayer({
        id: 'uc-line-labels', type: 'symbol', source: 'uc-lines',
        minzoom: 10,
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 10, 9, 14, 12],
          'text-font': ['Noto Sans Regular'],
          'text-max-angle': 30, 'text-padding': 40, 'symbol-spacing': 250,
          'text-allow-overlap': false
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': isBasemapDark() ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
          'text-halo-width': 2, 'text-opacity': metroOpacity * 0.7
        }
      });
    }
  }

  // ---- Micro Centers ----
  function addMicroCenters() {
    if (!microCentersData || map.getSource('micro-centers')) return;

    const features = microCentersData.map(mc => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [mc.lon, mc.lat] },
      properties: { name: mc.name, grade: mc.grade, district: mc.district, id: mc.id }
    }));
    const geojson = { type: 'FeatureCollection', features };

    map.addSource('micro-centers', { type: 'geojson', data: geojson });

    map.addLayer({
      id: 'micro-centers-ring', type: 'circle', source: 'micro-centers',
      minzoom: 10,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 13, 10, 16, 16],
        'circle-color': 'transparent',
        'circle-stroke-color': ['match', ['get', 'grade'],
          '枢纽级', isBasemapDark() ? '#FFD700' : '#D4A017',
          '城市级', isBasemapDark() ? '#FF8C42' : '#E67E22',
          '区域级', isBasemapDark() ? '#66BB6A' : '#27AE60',
          '街区级', isBasemapDark() ? '#90CAF9' : '#5DADE2',
          '#888'
        ],
        'circle-stroke-width': ['match', ['get', 'grade'],
          '枢纽级', 2.5, '城市级', 2, '区域级', 1.5, '街区级', 1, 1
        ],
        'circle-stroke-opacity': 0.5
      }
    });

    map.addLayer({
      id: 'micro-centers-dots', type: 'circle', source: 'micro-centers',
      minzoom: 10,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'],
          10, ['match', ['get', 'grade'], '枢纽级', 4, '城市级', 3.5, '区域级', 3, '街区级', 2.5, 2.5],
          13, ['match', ['get', 'grade'], '枢纽级', 7, '城市级', 6, '区域级', 5, '街区级', 4, 4],
          16, ['match', ['get', 'grade'], '枢纽级', 11, '城市级', 9, '区域级', 7, '街区级', 6, 6]
        ],
        'circle-color': ['match', ['get', 'grade'],
          '枢纽级', isBasemapDark() ? '#FFD700' : '#D4A017',
          '城市级', isBasemapDark() ? '#FF8C42' : '#E67E22',
          '区域级', isBasemapDark() ? '#66BB6A' : '#27AE60',
          '街区级', isBasemapDark() ? '#90CAF9' : '#5DADE2',
          '#888'
        ],
        'circle-opacity': 0.85,
        'circle-stroke-color': isBasemapDark() ? '#161920' : '#FFFFFF',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 14, 1.5]
      }
    });

    map.addLayer({
      id: 'micro-centers-labels', type: 'symbol', source: 'micro-centers',
      minzoom: 12.5,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 12.5, 8, 16, 12],
        'text-offset': [0, 1.4], 'text-anchor': 'top',
        'text-font': ['Noto Sans Regular'],
        'text-optional': true, 'text-allow-overlap': false, 'text-padding': 4
      },
      paint: {
        'text-color': isBasemapDark() ? '#BBBBBB' : '#555555',
        'text-halo-color': isBasemapDark() ? 'rgba(13,15,18,0.85)' : 'rgba(255,255,255,0.85)',
        'text-halo-width': 1.5
      }
    });
  }

  // ---- Micro Center Click ----
  function bindMicroCenterClicks() {
    if (map._microCenterClickBound) return;
    map._microCenterClickBound = true;

    map.on('click', 'micro-centers-dots', (e) => {
      const props = e.features[0].properties;
      const coords = e.features[0].geometry.coordinates;

      const gradeColors = {
        '枢纽级': '#D4A017', '城市级': '#E67E22', '区域级': '#27AE60', '街区级': '#5DADE2'
      };

      new maplibregl.Popup({ offset: 12, closeButton: true })
        .setLngLat(coords)
        .setHTML(`
          <div class="popup-title">${props.name}</div>
          <span class="popup-line" style="background:${gradeColors[props.grade] || '#888'}">${props.grade}微中心</span>
          <div class="popup-desc">${props.district}</div>
        `)
        .addTo(map);
    });
    map.on('mouseenter', 'micro-centers-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'micro-centers-dots', () => { map.getCanvas().style.cursor = ''; });
  }

  // ---- Station Clicks ----
  function bindStationClicks() {
    if (map._stationClickBound) return;
    map._stationClickBound = true;

    map.on('click', 'stations-dots', (e) => { showStationPopup(e.features[0], 'operating'); });
    map.on('mouseenter', 'stations-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'stations-dots', () => { map.getCanvas().style.cursor = ''; });

    map.on('click', 'new-op-stations-dots', (e) => { showStationPopup(e.features[0], 'operating'); });
    map.on('mouseenter', 'new-op-stations-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'new-op-stations-dots', () => { map.getCanvas().style.cursor = ''; });

    map.on('click', 'uc-stations-dots', (e) => { showStationPopup(e.features[0], 'uc'); });
    map.on('mouseenter', 'uc-stations-dots', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'uc-stations-dots', () => { map.getCanvas().style.cursor = ''; });
  }

  function showStationPopup(feature, stationType) {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;
    let lines;
    try { lines = JSON.parse(props.lines || props.line); } catch(_) {
      lines = [props.lines || props.line || ''];
    }
    if (!Array.isArray(lines)) lines = [lines];

    const linesBadges = lines.map(l =>
      `<span class="popup-line" style="background:${stationType === 'uc' ? '#E63946' : '#0066CC'}">${l}</span>`
    ).join('');

    const statusBadge = (stationType === 'uc' || props.status === 'under_construction' || props.status === '在建')
      ? '<div class="popup-desc" style="color:#E63946">🚧 在建</div>'
      : '';

    new maplibregl.Popup({ offset: 12, closeButton: true })
      .setLngLat(coords)
      .setHTML(`
        <div class="popup-title">${props.name}</div>
        <div>${linesBadges}</div>
        ${props.transfer === true || props.transfer === 'true' ? '<div class="popup-desc">🔄 换乘站</div>' : ''}
        ${statusBadge}
      `)
      .addTo(map);
  }

  // ========================================
  // Opportunity Zones (ENHANCED)
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
        id: `${sourceId}-fill`, type: 'fill', source: sourceId,
        paint: {
          'fill-color': isBasemapDark() ? 'rgba(255, 100, 50, 0.12)' : 'rgba(230, 57, 70, 0.10)',
          'fill-opacity': 1
        }
      });

      map.addLayer({
        id: `${sourceId}-border`, type: 'line', source: sourceId,
        paint: {
          'line-color': isBasemapDark() ? '#FF6B4A' : '#E63946',
          'line-width': 3,
          'line-dasharray': [5, 3],
          'line-opacity': 0.85
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
          id: `${labelSrcId}-text`, type: 'symbol', source: labelSrcId,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 8, 11, 12, 15, 16, 20],
            'text-font': ['Noto Sans Bold'],
            'text-anchor': 'center',
            'text-allow-overlap': true
          },
          paint: {
            'text-color': isBasemapDark() ? '#FF8A70' : '#C0392B',
            'text-halo-color': isBasemapDark() ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
            'text-halo-width': 2.5
          }
        });
      }

      // Interaction
      map.on('click', `${sourceId}-fill`, () => { selectZone(zone.id); });
      map.on('mouseenter', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`${sourceId}-fill`, 'fill-color',
          isBasemapDark() ? 'rgba(255, 100, 50, 0.22)' : 'rgba(230, 57, 70, 0.18)');
        map.setPaintProperty(`${sourceId}-border`, 'line-width', 4);
      });
      map.on('mouseleave', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = '';
        if (activeZone !== zone.id) {
          map.setPaintProperty(`${sourceId}-fill`, 'fill-color',
            isBasemapDark() ? 'rgba(255, 100, 50, 0.12)' : 'rgba(230, 57, 70, 0.10)');
          map.setPaintProperty(`${sourceId}-border`, 'line-width', 3);
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
  // POI Markers (v4.1 — GeoJSON layers)
  // ========================================
  function clearPoiMarkers() {
    // Remove old DOM markers if any
    currentPoiMarkers.forEach(m => m.remove());
    currentPoiMarkers = [];
    // Remove GeoJSON layers & sources
    ['employment', 'residential', 'publicSpace', 'publicService'].forEach(cat => {
      ['poi-labels-' + cat, 'poi-circles-' + cat, 'poi-circles-outline-' + cat].forEach(id => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      if (map.getSource('poi-' + cat)) map.removeSource('poi-' + cat);
    });
    // Remove click popup if any
    if (window._poiPopup) { window._poiPopup.remove(); window._poiPopup = null; }
  }

  function addPoiMarkers(zone) {
    clearPoiMarkers();
    if (!zone.pois) return;

    const categories = ['employment', 'residential', 'publicSpace', 'publicService'];
    categories.forEach(cat => {
      const pois = zone.pois[cat];
      if (!pois || pois.length === 0) return;
      const config = POI_CONFIG[cat];
      const color = isBasemapDark() ? config.darkColor : config.color;

      // Build GeoJSON
      const geojson = {
        type: 'FeatureCollection',
        features: pois.map(poi => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: poi.coords },
          properties: { name: poi.name, desc: poi.desc, category: cat, label: config.label }
        }))
      };

      const srcId = 'poi-' + cat;
      map.addSource(srcId, { type: 'geojson', data: geojson });

      // Outer ring (white/dark border for contrast)
      map.addLayer({
        id: 'poi-circles-outline-' + cat,
        type: 'circle',
        source: srcId,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 7, 14, 10, 16, 14],
          'circle-color': isBasemapDark() ? '#1a1a2e' : '#ffffff',
          'circle-opacity': 0.9,
          'circle-stroke-width': 0,
        }
      });

      // Inner filled circle
      map.addLayer({
        id: 'poi-circles-' + cat,
        type: 'circle',
        source: srcId,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 5, 14, 8, 16, 12],
          'circle-color': color,
          'circle-opacity': 0.92,
          'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 16, 2.5],
          'circle-stroke-color': isBasemapDark() ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
        }
      });

      // Text labels
      map.addLayer({
        id: 'poi-labels-' + cat,
        type: 'symbol',
        source: srcId,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 14, 12, 16, 14],
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'icon-allow-overlap': true,
        },
        paint: {
          'text-color': isBasemapDark() ? '#e0e0e0' : '#1a1a2e',
          'text-halo-color': isBasemapDark() ? 'rgba(20,20,40,0.85)' : 'rgba(255,255,255,0.85)',
          'text-halo-width': 2,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 12.5, 0, 13, 1],
        }
      });

      // Click handler for popup
      map.on('click', 'poi-circles-' + cat, (e) => {
        const feat = e.features[0];
        if (!feat) return;
        const coords = feat.geometry.coordinates.slice();
        const props = feat.properties;
        if (window._poiPopup) window._poiPopup.remove();
        window._poiPopup = new maplibregl.Popup({ offset: 14, closeButton: true, maxWidth: '260px' })
          .setLngLat(coords)
          .setHTML(`
            <div class="popup-title">${props.name}</div>
            <span class="popup-line" style="background:${color}">${props.label}</span>
            <div class="popup-desc">${props.desc}</div>
          `)
          .addTo(map);
      });

      // Cursor pointer on hover
      map.on('mouseenter', 'poi-circles-' + cat, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'poi-circles-' + cat, () => { map.getCanvas().style.cursor = ''; });
    });
  }

  // ========================================
  // OPC Communities (v5.0)
  // ========================================
  let opcPulseAnimFrame = null;

  function addOpcCommunities() {
    if (typeof OPC_COMMUNITIES === 'undefined') return;

    OPC_COMMUNITIES.forEach(comm => {
      const sourceId = `opc-${comm.id}`;
      if (map.getSource(sourceId)) return;

      const circleGeo = createCircle(comm.center, comm.radius, 80);

      // Main source: polygon circle
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [circleGeo] },
          properties: { id: comm.id, name: comm.name }
        }
      });

      // Point source for label + pulse center
      const ptSrcId = `opc-pt-${comm.id}`;
      if (!map.getSource(ptSrcId)) {
        map.addSource(ptSrcId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: comm.center },
            properties: { name: comm.name, status: comm.statusLabel }
          }
        });
      }

      const baseColor = comm.color || '#00D4FF';
      const isActive = comm.status === 'active';

      // Outer pulse ring (animated via circle-radius)
      map.addLayer({
        id: `${sourceId}-pulse`,
        type: 'circle',
        source: ptSrcId,
        paint: {
          'circle-radius': 18,
          'circle-color': 'transparent',
          'circle-stroke-width': 2,
          'circle-stroke-color': baseColor,
          'circle-stroke-opacity': 0.4,
          'circle-opacity': 0
        }
      });

      // Fill layer with tech glow
      map.addLayer({
        id: `${sourceId}-glow`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': baseColor,
          'fill-opacity': isBasemapDark() ? 0.12 : 0.10
        }
      });

      map.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': baseColor,
          'fill-opacity': isBasemapDark() ? 0.18 : 0.14
        }
      });

      // Border — dashed for planned, solid for active
      map.addLayer({
        id: `${sourceId}-border`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': baseColor,
          'line-width': isActive ? 3 : 2.5,
          'line-opacity': isActive ? 1.0 : 0.7,
          'line-dasharray': isActive ? [1, 0] : [4, 3]
        }
      });

      // Label
      map.addLayer({
        id: `${sourceId}-label`,
        type: 'symbol',
        source: ptSrcId,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 10, 12, 13, 16, 17],
          'text-font': ['Noto Sans Bold'],
          'text-anchor': 'center',
          'text-allow-overlap': true
        },
        paint: {
          'text-color': isBasemapDark() ? '#00E5FF' : '#0088CC',
          'text-halo-color': isBasemapDark() ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
          'text-halo-width': 2.5
        }
      });

      // Hover interaction
      map.on('mouseenter', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', isBasemapDark() ? 0.28 : 0.22);
        map.setPaintProperty(`${sourceId}-border`, 'line-width', isActive ? 4 : 3.5);
      });
      map.on('mouseleave', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', isBasemapDark() ? 0.18 : 0.14);
        map.setPaintProperty(`${sourceId}-border`, 'line-width', isActive ? 3 : 2.5);
      });
    });

    // Start pulse animation
    startOpcPulse();
  }

  function startOpcPulse() {
    if (opcPulseAnimFrame) return;
    let phase = 0;
    function animate() {
      phase += 0.02;
      if (phase > 2 * Math.PI) phase -= 2 * Math.PI;
      const pulseRadius = 16 + 8 * Math.sin(phase);
      const pulseOpacity = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(phase));
      if (typeof OPC_COMMUNITIES !== 'undefined') {
        OPC_COMMUNITIES.forEach(c => {
          const layerId = `opc-${c.id}-pulse`;
          if (map.getLayer(layerId)) {
            try {
              map.setPaintProperty(layerId, 'circle-radius', pulseRadius);
              map.setPaintProperty(layerId, 'circle-stroke-opacity', pulseOpacity);
            } catch(e) {}
          }
        });
      }
      opcPulseAnimFrame = requestAnimationFrame(animate);
    }
    animate();
  }

  function bindOpcClicks() {
    if (typeof OPC_COMMUNITIES === 'undefined') return;

    OPC_COMMUNITIES.forEach(comm => {
      const layerId = `opc-${comm.id}-fill`;
      map.on('click', layerId, (e) => {
        e.preventDefault && e.preventDefault();

        const badgeClass = comm.status === 'active' ? 'opc-popup-badge-active' : 'opc-popup-badge-planned';

        const html = `
          <div class="opc-popup">
            <div class="opc-popup-header">
              <span class="opc-popup-badge ${badgeClass}">${comm.statusLabel}</span>
              <span style="font-size:11px;color:var(--color-text-muted)">${comm.subtitle}</span>
            </div>
            <h4>${comm.name}</h4>
            <div class="opc-popup-meta">
              <span>\uD83D\uDE89 ${comm.metroAccess}</span>
              <span>\uD83C\uDFE2 ${comm.area}</span>
              <span>\uD83C\uDFAF ${comm.focus}</span>
            </div>
            <h5>\u2728 \u73B0\u72B6\u7279\u70B9</h5>
            <ul>${comm.currentFeatures.map(f => `<li>${f}</li>`).join('')}</ul>
            <h5>\uD83D\uDE80 \u672A\u6765\u89C4\u5212</h5>
            <ul>${comm.futurePlan.map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
        `;

        new maplibregl.Popup({ offset: 12, closeButton: true, maxWidth: '360px' })
          .setLngLat(comm.center)
          .setHTML(html)
          .addTo(map);
      });
    });
  }

  // ========================================
  // Podcast Floating Player Bar (v5.0)
  // ========================================
  let podcastBarVisible = false;
  let podcastMinimized = false;
  const $podcastMini = document.getElementById('podcast-mini');
  const $podcastMiniToggle = document.getElementById('podcast-mini-toggle');
  const $podcastMiniExpand = document.getElementById('podcast-mini-expand');
  const $podcastMinimize = document.getElementById('podcast-minimize');
  const $podcastBack30 = document.getElementById('podcast-back30');
  const $podcastFwd30 = document.getElementById('podcast-fwd30');

  function showPodcastFull() {
    podcastBarVisible = true;
    podcastMinimized = false;
    if ($podcastModal) $podcastModal.classList.add('visible');
    if ($podcastMini) $podcastMini.classList.remove('visible');
    if ($podcastBtn) $podcastBtn.classList.add('active');
  }

  function showPodcastMini() {
    podcastBarVisible = true;
    podcastMinimized = true;
    if ($podcastModal) $podcastModal.classList.remove('visible');
    if ($podcastMini) {
      $podcastMini.classList.add('visible');
      syncMiniPlayState();
    }
    if ($podcastBtn) $podcastBtn.classList.add('active');
  }

  function hidePodcastAll() {
    podcastBarVisible = false;
    podcastMinimized = false;
    if ($podcastModal) $podcastModal.classList.remove('visible');
    if ($podcastMini) $podcastMini.classList.remove('visible');
    if ($podcastBtn) $podcastBtn.classList.remove('active');
    if ($podcastAudio) $podcastAudio.pause();
  }

  function syncMiniPlayState() {
    if ($podcastMini && $podcastAudio) {
      $podcastMini.classList.toggle('playing', !$podcastAudio.paused);
    }
  }

  // Sync mini pill play/pause icon with audio state
  if ($podcastAudio) {
    $podcastAudio.addEventListener('play', syncMiniPlayState);
    $podcastAudio.addEventListener('pause', syncMiniPlayState);
  }

  // Header button: toggle full player
  if ($podcastBtn) {
    $podcastBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (podcastBarVisible && !podcastMinimized) {
        hidePodcastAll();
      } else if (podcastMinimized) {
        showPodcastFull();
      } else {
        showPodcastFull();
      }
    });
  }

  // Close button: close entirely + stop audio
  if ($podcastClose) {
    $podcastClose.addEventListener('click', () => hidePodcastAll());
  }

  // Minimize button: shrink to pill, keep playing
  if ($podcastMinimize) {
    $podcastMinimize.addEventListener('click', () => showPodcastMini());
  }

  // Mini pill: expand back
  if ($podcastMiniExpand) {
    $podcastMiniExpand.addEventListener('click', () => showPodcastFull());
  }

  // Mini pill: play/pause toggle
  if ($podcastMiniToggle) {
    $podcastMiniToggle.addEventListener('click', () => {
      if ($podcastAudio) {
        if ($podcastAudio.paused) $podcastAudio.play();
        else $podcastAudio.pause();
      }
    });
  }

  // Skip ±30s
  if ($podcastBack30) {
    $podcastBack30.addEventListener('click', () => {
      if ($podcastAudio) $podcastAudio.currentTime = Math.max(0, $podcastAudio.currentTime - 30);
    });
  }
  if ($podcastFwd30) {
    $podcastFwd30.addEventListener('click', () => {
      if ($podcastAudio) $podcastAudio.currentTime = Math.min($podcastAudio.duration || 0, $podcastAudio.currentTime + 30);
    });
  }

  // ========================================
  // OPC Report Modal (v5.0)
  // ========================================
  function getReportHTML() {
    return `
      <h1>\u5317\u4eacTOD+\u5c45\u4f4f\u673a\u9047\u533a\uFF1aOPC\u793e\u7fa4\u805a\u96c6\u6f5c\u529b\u5206\u6790</h1>
      <p class="report-subtitle">\u57FA\u4e8e\u4ea7\u4e1a\u94fe\u5B8C\u6574\u6027\u3001OPC\u4EBA\u624D\u5BC6\u5EA6\u3001\u804C\u4F4F\u6DF7\u5408\u7A0B\u5EA6\u3001\u73B0\u6709\u57FA\u7840\u8BBE\u65BD\u548C\u653F\u7B56\u652F\u6301\u7684\u7EFC\u5408\u8BC4\u4F30</p>

      <h2>\u4E00\u3001\u6267\u884C\u6458\u8981</h2>
      <p>\u5317\u4EAC\u6B63\u5728\u5174\u8D77\u7684OPC\uFF08\u4E00\u4EBA\u516C\u53F8\uFF09\u751F\u6001\u4E0ETOD\u5C45\u4F4F\u673A\u9047\u533A\u7684\u53E0\u5408\uFF0C\u521B\u9020\u4E86\u4E00\u79CD\u65B0\u578B\u57CE\u5E02\u521B\u65B0\u573A\u666F\uFF1A\u4F9D\u6258\u8F68\u9053\u4EA4\u901A\u5E26\u6765\u7684\u9AD8\u4EBA\u6D41\u5BC6\u5EA6\u548C\u804C\u4F4F\u6DF7\u5408\u7279\u6027\uFF0C\u5728\u7279\u5B9A\u5C45\u4F4F\u673A\u9047\u533A\u4E2D\u690D\u5165\u4F4E\u95E8\u69DB\u3001\u9AD8\u9891\u7387\u3001\u591A\u5BF9\u591A\u7684OPC\u793E\u7FA4\u7A7A\u95F4\uFF0C\u6709\u671B\u5F62\u6210\u8D85\u51FA\u4F20\u7EDF\u5B75\u5316\u5668\u548C\u8054\u5408\u529E\u516C\u7684\u5168\u65B0\u5546\u4E1A\u793E\u4EA4\u57FA\u7840\u8BBE\u65BD\u3002\u672C\u62A5\u544A\u8BC6\u522B\u51FA\u4E94\u7C7B\u6700\u5177\u6F5C\u529B\u7684\u673A\u9047\u533A\uFF0C\u5E76\u63D0\u51FA\u7A7A\u95F4\u8FD0\u8425\u7B56\u7565\u6846\u67B6\u3002</p>

      <h2>\u4E8C\u3001\u5317\u4EACOPC\u751F\u6001\u73B0\u72B6</h2>
      <p>\u4ECE2025\u5E74\u5E95\u81F32026\u5E74\u521D\uFF0C\u5317\u4EAC\u7387\u5148\u5728\u4E09\u5904\u5F62\u6210\u5B9E\u4F53OPC\u793E\u533A\uFF0C\u521D\u6B65\u9A8C\u8BC1\u4E86\u8D85\u7EA7\u4E2A\u4F53\u7684\u805A\u96C6\u9700\u6C42\u3002</p>

      <div class="report-card">
        <h4>\u6D77\u6DC0\u4E0A\u5730\u00B7\u4E2D\u5173\u6751AI\u5317\u7EAC\u793E\u533A</h4>
        <p class="card-meta">2025\u5E7412\u6708\u53D1\u5E03 \u2022 \u5317\u4EAC\u9996\u4E2AAI OPC\u670D\u52A1\u8BA1\u5212</p>
        <p>\u4E0A\u5730\u8857\u90532.3\u4E07\u5BB6\u4F01\u4E1A\u3001\u5BC6\u5EA6\u8D852000\u5BB6/km\u00B2\uFF0C800\u33A1\u5171\u4EAB\u670D\u52A1\u7A7A\u95F4\uFF08\u4F1A\u8BAE\u5BA4\u3001\u8336\u6C34\u95F4\u3001\u9910\u996E\u5427\uFF09\u548C\u5B75\u5316\u52A0\u901F\u8D44\u6E90\u3002</p>
      </div>
      <div class="report-card">
        <h4>\u4EA6\u5E84\u00B7\u6A21\u6570OPC\u793E\u533A</h4>
        <p class="card-meta">\u5317\u4EAC\u76EE\u524D\u89C4\u6A21\u6700\u5927 \u2022 \u9996\u671F3000\u33A1 / \u8FDC\u671F1\u4E07\u33A1</p>
        <p>\u901A\u660E\u6E56\u4FE1\u606F\u57CE\uFF0C\u62E5\u6709\u64AD\u5BA2\u5F55\u97F3\u68DA\u3001\u7EFF\u5E55\u6444\u5F71\u68DA\u3001\u5C0F\u578B\u8DEF\u6F14\u5385\u3001\u786C\u4EF6\u5C55\u793A\u533A\uFF0C\u9996\u627920\u4F59\u5BB6OPC\u5DF2\u843D\u5730\u3002</p>
      </div>
      <div class="report-card">
        <h4>\u671D\u9633\u00B7\u6781\u5BA2\u90E8\u843DAI\u5E94\u7528\u751F\u6001\u56ED</h4>
        <p class="card-meta">2026\u5E742\u6708\u4EAE\u76F8ITEC \u2022 \u671D\u9633\u533A\u9996\u4E2AOPC\u793E\u533A</p>
        <p>\u8BBE\u6709\u201C\u9752\u5E74\u4EBA\u624D\u4F1A\u5BA2\u5385\u201D\uFF0C\u805A\u7126\u6295\u878D\u8D44\u5BF9\u63A5\u3001\u573A\u666F\u9700\u6C42\u6D4B\u8BD5\u3001\u5546\u673A\u5BF9\u63A5\u7B49\u8D85\u7EA7\u4E2A\u4F53\u6838\u5FC3\u9700\u6C42\u3002</p>
      </div>

      <h2>\u4E09\u3001OPC\u6838\u5FC3\u9700\u6C42\u6E05\u5355</h2>
      <table class="report-table">
        <thead><tr><th>\u9700\u6C42\u7C7B\u578B</th><th>\u63CF\u8FF0</th><th>\u7A7A\u95F4\u5BF9\u5E94</th></tr></thead>
        <tbody>
          <tr><td>\u4FE1\u4EFB\u5EFA\u7ACB</td><td>OPC\u4E4B\u95F4\u9700\u53CD\u590D\u63A5\u89E6\u624D\u80FD\u5F62\u6210\u5408\u4F5C</td><td>\u9AD8\u9891\u6D3B\u52A8\u3001\u56FA\u5B9A\u805A\u96C6\u573A\u6240</td></tr>
          <tr><td>\u9009\u62E9\u6027\u66DD\u5149</td><td>IP\u4FE1\u606F\u4E0D\u5B9C\u5B8C\u5168\u7EBF\u4E0A\u516C\u5F00\uFF0C\u9700\u201C\u5BF9\u7684\u4EBA\u201D\u73B0\u573A\u63A5\u6536</td><td>\u975E\u6B63\u5F0F\u5C55\u793A\u533A\u3001\u60C5\u5883\u5C55\u89C8</td></tr>
          <tr><td>\u591A\u5BF9\u591A\u6D3D\u8C08</td><td>1v1\u5496\u5561\u5385\u65E0\u6CD5\u652F\u6301\u5708\u5C42\u6DF7\u63A5</td><td>\u5171\u4EAB\u5927\u684C\u3001\u5403\u559D\u505C\u7559\u533A</td></tr>
          <tr><td>\u5782\u7C7B\u8D44\u6E90\u5BF9\u63A5</td><td>\u6295\u8D44\u4EBA\u3001\u884C\u4E1A\u52A8\u5411\u3001\u4E0A\u4E0B\u6E38\u91C7\u8D2D/\u4F9B\u5E94</td><td>\u5B9A\u671F\u6512\u5C40\u6D3B\u52A8</td></tr>
          <tr><td>\u5F71\u97F3\u5448\u73B0\u5DE5\u5177</td><td>Demo\u5C55\u793A\u3001\u5185\u5BB9\u51FA\u7247\u9700\u8981\u8BBE\u5907</td><td>\u5F71\u97F3\u8BBE\u5907\u3001\u7EFF\u5E55\u3001\u5F55\u64AD\u95F4</td></tr>
          <tr><td>\u5F39\u6027\u79DF\u8D41</td><td>\u524D\u671F\u65E0\u529B\u627F\u62C5\u56FA\u5B9A\u6210\u672C</td><td>\u5206\u65F6\u5171\u4EAB\u3001\u7EDF\u4E00\u8FD0\u8425</td></tr>
        </tbody>
      </table>

      <h2>\u56DB\u3001\u4E94\u5927OPC\u6F5C\u529B\u805A\u96C6\u533A</h2>

      <div class="report-card">
        <h4>\u2776 \u6D77\u6DC0\u4E0A\u5730\u2013\u5317\u4E94\u73AF\u5916 <span class="report-stars">\u2605\u2605\u2605\u2605\u2605</span></h4>
        <p class="card-meta">16\u53F7\u7EBF\u4E0A\u5730\u7AD9 \u2022 AI\u6280\u672F\u5F00\u53D1 \u00B7 AIGC\u5185\u5BB9 \u00B7 \u6570\u5B57\u8425\u9500</p>
        <p>\u5168\u5E02\u5DF2\u843D\u5730\u6700\u6210\u719F\u7684OPC\u53CB\u597D\u8857\u533A\u3002AI Agent/Prompt\u5DE5\u7A0B \u2192 AIGC\u5185\u5BB9\u751F\u4EA7 \u2192 \u6570\u5B57\u8425\u9500 \u2192 SaaS\u53D8\u73B0\u5168\u4EA7\u4E1A\u94FE\u3002</p>
      </div>
      <div class="report-card">
        <h4>\u2777 \u671D\u9633\u9152\u4ED9\u6865\u2013\u5C06\u53F0 <span class="report-stars">\u2605\u2605\u2605\u2605\u2606</span></h4>
        <p class="card-meta">14\u53F7\u7EBF\u5C06\u53F0\u7AD9 \u2022 \u5185\u5BB9\u521B\u610F \u00B7 \u54C1\u724C\u8BBE\u8BA1 \u00B7 \u4F20\u5A92\u79D1\u6280</p>
        <p>\u7D27\u90BB798/751\uFF0C\u77ED\u89C6\u9891/\u64AD\u5BA2 \u2192 \u54C1\u724C\u8BBE\u8BA1 \u2192 \u5E7F\u544A\u6295\u653E \u2192 \u827A\u672FIP\u5B75\u5316\u4EA7\u4E1A\u94FE\u3002\u7ADE\u4E89\u76F8\u5BF9\u6E29\u548C\u4F46\u6F5C\u529B\u660E\u786E\u3002</p>
      </div>
      <div class="report-card">
        <h4>\u2778 \u4EA6\u5E84\u901A\u660E\u6E56 <span class="report-stars">\u2605\u2605\u2605\u2605\u2606</span></h4>
        <p class="card-meta">\u4EA6\u5E84\u7EBF \u2022 AI\u786C\u4EF6 \u00B7 \u5DE5\u4E1AAI \u00B7 \u533B\u836F\u6570\u636E</p>
        <p>\u5317\u4EAC\u89C4\u6A21\u6700\u5927OPC\u4E13\u5C5E\u793E\u533A\uFF0C\u4F9D\u6258\u533B\u836F\u5065\u5EB7\u3001\u5177\u8EAB\u667A\u80FD\u3001\u5DE5\u4E1A\u5236\u9020\u6570\u636E\u573A\u666F\u3002</p>
      </div>
      <div class="report-card">
        <h4>\u2779 \u901A\u5DDE\u5F20\u5BB6\u6E7E\u8BBE\u8BA1\u5C0F\u9547 <span class="report-stars">\u2605\u2605\u2605\u2606\u2606</span></h4>
        <p class="card-meta">\u89C4\u5212M102\u7EBF \u2022 \u5DE5\u4E1A\u8BBE\u8BA1 \u00B7 \u54C1\u724C\u89C6\u89C9 \u00B7 \u6587\u521BIP</p>
        <p>\u5DF2\u5F15\u8FDB440\u4F59\u5BB6\u8BBE\u8BA1/\u79D1\u6280\u7C7B\u4F01\u4E1A\uFF0C\u5317\u4EAC\u56FD\u9645\u8BBE\u8BA1\u5468\u6C38\u4E45\u4F1A\u5740\uFF0C\u7A7A\u767D\u673A\u4F1A\u663E\u8457\u3002</p>
      </div>
      <div class="report-card">
        <h4>\u277A \u4E30\u53F0\u79D1\u6280\u56ED <span class="report-stars">\u2605\u2605\u2605\u2606\u2606</span></h4>
        <p class="card-meta">9\u53F7\u7EBF\u4E30\u53F0\u79D1\u6280\u56ED\u7AD9 \u2022 AI+\u884C\u4E1A\u5E94\u7528</p>
        <p>\u6BD7\u90BB\u4E3D\u6CFD\u91D1\u878D\u5546\u52A1\u533A\uFF0C\u591A\u8F68\u9053\u4EA4\u6C47\uFF0C\u4E3AOPC\u63D0\u4F9B\u6295\u8D44\u4EBA\u53EF\u8FBE\u6027\u3002</p>
      </div>

      <h2>\u4E94\u3001\u7A7A\u95F4\u8FD0\u8425\u6A21\u5F0F\u5EFA\u8BAE</h2>
      <table class="report-table">
        <thead><tr><th>\u7A7A\u95F4\u6A21\u5757</th><th>\u529F\u80FD</th><th>\u8FD0\u8425\u903B\u8F91</th></tr></thead>
        <tbody>
          <tr><td>\u5403\u559D\u505C\u7559\u533A\uFF0830%\uFF09</td><td>\u9910\u996E/\u5496\u5561\u5427\u53F0/\u4F11\u95F2\u533A</td><td>\u81EA\u7136\u5F15\u6D41\uFF0C\u63D0\u5347\u505C\u7559\u65F6\u957F\uFF0C\u89E6\u53D1\u968F\u673A\u63A5\u89E6</td></tr>
          <tr><td>\u5C55\u793A\u5899/Demo\u53F0\uFF0820%\uFF09</td><td>\u4F5C\u54C1\u5C55\u793A\u3001IP\u66DD\u5149\u3001\u4EA7\u54C1\u8BD5\u7528</td><td>\u975E\u6B63\u5F0F\u3001\u514D\u9884\u7EA6\u3001\u6EDA\u52A8\u66F4\u65B0\uFF0COPC\u81EA\u52A9\u4E0A\u67B6</td></tr>
          <tr><td>\u5F71\u97F3\u534F\u4F5C\u533A\uFF0820%\uFF09</td><td>\u6295\u5F71\u5927\u5C4F\u3001\u5F55\u64AD\u8BBE\u5907\u3001\u6536\u97F3\u5957\u4EF6</td><td>\u65F6\u95F4\u79DF\u7528\uFF0C\u652F\u6301\u5C0F\u578B\u8DEF\u6F14/\u5F55\u89C6\u9891/\u4EA7\u54C1\u5C55\u793A</td></tr>
          <tr><td>\u591A\u4EBA\u5706\u684C\u533A\uFF0820%\uFF09</td><td>4-12\u4EBA\u5373\u5174\u6D3D\u8C08</td><td>\u65E0\u9700\u9884\u8BA2\uFF0C\u5750\u6EE1\u5F00\u59CB\uFF0COPC\u968F\u673A\u7EC4\u5408</td></tr>
          <tr><td>\u540E\u53F0\u5C0F\u578B\u5DE5\u4F4D\uFF0810%\uFF09</td><td>\u4E34\u65F6\u843D\u811A\u70B9</td><td>\u5F39\u6027\u65E5\u79DF\uFF0C\u4E0D\u5F3A\u8C03\u201C\u529E\u516C\u5BA4\u611F\u201D</td></tr>
        </tbody>
      </table>

      <h2>\u516D\u3001\u5173\u952E\u6210\u529F\u8981\u7D20\u77E9\u9635</h2>
      <table class="report-table">
        <thead><tr><th>\u8981\u7D20</th><th>\u6D77\u6DC0\u4E0A\u5730</th><th>\u671D\u9633\u9152\u4ED9\u6865</th><th>\u4EA6\u5E84\u901A\u660E\u6E56</th><th>\u5F20\u5BB6\u6E7E</th><th>\u4E30\u53F0\u79D1\u6280\u56ED</th></tr></thead>
        <tbody>
          <tr><td>\u5782\u7C7B\u4EA7\u4E1A\u94FE</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2605</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td></tr>
          <tr><td>OPC\u5BC6\u5EA6</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2605</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td></tr>
          <tr><td>\u653F\u7B56\u652F\u6301</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2605</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2605</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td></tr>
          <tr><td>\u8F68\u9053\u53EF\u8FBE\u6027</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2605</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td></tr>
          <tr><td>\u751F\u6D3B\u914D\u5957</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2605</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2606\u2606</td><td class="report-stars">\u2605\u2605\u2605\u2605\u2606</td></tr>
          <tr><td>\u7A7A\u95F4\u7ADE\u4E89</td><td>\u8F83\u5927</td><td>\u4E2D\u7B49</td><td>\u8F83\u5927</td><td>\u8F83\u5C0F\uFF08\u7A7A\u767D\uFF09</td><td>\u4E2D\u7B49</td></tr>
        </tbody>
      </table>

      <h2>\u4E03\u3001\u884C\u52A8\u5EFA\u8BAE</h2>
      <div class="report-card">
        <h4>\uD83C\uDFAF \u6700\u4F18\u5165\u5C40\u533A\u57DF</h4>
        <p>\u671D\u9633\u5317\u5E72\u00B7\u9152\u4ED9\u6865\u2013\u5C06\u53F0\u673A\u9047\u533A\u662F\u7ADE\u4E89\u76F8\u5BF9\u6E29\u548C\u4F46\u6F5C\u529B\u660E\u786E\u7684\u9009\u62E9\u2014\u2014\u6781\u5BA2\u90E8\u843D\u521A\u8D77\u6B65\uFF0C\u5185\u5BB9\u521B\u610FOPC\u5BC6\u5EA6\u9AD8\uFF0C798/751\u6587\u5316\u6C1B\u56F4\u4E0E\u201C\u975E\u6B63\u5F0F\u3001\u6709\u5C55\u793A\u3001\u6709\u5403\u559D\u7684\u793E\u7FA4\u7A7A\u95F4\u201D\u8BBE\u60F3\u9AD8\u5EA6\u5951\u5408\u3002</p>
      </div>
      <div class="report-card">
        <h4>\uD83D\uDCA1 \u7A7A\u95F4\u7B56\u7565\u6838\u5FC3\u539F\u5219</h4>
        <ul>
          <li>\u4E0D\u8981\u590D\u5236\u201C\u5B75\u5316\u5668\u201D\uFF0C\u8981\u505A\u201C\u6709\u4EA7\u4E1A\u6E29\u5EA6\u7684\u793E\u533A\u636E\u70B9\u201D</li>
          <li>\u8FD0\u8425\u65B9\u662F\u6838\u5FC3\u7ADE\u4E89\u529B\uFF0C\u4E0D\u662F\u7A7A\u95F4\u672C\u8EAB\uFF1B\u201C\u6512\u5BF9\u7684\u5C40\u201D\u662F\u6838\u5FC3\u4EA7\u54C1</li>
          <li>\u201C\u5206\u65F6\u5171\u4EAB+\u6D3B\u52A8\u5165\u4F1A\u201D\u53CC\u7EBF\u6536\u5165\u6A21\u578B\u964D\u4F4E\u95E8\u69DB</li>
          <li>\u5EFA\u7ACB\u201C\u4FE1\u606F\u5206\u5C42\u201D\u673A\u5236\uFF0C\u8BA9\u73B0\u573A\u6210\u4E3A\u4E0D\u53EF\u66FF\u4EE3\u7684\u201C\u4FE1\u606F\u89E3\u9501\u573A\u666F\u201D</li>
        </ul>
      </div>

      <p style="margin-top:24px;font-size:12px;color:var(--color-text-faint);">\u6570\u636E\u6765\u6E90\uFF1A\u65B0\u534E\u7F51\u3001\u8BC1\u5238\u65E5\u62A5\u3001\u5317\u4EAC\u6D77\u6DC0\u533A\u4EBA\u6C11\u653F\u5E9C\u7F51\u7AD9\u3001\u5317\u4EAC\u671D\u9633\u533A\u79D1\u6280\u56ED\u7BA1\u7406\u59D4\u5458\u4F1A\u3001\u7EF4\u57FA\u767E\u79D1\u7B49\u3002</p>
    `;
  }

  if ($opcReportBtn) {
    $opcReportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if ($opcReportContent && !$opcReportContent.innerHTML.trim()) {
        $opcReportContent.innerHTML = getReportHTML();
      }
      if ($opcReportModal) $opcReportModal.classList.add('visible');
    });
  }
  if ($opcReportClose) {
    $opcReportClose.addEventListener('click', (e) => {
      e.stopPropagation();
      if ($opcReportModal) $opcReportModal.classList.remove('visible');
    });
  }
  if ($opcReportModal) {
    $opcReportModal.addEventListener('click', (e) => {
      if (e.target === $opcReportModal) {
        $opcReportModal.classList.remove('visible');
      }
    });
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
      center: zone.center, zoom: 14, pitch: 30, bearing: -10,
      duration: 1500, essential: true
    });

    highlightZone(zoneId);
    showPanel(zone);
    addPoiMarkers(zone);
    $legendPanel.classList.remove('visible');
    $layerPanel.classList.remove('visible');
  }

  function highlightZone(zoneId) {
    OPPORTUNITY_ZONES.forEach(z => {
      const sid = `zone-${z.id}`;
      try {
        if (z.id === zoneId) {
          map.setPaintProperty(`${sid}-fill`, 'fill-color',
            isBasemapDark() ? 'rgba(255, 100, 50, 0.25)' : 'rgba(230, 57, 70, 0.22)');
          map.setPaintProperty(`${sid}-border`, 'line-color',
            isBasemapDark() ? '#FF5722' : '#C0392B');
          map.setPaintProperty(`${sid}-border`, 'line-width', 4.5);
          map.setPaintProperty(`${sid}-border`, 'line-opacity', 1);
        } else {
          map.setPaintProperty(`${sid}-fill`, 'fill-color',
            isBasemapDark() ? 'rgba(255, 100, 50, 0.05)' : 'rgba(230, 57, 70, 0.04)');
          map.setPaintProperty(`${sid}-border`, 'line-color',
            isBasemapDark() ? 'rgba(255, 107, 74, 0.3)' : 'rgba(230, 57, 70, 0.2)');
          map.setPaintProperty(`${sid}-border`, 'line-width', 2);
          map.setPaintProperty(`${sid}-border`, 'line-opacity', 0.6);
        }
      } catch(e) {}
    });
  }

  function resetView() {
    activeZone = null;
    clearPoiMarkers();
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
          isBasemapDark() ? 'rgba(255, 100, 50, 0.12)' : 'rgba(230, 57, 70, 0.10)');
        map.setPaintProperty(`${sid}-border`, 'line-color',
          isBasemapDark() ? '#FF6B4A' : '#E63946');
        map.setPaintProperty(`${sid}-border`, 'line-width', 3);
        map.setPaintProperty(`${sid}-border`, 'line-opacity', 0.85);
      } catch(e) {}
    });
    hidePanel();
  }

  // ========================================
  // Side Panel (v4 — with jobs + POI)
  // ========================================
  function showPanel(zone) {
    // Build POI section HTML
    let poiSectionHtml = '';
    if (zone.pois) {
      const categories = ['employment', 'residential', 'publicSpace', 'publicService'];
      let poiItems = '';
      categories.forEach(cat => {
        const pois = zone.pois[cat];
        if (!pois || pois.length === 0) return;
        const config = POI_CONFIG[cat];
        const colorVar = isBasemapDark() ? config.darkColor : config.color;

        poiItems += `<div class="poi-category">
          <div class="poi-category-header">
            <span class="poi-category-dot" style="background:${colorVar}"></span>
            <span class="poi-category-name">${config.emoji} ${config.label}</span>
            <span class="poi-category-count">${pois.length}个</span>
          </div>
          <div class="poi-category-list">
            ${pois.map(p => `
              <div class="poi-list-item" data-lng="${p.coords[0]}" data-lat="${p.coords[1]}">
                <div class="poi-list-name">${p.name}</div>
                <div class="poi-list-desc">${p.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>`;
      });

      if (poiItems) {
        poiSectionHtml = `
          <div class="panel-section animate-in">
            <div class="panel-section-title">区域要素分布</div>
            <div class="poi-legend-mini">
              ${categories.map(cat => {
                const config = POI_CONFIG[cat];
                const colorVar = isBasemapDark() ? config.darkColor : config.color;
                return `<span class="poi-legend-item"><span class="poi-legend-dot" style="background:${colorVar}"></span>${config.label}</span>`;
              }).join('')}
            </div>
            ${poiItems}
          </div>
        `;
      }
    }

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
          ${zone.stats.jobs ? `<div class="stat-card stat-card-jobs"><div class="stat-value stat-value-jobs">${zone.stats.jobs}</div><div class="stat-label">就业岗位</div></div>` : ''}
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
      ${poiSectionHtml}
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

    // Animate progress bars
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.progress-fill[data-width]').forEach(el => {
          el.style.width = el.dataset.width + '%';
        });
      }, 300);
    });

    // POI item click → fly to location
    document.querySelectorAll('.poi-list-item[data-lng]').forEach(item => {
      item.addEventListener('click', () => {
        const lng = parseFloat(item.dataset.lng);
        const lat = parseFloat(item.dataset.lat);
        map.flyTo({ center: [lng, lat], zoom: 15.5, duration: 800 });
      });
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

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      if ($opcReportModal && $opcReportModal.classList.contains('visible')) {
        $opcReportModal.classList.remove('visible');
        return;
      }
      if (podcastBarVisible) {
        hidePodcastAll();
        return;
      }
      if ($sidePanel.classList.contains('visible')) resetView();
      $legendPanel.classList.remove('visible');
      $layerPanel.classList.remove('visible');
    }

    // J/K: cycle through zone nav buttons
    if (e.key === 'j' || e.key === 'J' || e.key === 'k' || e.key === 'K') {
      const btns = Array.from(document.querySelectorAll('.zone-btn'));
      if (!btns.length) return;
      const currentIdx = btns.findIndex(b => b.classList.contains('active'));
      let nextIdx;
      if (e.key === 'j' || e.key === 'J') {
        nextIdx = currentIdx <= 0 ? btns.length - 1 : currentIdx - 1;
      } else {
        nextIdx = currentIdx >= btns.length - 1 ? 0 : currentIdx + 1;
      }
      btns[nextIdx].click();
      btns[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });

  // Init
  initMap();
})();
