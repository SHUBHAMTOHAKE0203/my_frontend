import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Sparkles, Map as MapIcon, Loader } from "lucide-react";

const SkillCentersMap = () => {
  const [location, setLocation] = useState(null);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default icon fix for React-Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  });

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch nearby skill centers using Overpass API
  const fetchNearbyCenters = async () => {
    if (!location) return;
    setLoading(true);
    try {
      // Overpass QL query example: fetch training centers, schools, etc.
      const query = `
        [out:json];
        (
          node["amenity"="Skill Center"](around:5000,${location.lat},${location.lng});
          node["amenity"="school"](around:5000,${location.lat},${location.lng});
          node["amenity"="college"](around:5000,${location.lat},${location.lng});
        );
        out center;
      `;

      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = await resp.json();
      setCenters(data.elements || []);
    } catch (err) {
      console.error("Failed to fetch centers:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (location) fetchNearbyCenters();
  }, [location]);

  if (!location) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mb-6 animate-pulse">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        <p className="text-white text-xl">Fetching your location...</p>
        <p className="text-gray-400 mt-2">Please allow location access</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <MapIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Nearby Skill Centers
          </h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Discover training centers near you
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Your Location</p>
                <p className="font-bold">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Centers Found</p>
                <p className="font-bold">{centers.length} Locations</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : <MapIcon className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-bold">{loading ? "Loading..." : "Ready"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-purple-400" />
              Interactive Map
            </h3>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader className="w-4 h-4 animate-spin" />
                Searching nearby centers...
              </div>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              style={{ height: "600px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* User location marker */}
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>

              {/* Skill centers */}
              {centers.map((c) => (
                <Marker key={c.id} position={[c.lat, c.lon]}>
                  <Popup>
                    {c.tags.name || "Skill Center"} <br />
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Navigate
                    </a>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Centers List */}
        {centers.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Navigation className="w-6 h-6 text-cyan-400" />
              Available Centers ({centers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centers.map((c, idx) => (
                <div
                  key={c.id}
                  className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-lg">{c.tags.name || "Skill Center"}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    📍 {c.lat.toFixed(4)}, {c.lon.toFixed(4)}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && centers.length === 0 && (
          <div className="mt-8 text-center py-12 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No centers found nearby</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search radius</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCentersMap;