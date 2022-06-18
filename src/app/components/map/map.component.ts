import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../marker.service';
import { ShapeService } from '../../shape.service';
import addressPoints from '../../../assets/data/locations.json';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit  {
  private map!:any;
  private states!:any;

  markerClusterGroup!: L.MarkerClusterGroup;
  markerClusterData = [];
  

  ngOnInit () {
    this.markerClusterGroup = L.markerClusterGroup({removeOutsideVisibleBounds: true});
  }

  private initMap(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.map = L.map('map', {
      center: [ -37.82, 175.24 ],
      zoom: 13,
      layers: [tiles]
    });

    // tiles.addTo(this.map);
  }

  constructor(private markerService: MarkerService, private shapeService: ShapeService) { }

//for shapes
  private highlightFeature(e:any) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 2,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042'
    });
  }
  
  //for shapes
  private resetFeature(e:any) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

  //for cluster
  private initialLayer(){

    for (let i = 0; i < addressPoints.length; i++) {
      console.log('addressPoints[i][2]', addressPoints[i][2]);
          const title = addressPoints[i][2] as any;
          const lat = addressPoints[i][0] as number;
          const lng = addressPoints[i][1] as number;
          const marker = L.marker(new L.LatLng(lat, lng),{title: title.name, icon: iconDefault});
          marker.bindPopup(title.name);
          this.markerClusterGroup.addLayer(marker);
    }
    this.map.addLayer(this.markerClusterGroup);
  }

  //for shapes
  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
        })
      )
    });

    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initialLayer();

    // this.markerService.makeCapitalMarkers(this.map);
    // this.markerService.makeCapitalCircleMarkers(this.map);
    // this.shapeService.getStateShapes().subscribe(states => {
    //   this.states = states;
    //   this.initStatesLayer();
    // });
  }
}