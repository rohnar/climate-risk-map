<script setup>
import Papa from "papaparse"

const data = ref();

function getData() {
  Papa.parse('sample.csv', {
    download: true,
    header: true,
    complete: (results) => {
        console.log(results)
        data.value = results.data;
        //placeholder for filtering/pagination
        data.value.splice(0,4980)
    },
  })
}

</script>

<template>
    <div>
        <RohnarHeader />
        <RohnarButton class="m-2" @click="getData">Load</RohnarButton>
        <RohnarMap />
        <RohnarTable v-if="data" :data="data"></RohnarTable>
  </div>
  
</template>

<style>

</style>
