<script setup>
const currentSubset = useState('currentSubset')
const mapBoundaries = useState('mapBoundaries')
const mapFocus = useState('mapFocus')
const markers = ref([]);

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
        markers.value.forEach((x)=>{
            x.remove()
        })
        markers.value = []
        // console.log('adding markers')
        currentSubset.value.forEach(el=>{
            let markerClass
            if (+el['Risk Rating'] < 0.33) {
                markerClass='green-marker'
            } else if (+el['Risk Rating'] < 0.66) {
                markerClass='yellow-marker'
            } else {
                markerClass='red-marker'
            }
            var myIcon = L.divIcon({className: markerClass});
            let marker = L.marker([+el.Lat, +el.Long],{
                icon: myIcon,
            }).bindTooltip(el['Asset Name']+': '+el['Risk Rating']).addTo(map)
            markers.value.push(marker)
        })
        // console.log(markers.value.length)
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
    <div id="map"></div>
</template>

<style>
#map {
    height: 400px;
    /* width: 98%;
    margin: auto; */
}
.green-marker {
    height: 100px;
    width: 100px;
    background-color: rgb(47, 255, 92);
}
.yellow-marker {
    height: 100px;
    width: 100px;
    background-color: yellow;
}
.red-marker {
    height: 100px;
    width: 100px;
    background-color: red;
}
</style>
