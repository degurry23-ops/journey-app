import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import L from 'leaflet'

const DAY_COLORS = ['#2D6A4F','#457B9D','#E07A5F','#8B5CF6','#F59E0B','#EC4899','#06B6D4'];

export default function MapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const trip = trips.find(t => t.id === id);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    if (!trip || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current).setView([35.6762, 139.6503], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(mapInstance.current);
  }, [trip]);

  useEffect(() => {
    if (!mapInstance.current || !trip?.days) return;
    const map = mapInstance.current;
    // Clear old markers
    map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });

    const allCoords = [];
    const daysToShow = activeDay !== null ? [trip.days[activeDay]] : trip.days;

    daysToShow.forEach((day, di) => {
      const idx = activeDay !== null ? activeDay : di;
      const color = DAY_COLORS[idx % DAY_COLORS.length];
      const dayCoords = [];

      day.places?.forEach(p => {
        if (p.lat && p.lng) {
          const coord = [p.lat, p.lng];
          dayCoords.push(coord);
          allCoords.push(coord);
          L.circleMarker(coord, {
            radius: 8, fillColor: color, color: '#fff', weight: 2,
            fillOpacity: 0.9,
          }).bindPopup(`<b>${p.name}</b><br/>Day ${idx+1} · ${p.time || ''}`).addTo(map);
        }
      });

      if (dayCoords.length > 1) {
        L.polyline(dayCoords, { color, weight: 3, opacity: 0.7, dashArray:'8 4' }).addTo(map);
      }
    });

    if (allCoords.length > 0) {
      map.fitBounds(allCoords, { padding: [40, 40] });
    }
  }, [trip, activeDay]);

  if (!trip) return <div className="p-8 text-center text-gray-400">旅行不存在</div>;

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-400 text-sm">← 返回</button>
          <h1 className="font-semibold text-[#2C3E50]">地图模式</h1>
          <button onClick={() => navigate(`/trip/${trip.id}/day/${trip.days[0]?.id}`)}
            className="text-sm text-[#2D6A4F]">📋 Timeline</button>
        </div>
      </div>

      {/* Day filter chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        <button onClick={() => setActiveDay(null)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${activeDay === null ? 'bg-[#2D6A4F] text-white' : 'bg-white text-gray-500'}`}>
          全部
        </button>
        {trip.days?.map((d, i) => (
          <button key={d.id} onClick={() => setActiveDay(i)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${activeDay === i ? 'bg-[#2D6A4F] text-white' : 'bg-white text-gray-500'}`}>
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{background:DAY_COLORS[i % DAY_COLORS.length]}} />
            Day {i+1}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden shadow-sm">
        <div ref={mapRef} style={{ width:'100%', height:'100%', minHeight:'400px' }} />
      </div>
    </div>
  );
}
