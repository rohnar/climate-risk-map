<script setup >
import Papa from "papaparse"
const dashboard = ref(null)
const mapDiv = ref(null)
const tableHeight = ref(null);
const data = useState('allData')
const currentSubset = useState('currentSubset')
const limits = ref({year: null})
const marks = computed(()=>{
  let result = {}
  if (limits.value.year) {
    let year = limits.value.year[0]
    while (year <= limits.value.year[1]) {
      result[year] = {label: ''+year, style: {color: 'black', fontWeight: 'bold'}}
      year+=10
    }
  }
  console.log(result)
  return result
})
const filterOptions = ref({
  decade: null,
  minLat: null,
  maxLat: null
});

async function getData() {
  return new Promise(resolve=>{
    Papa.parse('sample.csv', {
      download: true,
      header: true,
      complete: (results) => {
        // console.log(results)
        data.value = results.data;
        data.value?.sort((a,b)=>{
          return (+a.Year - +b.Year) + (+a.Lat - +b.Lat) + (+a.Long - +b.Long)
        })
        console.log(data.value.length)
        limits.value.year = [+data.value[0].Year, +data.value[data.value.length - 1].Year]
        filterOptions.value.decade = limits.value.year[0]
        resolve()
      },
    })
  }) 
}

function clusterData() {

}

function filterData() {
  console.log(filterOptions.value)
  currentSubset.value = data.value.filter((el)=>{
    // Check if the year is within the specified range
    if (filterOptions.value.decade && (+el.Year < filterOptions.value.decade || +el.Year >= filterOptions.value.decade+10)) {
      return false;
    }
    // Check if the coordinates are within the specified range
    if ((filterOptions.value.minLat && el.Lat < filterOptions.value.minLat) || (filterOptions.value.maxLat && el.Lat > filterOptions.value.maxLat)) {
      return false;
    }
    if ((filterOptions.value.minLong && el.Lat < filterOptions.value.minLong) || (filterOptions.value.maxLong && el.Lat > filterOptions.value.maxLong)) {
      return false;
    }
    return true;
  })
  console.log(currentSubset.value.length, data.value.length)
}

onMounted(async ()=>{
  await getData()
  filterData()
  // element ui table does not respect relative sizing, this is a workaround
  await nextTick()
  console.log(dashboard.value.offsetHeight, dashboard)
  tableHeight.value = dashboard.value.offsetHeight - 450

  /* this.$nextTick(()=>{
  }) */
})

</script>

<template>
  <RohnarHeader class="h-[5vh]" />
  <div class="h-[95vh] pb-1rem px-1rem grid grid-template-rows[400px,50px,50px,1fr] items-start" ref="dashboard">
    <RohnarMap v-if="currentSubset?.length > 0" ref="mapDiv">
      <el-slider v-if="limits.year" :min="limits.year[0]" :max="limits.year[1]" 
        show-stops :step="10" :marks="marks"
        @change="filterData"
        v-model="filterOptions.decade">
      </el-slider>
    </RohnarMap>
    <!-- <div class="flex items-center mb-5 mx-auto w-[97%] gap-1rem">
      <el-slider v-if="limits.year" :min="limits.year[0]" :max="limits.year[1]" 
        show-stops :step="10" :marks="marks"
        @change="filterData"
        v-model="filterOptions.decade">
      </el-slider>
    </div> -->
    <ClimateRiskData
      :headers="['Year','Asset Name', 'Business Category', 'Risk Rating', 'Risk Factors']" 
      :columnWidths="[10,20,20,10,60]"
      :tableHeight="tableHeight"
      v-if="currentSubset" 
      :data="currentSubset">
    </ClimateRiskData>
  </div>
</template>

<style>

</style>
