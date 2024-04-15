import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const [map, setMap] = useState(null);
    const [point1, setPoint1] = useState(null);
    const [point2, setPoint2] = useState(null);
    const [polyline, setPolyline] = useState(null);

    useEffect(() => {
        // Initialize the map
        const mapInstance = L.map('map').setView([32.73184089686569,130.9735107421875], 9);

        // Add OSM tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom:8,
        }).addTo(mapInstance);

        // Set the map instance to state
        setMap(mapInstance);

        // Cleanup function
        return () => {
            // Clean up map instance
            mapInstance.remove();
        };
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    useEffect(() => {
        // Draw polyline when both points are available
        if (point1 && point2 && map) {
            // Remove existing polyline if exists
            if (polyline) {
                map.removeLayer(polyline);
            }

            // Create new polyline
            const newPolyline = L.polyline([point1, point2], { color: 'blue' }).addTo(map);
            setPolyline(newPolyline);
        }
    }, [point1, point2, map]); // Run effect when point1, point2, or map changes

    const handleMapClick = (e) => {
        // Get clicked coordinates
        const points1 = [33.60676407, 130.4182166];
        const points2 = [33.24957161, 130.299816]

        // Update point1 if not set, else update point2
        if (!point1) {
            setPoint1([points1, points2]);
        } else if (!point2) {
            setPoint2([points1, points2]);
        }
    };

    return (
        <div id="map" style={{ height: '600px' }} onClick={handleMapClick}></div>
    );
};

export default MapComponent;
