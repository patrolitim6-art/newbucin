// ==================== DATA INSIDEN ====================
const incidents = [
    {
        id: 'INC-901',
        title: 'Batam - Singapore Subsea Cable Cut',
        category: 'fibercut',
        severity: 'p1',
        lat: 1.1301, lng: 104.0529,
        location: 'SKKL Segment 3 (Batam)',
        desc: 'Jalur kabel laut terputus akibat jangkar kapal di KM 14.2.',
        status: 'Splicing in progress',
        time: '10 Mins ago'
    },
    {
        id: 'INC-884',
        title: 'Semarang - Surabaya Backbone Vandalism',
        category: 'fibercut',
        severity: 'p1',
        lat: -6.9667, lng: 110.4167,
        location: 'Kendal Ring 2',
        desc: 'Kabel udara putus total akibat galian tanah proyek pihak ketiga.',
        status: 'Team Alpha en route',
        time: '28 Mins ago'
    },
    {
        id: 'INC-742',
        title: 'Makassar Node Redundancy Power Loss',
        category: 'power',
        severity: 'p2',
        lat: -5.1477, lng: 119.4327,
        location: 'STO Panakkukang',
        desc: 'Genset otomatis mengalami kegagalan pemicu, baterai backup aktif.',
        status: 'Monitoring standby',
        time: '1 Hour ago'
    },
    {
        id: 'INC-611',
        title: 'Manado - Bitung Optical Attenuation',
        category: 'degradation',
        severity: 'p2',
        lat: 1.4748, lng: 124.8428,
        location: 'Ring Sulut Link 4',
        desc: 'Redaman tinggi (+8dB) terdeteksi pada core #12 di OTDR.',
        status: 'Inspection scheduled',
        time: '2 Hours ago'
    },
    {
        id: 'INC-502',
        title: 'Jakarta - Bandung Backbone Repair Complete',
        category: 'restored',
        severity: 'restored',
        lat: -6.2088, lng: 106.8456,
        location: 'Padalarang Segment',
        desc: 'Penyambungan 48 core selesai, kualitas redaman normal (-18 dBm).',
        status: 'RESOLVED',
        time: '4 Hours ago'
    }
];

// ==================== INISIALISASI PETA ====================
let map;
let markersLayer;

function initMap() {
    map = L.map('map', {
        center: [-2.5, 118.0],
        zoom: 5,
        zoomControl: true,
        attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; BUCIN Telin Network Security',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map);

    const cableRoutes = [
        [[1.1301, 104.0529], [-0.5, 105.5], [-6.2088, 106.8456]],
        [[-6.2088, 106.8456], [-6.9667, 110.4167], [-7.2575, 112.7521]],
        [[-7.2575, 112.7521], [-5.1477, 119.4327]],
        [[-5.1477, 119.4327], [0.5, 122.0], [1.4748, 124.8428]]
    ];

    cableRoutes.forEach(route => {
        L.polyline(route, {
            color: '#38bdf8',
            weight: 2,
            opacity: 0.6,
            dashArray: '6, 8'
        }).addTo(map);
    });

    markersLayer = L.layerGroup().addTo(map);
    renderMarkers();

    setTimeout(() => { map.invalidateSize(); }, 500);
}

function getMarkerColor(sev) {
    if (sev === 'p1') return '#f43f5e';
    if (sev === 'p2') return '#f59e0b';
    return '#10b981';
}

function renderMarkers(filter = 'all') {
    if (!markersLayer) return;
    markersLayer.clearLayers();

    incidents.forEach(item => {
        if (filter === 'p1' && item.severity !== 'p1') return;
        if (filter === 'fibercut' && item.category !== 'fibercut') return;
        if (filter === 'restored' && item.severity !== 'restored') return;

        const color = getMarkerColor(item.severity);

        const customIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="
                width: 16px; height: 16px;
                background: ${color};
                border-radius: 50%;
                border: 2.5px solid #ffffff;
                box-shadow: 0 0 12px ${color};
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker([item.lat, item.lng], { icon: customIcon });

        const popupHtml = `
            <div class="popup-content">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> ${item.title}</h3>
                <p><strong>Lokasi:</strong> ${item.location}</p>
                <p>${item.desc}</p>
                <p><strong>Status:</strong> ${item.status}</p>
                <span class="popup-badge ${item.severity === 'p1' ? 'critical' : (item.severity === 'p2' ? 'warning' : 'resolved')}">
                    ${item.severity.toUpperCase()}
                </span>
            </div>
        `;

        marker.bindPopup(popupHtml);
        markersLayer.addLayer(marker);
    });
}

function filterMap(category, btn) {
    document.querySelectorAll('.btn-map').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderMarkers(category);
}

function resetMapView() {
    if (map) map.flyTo([-2.5, 118.0], 5, { duration: 1.2 });
}

// ==================== FEED INSIDEN ====================
function populateFeed() {
    const feedContainer = document.getElementById('feedList');
    if (!feedContainer) return;
    feedContainer.innerHTML = '';

    incidents.forEach(item => {
        const feedCard = document.createElement('div');
        feedCard.className = `feed-item ${item.severity === 'p2' ? 'warning' : (item.severity === 'restored' ? 'resolved' : '')}`;
        feedCard.onclick = () => {
            if (map) {
                map.flyTo([item.lat, item.lng], 9, { duration: 1.2 });
                showToast(`Zooming to ${item.id}: ${item.title}`);
            }
        };

        feedCard.innerHTML = `
            <div class="feed-top">
                <span class="feed-loc">${item.id} • ${item.location}</span>
                <span class="feed-time">${item.time}</span>
            </div>
            <div class="feed-desc">${item.desc}</div>
        `;
        feedContainer.appendChild(feedCard);
    });
}

// ==================== CHART.JS ====================
function initCharts() {
    const ctxCat = document.getElementById('categoryChart');
    if (ctxCat) {
        new Chart(ctxCat.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Fiber Cut', 'Vandalisme', 'Bencana Alam', 'Lainnya'],
                datasets: [{
                    data: [45, 25, 18, 12],
                    backgroundColor: ['#f43f5e', '#10b981', '#38bdf8', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', font: { size: 9 }, boxWidth: 10, padding: 8 }
                    }
                },
                cutout: '70%'
            }
        });
    }

    const ctxTrend = document.getElementById('trendChart');
    if (ctxTrend) {
        new Chart(ctxTrend.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Jumlah Insiden',
                    data: [52, 48, 60, 38, 45, 42],
                    backgroundColor: 'rgba(56, 189, 248, 0.7)',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
}

// ==================== INISIALISASI DASHBOARD ====================
document.addEventListener('DOMContentLoaded', function () {
    initMap();
    populateFeed();
    initCharts();

    setTimeout(() => {
        showToast('AI Anomaly Detected: Redaman +3dB pada Link Makassar-Bitung.');
    }, 3000);
});