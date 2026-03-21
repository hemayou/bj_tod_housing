// ========================================
// 北京轨道交通TOD+居住机遇区 — App v4.1
// Features: real GeoJSON, micro-centers, layer control,
//   opacity slider, export HD, line labels, enhanced TOD zones,
//   v4: employment data, dynamic POI on zoom
//   v4.1: POI as GeoJSON layers with text labels, zone splits
// ========================================

(function() {
  'use strict';

  let map;
  let activeZone = null;
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

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
    lineLabels: true
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
      map.once('style.load', () => {
        addAllMapLayers();
        if (activeZone) {
          highlightZone(activeZone);
          const zone = OPPORTUNITY_ZONES.find(z => z.id === activeZone);
          if (zone) addPoiMarkers(zone);
        }
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
    bindStationClicks();
    bindMicroCenterClicks();
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
        'circle-stroke-color': isDark ? '#FFCC33' : '#FFB703',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 12, 1.2, 16, 2],
        'circle-stroke-opacity': 0.6, 'circle-opacity': metroOpacity
      }
    });
    map.addLayer({
      id: 'stations-dots', type: 'circle', source: 'stations',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 1, 11, 2, 13, 4, 16, 7],
        'circle-color': ['case', ['==', ['get', 'status'], 'under_construction'],
          isDark ? '#FF6B6B' : '#E63946', isDark ? '#4A9EFF' : '#0066CC'],
        'circle-stroke-color': isDark ? '#161920' : '#FFFFFF',
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
        'text-color': isDark ? '#E8E8E8' : '#1A1A1A',
        'text-halo-color': isDark ? '#161920' : '#FFFFFF',
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
        'circle-color': isDark ? '#4A9EFF' : '#0066CC',
        'circle-stroke-color': isDark ? '#161920' : '#FFFFFF',
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
        'text-color': isDark ? '#E8E8E8' : '#1A1A1A',
        'text-halo-color': isDark ? '#161920' : '#FFFFFF',
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
        'circle-color': isDark ? '#FF6B6B' : '#E63946',
        'circle-stroke-color': isDark ? '#161920' : '#FFFFFF',
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
        'text-color': isDark ? '#FF9999' : '#C0392B',
        'text-halo-color': isDark ? '#161920' : '#FFFFFF',
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
          'text-halo-color': isDark ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
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
          'text-halo-color': isDark ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
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
          'text-halo-color': isDark ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
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
          '枢纽级', isDark ? '#FFD700' : '#D4A017',
          '城市级', isDark ? '#FF8C42' : '#E67E22',
          '区域级', isDark ? '#66BB6A' : '#27AE60',
          '街区级', isDark ? '#90CAF9' : '#5DADE2',
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
          '枢纽级', isDark ? '#FFD700' : '#D4A017',
          '城市级', isDark ? '#FF8C42' : '#E67E22',
          '区域级', isDark ? '#66BB6A' : '#27AE60',
          '街区级', isDark ? '#90CAF9' : '#5DADE2',
          '#888'
        ],
        'circle-opacity': 0.85,
        'circle-stroke-color': isDark ? '#161920' : '#FFFFFF',
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
        'text-color': isDark ? '#BBBBBB' : '#555555',
        'text-halo-color': isDark ? 'rgba(13,15,18,0.85)' : 'rgba(255,255,255,0.85)',
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
          'fill-color': isDark ? 'rgba(255, 100, 50, 0.12)' : 'rgba(230, 57, 70, 0.10)',
          'fill-opacity': 1
        }
      });

      map.addLayer({
        id: `${sourceId}-border`, type: 'line', source: sourceId,
        paint: {
          'line-color': isDark ? '#FF6B4A' : '#E63946',
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
            'text-color': isDark ? '#FF8A70' : '#C0392B',
            'text-halo-color': isDark ? 'rgba(13,15,18,0.9)' : 'rgba(255,255,255,0.9)',
            'text-halo-width': 2.5
          }
        });
      }

      // Interaction
      map.on('click', `${sourceId}-fill`, () => { selectZone(zone.id); });
      map.on('mouseenter', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`${sourceId}-fill`, 'fill-color',
          isDark ? 'rgba(255, 100, 50, 0.22)' : 'rgba(230, 57, 70, 0.18)');
        map.setPaintProperty(`${sourceId}-border`, 'line-width', 4);
      });
      map.on('mouseleave', `${sourceId}-fill`, () => {
        map.getCanvas().style.cursor = '';
        if (activeZone !== zone.id) {
          map.setPaintProperty(`${sourceId}-fill`, 'fill-color',
            isDark ? 'rgba(255, 100, 50, 0.12)' : 'rgba(230, 57, 70, 0.10)');
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
      const color = isDark ? config.darkColor : config.color;

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
          'circle-color': isDark ? '#1a1a2e' : '#ffffff',
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
          'circle-stroke-color': isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
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
          'text-color': isDark ? '#e0e0e0' : '#1a1a2e',
          'text-halo-color': isDark ? 'rgba(20,20,40,0.85)' : 'rgba(255,255,255,0.85)',
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
            isDark ? 'rgba(255, 100, 50, 0.25)' : 'rgba(230, 57, 70, 0.22)');
          map.setPaintProperty(`${sid}-border`, 'line-color',
            isDark ? '#FF5722' : '#C0392B');
          map.setPaintProperty(`${sid}-border`, 'line-width', 4.5);
          map.setPaintProperty(`${sid}-border`, 'line-opacity', 1);
        } else {
          map.setPaintProperty(`${sid}-fill`, 'fill-color',
            isDark ? 'rgba(255, 100, 50, 0.05)' : 'rgba(230, 57, 70, 0.04)');
          map.setPaintProperty(`${sid}-border`, 'line-color',
            isDark ? 'rgba(255, 107, 74, 0.3)' : 'rgba(230, 57, 70, 0.2)');
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
          isDark ? 'rgba(255, 100, 50, 0.12)' : 'rgba(230, 57, 70, 0.10)');
        map.setPaintProperty(`${sid}-border`, 'line-color',
          isDark ? '#FF6B4A' : '#E63946');
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
        const colorVar = isDark ? config.darkColor : config.color;

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
                const colorVar = isDark ? config.darkColor : config.color;
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

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($sidePanel.classList.contains('visible')) resetView();
      $legendPanel.classList.remove('visible');
      $layerPanel.classList.remove('visible');
    }
  });

  // Init
  initMap();
})();
