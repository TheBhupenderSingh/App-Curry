// === Chhattisgarh-focused DashboardMap ===
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

let L: any = null;

interface MapDataPoint {
  lat: number;
  lng: number;
  name: string;
  value: number;
  popup?: string;
}

interface DashboardMapProps {
  data: MapDataPoint[];
  title: string;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

export function DashboardMap({ 
  data, 
  title, 
  className, 
  center = [21.2787, 81.8661], // Raipur, Chhattisgarh
  zoom = 7 
}: DashboardMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      L = leaflet.default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      if (!mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      updateMarkers();
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (L && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [data]);

  const updateMarkers = () => {
    if (!L || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    data.forEach((point) => {
      const maxValue = Math.max(...data.map((d) => d.value));
      const normalizedValue = point.value / maxValue;
      const radius = Math.max(5, normalizedValue * 30);

      const marker = L.circleMarker([point.lat, point.lng], {
        radius,
        fillColor: `hsl(217, 91%, ${60 + normalizedValue * 20}%)`,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      });

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${point.name}</h3>
          <p class="text-xs text-gray-600">Value: ${point.value}</p>
          ${point.popup ? `<p class="text-xs">${point.popup}</p>` : ""}
        </div>
      `);

      marker.addTo(map);
    });

    if (data.length > 0) {
      const group = new L.FeatureGroup(
        data.map((point) => L.marker([point.lat, point.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.2));
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg overflow-hidden border"
          style={{ minHeight: "384px" }}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Low values</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span>High values</span>
            </div>
          </div>
          <p className="mt-2">
            Circle size and color intensity represent data values
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// === Chhattisgarh Subdivision Data ===
export const generateSampleMapData = (): MapDataPoint[] => [
  { lat: 21.2514, lng: 81.6296, name: "Raipur Division", value: 12000, popup: "Capital Region" },
  { lat: 21.1904, lng: 81.2849, name: "Durg Division", value: 9000, popup: "Industrial Hub" },
  { lat: 22.0796, lng: 82.1391, name: "Bilaspur Division", value: 8000, popup: "Education Center" },
  { lat: 22.8315, lng: 83.1994, name: "Ambikapur Division", value: 5000, popup: "Forest Region" },
  { lat: 20.7072, lng: 81.5540, name: "Nava Raipur Division", value: 6000, popup: "Planned City" },
  { lat: 23.1357, lng: 82.3360, name: "Korba Subdivision", value: 4000, popup: "Power Hub" },
  { lat: 20.7371, lng: 81.6337, name: "Jagdalpur (Bastar)", value: 4500, popup: "Tribal Region" },
];
