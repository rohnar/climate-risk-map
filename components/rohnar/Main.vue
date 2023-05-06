<script setup>
const showChart = useState("showChart", () => {
  false;
});
function toggleMapChart() {
  showChart.value = !showChart.value;
}
const dashboard = ref(null);
const tableHeight = ref(null);
const {
  currentSubset,
  getData,
  filterOptions,
  filterData,
  limits,
  currentSubsetSortable,
  pagination,
} = useFilteredData();
const marks = computed(() => {
  let result = {};
  if (limits.value.year) {
    let year = limits.value.year[0];
    while (year <= limits.value.year[1]) {
      result[year] = {
        label: "" + year,
        style: { color: "black", fontWeight: "bold" },
      };
      year += 10;
    }
  }
  return result;
});

const appliedFilters = computed(()=>{
  return Object.keys(filterOptions.value).filter((f)=>{
    return f !== 'decade' && filterOptions.value[f]
  })
})

function removeFilter(filter) {
  console.log(filter)
  if (filter !== 'decade') {
    delete filterOptions.value[filter]
    filterData()
  }
}

function onResize() {
  tableHeight.value = dashboard.value.offsetHeight - 450;
  console.log("resizing table", tableHeight.value);
}

onMounted(async () => {
  await getData();
  filterData();
  // element ui table does not respect relative sizing, this is a workaround
  await nextTick();
  window.addEventListener("resize", onResize);
  tableHeight.value = dashboard.value.offsetHeight - 450;
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div class="layout" ref="dashboard">
    <RohnarHeader />
    <RohnarMap v-if="currentSubset" class="">
      <template #top>
        <el-slider
          v-if="limits.year"
          :min="limits.year[0]"
          :max="limits.year[1]"
          show-stops
          :step="10"
          :marks="marks"
          @change="filterData"
          v-model="filterOptions.decade"
        >
        </el-slider>
      </template>
    </RohnarMap>
    <div class="filter-bar flex items-center">
          <div
            v-if="filterOptions"
            class="flex items-start w-1/2 gap-0.5rem mx-2"
          >
            <el-tag effect="dark" closable @close="removeFilter(key)" class="w-auto" v-for="key in appliedFilters">
              {{ key.toUpperCase() }}:&nbsp;{{ filterOptions[key] }}
            </el-tag>
            <!-- <div class="w-auto">
          <RohnarButton @click="filterData">Go</RohnarButton>
        </div> -->
          </div>
          <!-- <div>filters</div>
        <div>filters</div> -->
          <div class="flex w-1/2 justify-end" v-if="currentSubsetSortable">
            <div :class="{'active-tab' : !showChart}" class="p-2 tab" @click="showChart ? toggleMapChart() : null">
              <i class="fa fa-table"></i>
              <el-pagination
                :disabled="showChart"
                v-model:current-page="pagination.currentPage"
                :page-size="pagination.pageSize"
                small
                layout="prev, pager, next"
                :total="currentSubsetSortable.length"
              />
            </div>
            <div
              :class="{'active-tab' : showChart}"
              class="flex self-end p-2 tab"
              @click="!showChart ? toggleMapChart() : null"
              v-if="currentSubsetSortable"
              >
              <font-awesome-icon icon="fa-solid fa-line-chart" />
            </div>
          </div>
        </div>
    <div class="table-border">
      <ClimateRiskData
        :headers="[
          'Year',
          'Asset Name',
          'Business Category',
          'Risk Rating',
          'Risk Factors',
        ]"
        :columnWidths="[10, 20, 20, 15, 60]"
        :tableHeight="tableHeight"
        v-if="currentSubset && !showChart"
      >
      </ClimateRiskData>
      <ClimateRiskChart :height="tableHeight" v-else-if="showChart">
      </ClimateRiskChart>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  padding-top: 5px;
  /* background-color: rgba(255, 255, 255, 0.628); */
  /* background-color: #aad3df; */
}
.tab {
  transition: padding 1s;
  color: rgb(91, 90, 90);
  /* background-color: white; */
  width: auto;
  display: flex;
  padding: 5px 20px;
  align-items: center;
  height: 40px;
  border: 1px solid #adadad;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  /* box-shadow: 0 1px 4px; */
}
.tab:not(.active-tab) {
  cursor: pointer;
}
.active-tab {
  transition: padding 1s;
  padding: 0 5rem;
  border: solid 1px black;
  border-bottom: none;
  color: black;
}
.layout {
  /* position: absolute; */
  /* width: 95%; */
  height: 95vh;
  display: grid;
  align-items: start;
  grid-template-columns: 100%;
  grid-template-rows: 5vh auto auto 1fr;
  margin: 5px 1rem;
  justify-content: center;
}
</style>
<style>
.table-border {
  height: 100%;
  justify-content: center;
  border: 2px solid #adadad;
  border-radius: 10px 0 8px 8px;
  /* box-shadow: 0 2px 4px; */
}

</style>
