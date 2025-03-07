import { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css"
import icon from 'leaflet/dist/images/marker-icon.png';

import { FrontVar } from '../components/FrontBar';
import { Container, Row } from 'react-bootstrap';
import { LayersControl, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from "leaflet";
import { SearchForm } from '../components/SearchForm';
import axios from 'axios';

const marker = L.icon({
  iconUrl: icon,
});

function ChangeView({ center }: { center: any}) {
  const map = useMap();
  map.setView(center);
  return null;
}

export const Home = () => {
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([35.6812, 139.7671]); // デフォルト値は東京
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([35.6812, 139.7671]); // マーカー位置用の状態

  const path = "https://msearch.gsi.go.jp/address-search/AddressSearch?q=";
  const [paramAddress1, setParamAddress1] = useState("");

  const changeParamAddress1 = (event: any) =>  {
    setParamAddress1(event.target.value);
  };

  const clearParam = () => {
    setParamAddress1("");
    setMarkerPosition(currentPosition); // クリア時は現在位置に戻す
  };

  const searchParam = () => {
    if (paramAddress1.length === 0) {
      return null;
    }

    axios.get(path + paramAddress1).then((res) => {
      const lat = res.data[0].geometry.coordinates[1];
      const lng = res.data[0].geometry.coordinates[0];
      setMarkerPosition([lat, lng]);
      console.log(lat, lng);
    });
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setCurrentPosition(pos);
          setMarkerPosition(pos); // 現在位置取得時にマーカー位置も更新
        },
        () => {
          // エラーの場合はデフォルトの位置（東京）のまま
        }
      );
    }
    // Geolocationが利用できない場合はデフォルトの位置のまま
  }, []);

  const mapStyle= {
    height: "75vh"
  };

  return (
    <div className="home">
      <Container>
        <Row>
          <FrontVar />
        </Row>
        <Row>
          <SearchForm 
            paramAddress1={paramAddress1}
            changeParamAddress1={changeParamAddress1}
            clear={clearParam}
            search={searchParam}
          />
        </Row>
        <Row>
          <MapContainer
            id={"map"}
            center={markerPosition} // マーカー位置を中心に表示
            zoom={13}
            scrollWheelZoom={true}
            style={mapStyle}
          >
            <ChangeView center={markerPosition}/> {/* マーカー位置に視点を移動 */}
            <Marker position={markerPosition} icon={marker} />
            <LayersControl>
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="国土地理院タイル">
                <TileLayer
                  attribution='&copy; <a target="_blank" href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                  url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="国土地理院淡色地図">
                <TileLayer
                  attribution='&copy; <a target="_blank" href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                  url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="国土地理院写真">
                <TileLayer
                  attribution='&copy; <a target="_blank" href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
                  url="https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="洪水浸水想定区域（想定最大規模）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="洪水浸水想定区域（計画規模（現在の凡例）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="浸水継続時間（想定最大規模）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="家屋倒壊等氾濫想定区域（氾濫流）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_hanran_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="家屋倒壊家屋倒壊等氾濫想定区域（河岸侵食）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_kagan_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="高潮浸水想定区域">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="津波浸水想定">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="土砂災害警戒区域（土石流）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="土砂災害警戒区域（急傾斜地の崩壊）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="土砂災害警戒区域（地すべり）">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="土石流危険渓流">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="急傾斜地崩壊危険箇所">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_kyukeisyachihoukai/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="地すべり危険箇所">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_jisuberikikenkasyo/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="雪崩危険箇所">
                <TileLayer 
                  attribution='&copy; <a target="_blank" href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a> contributors'
                  url="https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </Row>
      </Container>
    </div>
  )
};