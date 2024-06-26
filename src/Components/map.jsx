import React, { useEffect, useState } from 'react';
import '../Assets/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import L from 'leaflet';
import '../Assets/japan_gyusu.css'
import geojsonData from '../Assets/data/centroid.json';
import shortest_data from '../Assets/data/shortest_path.json'
import blueMarker from '../Assets/pin_blue_50.png';
import redMarker from '../Assets/pin_red_50.png';

const MapComponent = () => {
    const [fromposition, setFromPosition] = useState('');
    const [roadData, setRoadData] = useState(null);
    const [toposition, setToPosition] = useState('');
    let distance = null;

    const centroid_coords = [32.73184089686569,130.9735107421875];
    const customIcon = L.icon({
        iconUrl: blueMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    const SetIcon = L.icon({
        iconUrl: redMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    useEffect(() => {
        setRoadData(shortest_data);
    }, []);
    const handleFromPositionChange = (event) => {
        setFromPosition(event.target.value);
    };
    const shortest_path = shortest_data;
    const handleToPositionChange = (event) => {
        setToPosition(event.target.value);      
    };
    console.log(roadData);
    return (
        <div>
            <MapContainer center={centroid_coords} zoom={9} style={{ height: '950px' }}>
                <div className="search_box_from d-flex">
                    <input 
                        className="form-control border-end-0 border " 
                        type="search" 
                        value={fromposition}
                        onChange={handleFromPositionChange}
                        id="example-search-input"
                        placeholder="出発地"
                    />
                    
                </div>
                <div className="search_box_to d-flex">
                    <input 
                        className="form-control border-end-0 border" 
                        type="search" 
                        value={toposition}
                        onChange={handleToPositionChange}
                        id="example-search-input"
                        placeholder="目的地"
                    />
                    
                </div>
                <TileLayer
                    attribution='© OpenStreetMap contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {geojsonData.features.map((feature, index) => {
                    return (
                        <>
                            <Marker
                                key={index}
                                position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                icon={(toposition === feature.properties.name || toposition === feature.properties.address || 
                                    fromposition === feature.properties.name || fromposition === feature.properties.address) ? SetIcon : customIcon
                                }
                            > 
                                <Popup>
                                    <div>
                                        <h2>{feature.properties.name}</h2>
                                        <p>{feature.properties.address}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </>
                    );
                })}
                {shortest_path.map((data, index) => (
                    (((fromposition === data.from_name || fromposition === data.from_address) &&  
                    (toposition === data.to_name || toposition === data.to_address)) ||
                    ((fromposition === data.to_name || fromposition === data.to_address) &&  
                    (toposition === data.from_name || toposition === data.from_address))) ?
                    data.shortest_path.map((path, pathIndex) => (
                        pathIndex >0 ? (
                            <>
                                <Polyline positions={[[data.shortest_path[pathIndex-1][1], data.shortest_path[pathIndex-1][0]], [path[1], path[0]]]} color="blue" />
                                {distance = data.distance}
                            </>
                            // console.log([data.shortest_path[pathIndex][1], data.shortest_path[pathIndex][0]], [path[1], path[0]])
                        ) : null
                    ))
                    : null
                ))}
                <div className="search_box_distance">
                    <input 
                        className="form-control border-end-0 border distance-box" 
                        type="search" 
                        value={distance}
                        id="example-search-input"
                        placeholder="最短経路"
                        disabled
                    />
                </div>
            </MapContainer>
        </div>
    );
};

export default MapComponent;
