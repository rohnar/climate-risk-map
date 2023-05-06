<script setup>
const showChart = useState('showChart')
const {filterOptions, filterData} = useFilteredData()
const businessCategories = [
  'Energy',
  'Finance',
  'Healthcare'
]
function toggleMapChart() {
  showChart.value = !showChart.value
}
//temp place for search terms so that filter options don't show as you are typing
const filterTerms = ref({
  riskFactor: null,
  asset: null,
})
function preFilterData() {
  Object.keys(filterTerms.value).forEach(el=>{
    filterOptions.value[el] = filterTerms.value[el]
  })
  filterData()
}
</script>

<template>
  <div class="flex w-full items-center text-lg my-auto">
    <div class="flex w-full font-bold">
      <span>Asset Explorer</span>
    </div>
    <div class="flex w-full gap-3px text-right justify-end">
      <el-input class="focus:bg-red-200" placeholder="Search for an asset" 
            @keyup.enter="preFilterData" v-model="filterTerms.asset">
            <template #suffix>
              <font-awesome-icon @click="preFilterData" class="hover:text-blue-500 cursor-pointer" icon="fa fa-search"></font-awesome-icon>
            </template>
        </el-input>
      <el-popover trigger="click" width="500px">
        <template #reference>
          <RohnarButton>
            <font-awesome-icon icon="fa fa-filter"></font-awesome-icon>
          </RohnarButton>
        </template>
        <div class="flex flex-col gap-1rem">
          <div class="flex flex-col">
            <small>Risk Factor</small>
            <el-input class="focus:bg-red-200" placeholder="Search for a risk" 
                @keyup.enter="preFilterData" v-model="filterTerms.riskFactor">
                <template #suffix>
                  <font-awesome-icon @click="preFilterData" class="hover:text-blue-500 cursor-pointer" icon="fa fa-search"></font-awesome-icon>
                </template>
            </el-input>
          </div>
          <RohnarButton @click="preFilterData">Apply Filters</RohnarButton>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<style>
</style>