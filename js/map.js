// import mapboxgl from 'mapbox-gl';
import * as d3 from 'https://esm.sh/d3@7.9.0';


mapboxgl.accessToken = 'pk.eyJ1IjoicGppZTE5OTIiLCJhIjoiY21qNXZxc29hMTJxNDNnczhzZmE3cXJrNSJ9.LJ97byi_nyoS-LMS1L4dtw';

        const map = new mapboxgl.Map({
            style: 'mapbox://styles/pjie1992/cmqe4wrx3002101sc1rrz1gye?fresh=true',
            container: 'map',
            center: [56.25, 26.5567],
            zoom: 5,
            pitch: 45,
            bearing: -20,
            minZoom: 1,
            maxZoom: 5,
            cooperativeGestures: true
        });

        const labelLayers = [
            'country-label',
            'state-label',
            'settlement-label',
            'settlement-subdivision-label',
            'settlement-minor-label'
        ];

        const countryLayers = {
            Iran: 'IR',
            Israel: 'IL',
            Ukraine: 'UA'
        }

        const markersByYear = {};
        const markersByCountry = {};
        const jitter = (id) => ((id % 100) / 100 - 0.5) * 0.08;

        window.flyToCountry = flyToCountry;
        window.showYear = showYear;

        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0,0,0,0.75)';
        tooltip.style.color = 'white';
        tooltip.style.fontSize = '11px';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        function showYear(selected) {
            if (map.getLayer('volume-bars')) {
                map.setFilter('volume-bars', ['==', ['get', 'year'], +selected]);
            }
            Object.keys(markersByYear).forEach(year => {
                markersByYear[year].forEach(marker => {
                    if (year === selected) {
                        marker.getElement().style.display = 'block';
                    } else {
                        marker.getElement().style.display = 'none';
                    }
                });
            });
        }

        const countryCenters = {
            Iran: [53.688, 32.4279],
            Israel: [34.8516, 31.0461],
            Ukraine: [31.1656, 48.3794]
        }

        function flyToCountry(country) {
            const center = countryCenters[country];
            if (center) {
                map.flyTo({ center: center, zoom: 5 });
            }
        }


        const mapReady  = new Promise(resolve => map.on('load', resolve));
        const dataReady = d3.csv('data/d3_combined.csv', row => ({
            id:          +row.id,
            name:         row.question,
            year:        +row.year,
            highlight:    row.highlight === 'TRUE' || row.highlight === 'True',
            coordinates: [+row.longitude, +row.latitude],
            volume:    +row.volume,
            conditionId: +row.conditionId

        }));

        Promise.all([mapReady, dataReady]).then(([_, rows]) => {
            // only rows that have coordinates
            const located = rows.filter(d => !isNaN(d.coordinates[0]) && !isNaN(d.coordinates[1]));

            const allLocations = {};
            located.forEach(d => {
                if (!allLocations[d.year]) allLocations[d.year] = [];
                allLocations[d.year].push(d);
            });

            map.addSource('country-boundaries', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1'
            });

            map.addLayer({
                id: 'country-mask',
                type: 'fill',
                source: 'country-boundaries',
                'source-layer': 'country_boundaries',
                filter: [
                    'all',
                    ['!=', ['get', 'iso_3166_1_alpha_3'], 'IRN'],
                    ['!=', ['get', 'iso_3166_1_alpha_3'], 'ISR'],
                    ['!=', ['get', 'iso_3166_1_alpha_3'], 'UKR'],
                    ['!=', ['get', 'iso_3166_1_alpha_3'], 'LBN'],
                    ['!=', ['get', 'iso_3166_1_alpha_3'], 'SYR'],
                    ['!=', ['get', 'iso_3166_1_alpha_3'], 'RUS'],
                    ['any',
                        ['==', 'all', ['get', 'worldview']],
                        ['in', 'US', ['get', 'worldview']]
                    ]
                ],
                paint: {
                    'fill-color': '#000000',
                    'fill-opacity': 0.65
                }
            });

            const maxVol = Math.max(...located.map(d => d.volume || 1));
            const barSize = 0.04;

            map.addSource('bars', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: located.map(d => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [[
                                [d.coordinates[0] - barSize, d.coordinates[1] - barSize],
                                [d.coordinates[0] + barSize, d.coordinates[1] - barSize],
                                [d.coordinates[0] + barSize, d.coordinates[1] + barSize],
                                [d.coordinates[0] - barSize, d.coordinates[1] + barSize],
                                [d.coordinates[0] - barSize, d.coordinates[1] - barSize]
                            ]]
                        },
                        properties: {
                            bar_height: Math.max(1000, Math.sqrt(d.volume / maxVol) * 400000),
                            bar_color: d.highlight ? '#157f3b' : '#e8f6e3',
                            question: d.name,
                            volume: d.volume,
                            year: d.year
                        }


                    }))
                }
            });


            map.on('mousemove', 'volume-bars', (e) => {
                if (e.features.length > 0) {
                    document.body.style.cursor = 'pointer';
                    const p = e.features[0].properties;
                    tooltip.innerHTML = `${p.question}<br><span style="opacity:0.7">Volume: $${Number(p.volume).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.originalEvent.pageX + 10) + 'px';
                    tooltip.style.top  = (e.originalEvent.pageY + 10) + 'px';
                }
            });

            map.on('mouseleave', 'volume-bars', () => {
                document.body.style.cursor = 'default';
                tooltip.style.display = 'none';
            });


//["#f7fcf5","#e8f6e3","#d3eecd","#b7e2b1","#97d494","#73c378","#4daf62","#2f984f","#157f3b","#036429","#00441b"]

            map.addLayer({
                id: 'volume-bars',
                type: 'fill-extrusion',
                source: 'bars',
                paint: {
                    'fill-extrusion-color': ['get', 'bar_color'],
                    'fill-extrusion-height': ['get', 'bar_height'],
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': 1,
                    'fill-extrusion-ambient-occlusion-intensity': 0
                }
            });

            labelLayers.forEach(id => {
                if (map.getLayer(id)) {
                    map.setFilter(id, ['==', ['get', 'iso_3166_1'], 'IR']);
                }
            });

            map.getStyle().layers.forEach(layer => {
                if (layer.type === 'symbol' && !labelLayers.includes(layer.id)) {
                    map.setLayoutProperty(layer.id, 'visibility', 'none');
                }
            });

        });
