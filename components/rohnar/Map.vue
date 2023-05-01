<script setup>
const currentSubset = useState('currentSubset')
const mapBoundaries = useState('mapBoundaries')
const mapFocus = useState('mapFocus')
const markers = new Map();

import "leaflet/dist/leaflet.css";
import L from "leaflet";

var map;
var layer;

onMounted(()=>{
    if (!map) {
        map = L.map("map",{preferCanvas: true}).setView([45, -76], 5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        mapBoundaries.value = map.getBounds()
        map.on('moveend', function updateBounds() {
            mapBoundaries.value = map.getBounds()
        });
        map.on('click',(e)=>{
            // console.log(e)
            console.log(map.latLngToLayerPoint(e.latlng))
        })
    }

    
})

watch(currentSubset, (newValue, oldValue) => {
    // console.log(map, currentSubset.value.length)
   

    /* if (map) {
        // Check if the coordinates are within the specified range
        if ((filterOptions.value.minLat && el.Lat < filterOptions.value.minLat) || (filterOptions.value.maxLat && el.Lat > filterOptions.value.maxLat)) {
            return false;
        }
    } */

    if (map) {
        //not working
        // console.log('removing old markers')
        markers.forEach((x)=>{
            x.remove()
            markers.delete(map.latLngToLayerPoint(x.getLatLng()))
        })
        // console.log('adding markers')
        let distRef = null;
        let pointRef = null;
        let count = 0;
        let overallCount = 0
        console.log(currentSubset.value.length)
        currentSubset.value.forEach(el=>{
            let markerClass
            //take advantage of the fact that the points are geographically sorted...
            //only add markers for points with far distance when compared to the last
            let latlng = L.latLng(el.Lat, el.Long);
            let point = map.latLngToLayerPoint(latlng)
            let dist;
            if (pointRef) {
                // pointRef = map.latLngToLayerPoint(distRef)
                //get cartesian distance (pythagorean)
                // dist = map.distance(distRef, latlng)
                dist = point.distanceTo(pointRef)
            } else {
                // distRef = latlng
                // pointRef = point
            }
            if (!pointRef || dist >= 20) {
                if (+el['Risk Rating'] < 0.33) {
                    markerClass='marker green'
                } else if (+el['Risk Rating'] < 0.66) {
                    markerClass='marker yellow'
                } else {
                    markerClass='marker red'
                }
                let marker = L.marker([+el.Lat, +el.Long],{
                //   icon: myIcon,
                }).bindTooltip(el['Asset Name']+': '+el['Risk Rating']).addTo(map)
                markers.set(point.toString(), marker)
                pointRef = point
                count = 1
            } else if (pointRef && markers.size>0) {
                let myIcon = L.divIcon({html: `<div>${++count}</div>`, className: 'marker green'});
                markers.get(pointRef.toString()).setIcon(myIcon)
            } else {
                console.log("ROHANNN")
            }
            overallCount++
        })
        console.log(overallCount)
    }
});

watch(mapBoundaries, (newValue, oldValue)=>{
    // console.log(newValue, oldValue)
})
watch(mapFocus, (newValue, oldValue)=>{
    // console.log(newValue, oldValue)
    map.flyTo(L.latLng(newValue[0],newValue[1]))
})

</script>

<template>
    <div id="map">
        <div class="map-tools">
            <slot></slot>
        </div>
    </div>
</template>
<style>
#map .marker {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 1rem;
    border-radius: 20px;
    color: white;
    border: white solid 2px;
    box-shadow: black 2px 2px 3px;
}
#map .marker.green {
    background-color: green;
}
#map .marker.yellow {
    background-color: rgb(191, 156, 0);
}
#map .marker.red {
    background-color: red;
}
</style>
<style scoped>
#map {
    height: 350px;
    z-index: 0;
    /* width: 98%;
    margin: auto; */
}
.map-tools {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0 0 0 15px;
    border: white solid 2px;
    box-shadow: rgba(3, 105, 161) -2px 2px 3px;
    width: 50%;
    padding: 0 30px 20px 30px;
    background-color: rgba(145, 186, 209, 0.547);
    z-index: 410;
}
</style>
