<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

onMounted(()=>{
    const map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
})

</script>

<template>
    <div id="map"></div>
</template>

<style>
#map {
    height: 180px;
}
</style>
