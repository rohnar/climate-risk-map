<script setup>
import Chart, { plugins } from 'chart.js/auto';
const { currentSubset } = useFilteredData()
const chartCanvas = ref(null)
let myChart;
const limits = ref([+currentSubset.value[0].Year, +currentSubset.value[currentSubset.value.length - 1].Year])
const chartData = computed(()=>{
  if (currentSubset) {
    console.log('updating chart....')
    let lookup = new Map()
    //take advantage of year sorting
    for (let i=0; i<currentSubset.value.length; i++) {
      let currentYear = currentSubset.value[i].Year;
      let newRiskRating = +currentSubset.value[i]['Risk Rating']
      if (lookup.has(currentYear)) {
        let old = lookup.get(currentYear)
        let newAvg = (old.avg*old.count + newRiskRating)/(old.count+1)
        lookup.set(currentYear, {avg: newAvg, count:old.count+1})
      } else {
        lookup.set(currentYear, {avg: newRiskRating, count:1})
      }
    }
    // return data for chart.js
    return {
      datasets: [{
        data: [...lookup].map(x=>x[1].avg)
      }],
      labels: [...lookup].map(x=>x[0])
    }
  }
})
const props = defineProps({
  height: {
    type: Number
  }
})
function renderChart() {
  myChart = new Chart(chartCanvas.value, {
    type: 'line',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      height: props.height,
      plugins: {
        legend: {
          display: false
        },
      }
    },
  });
}
watch(chartData, (newValue)=>{
  myChart.destroy()
  renderChart()
})
onMounted(()=>{
  renderChart()
})



</script>
<template>
  <!-- <pre>{{ chartData }}</pre> -->
  <div class="h-full p-3" >
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
<style>
</style>