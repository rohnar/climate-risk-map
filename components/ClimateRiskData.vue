<script setup>
const props = defineProps({
  data: Array,
  headers: Array,
  columnWidths: Array,
  tableHeight: Number,
});
const mapFocus = useState("mapFocus");
const { currentSubsetSortable, paginatedData } = useFilteredData();
// //update deep copy when filtered data changes
const showHeaders = props.headers
  ? ref(props.headers)
  : Object.keys(props.data[0]);
function updateGoTo(lat, long) {
  mapFocus.value = [+lat, +long];
}
function sortData(event) {
  let orderFactor = event.order === "descending" ? -1 : 1;
  if (event.prop === "Risk Rating") {
    currentSubsetSortable.value.sort((a, b) => {
      return (a[event.prop] - b[event.prop]) * orderFactor;
    });
  } else if (event.prop === "Risk Factors") {
    currentSubsetSortable.value.sort((a, b) => {
      return (a[event.prop].length - b[event.prop].length) * orderFactor;
    });
  } else {
    currentSubsetSortable.value.sort((a, b) => {
      if (a[event.prop] < b[event.prop]) {
        return -1 * orderFactor;
      }
      if (a[event.prop] > b[event.prop]) {
        return orderFactor;
      }
      return 0;
    });
  }
}
</script>

<template>
  <el-table
    @sort-change="sortData"
    size="small"
    :data="paginatedData"
    :height="tableHeight"
    class="mb-2"
  >
    <el-table-column lable="" min-width="5">
      <template #default="scope">
        <div class="flex justify-center">
          <RohnarButton
            type="text"
            @click="updateGoTo(scope.row.Lat, scope.row.Long)"
            ><i class="fa fa-location-dot"></i
          ></RohnarButton>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      :sortable="col !== 'Year'"
      v-for="(col, index) in showHeaders"
      :prop="col"
      :label="col"
      :min-width="
        columnWidths && columnWidths[index] ? columnWidths[index] : undefined
      "
    >
      <template #default="scope">
        <div v-if="col === 'Risk Factors'" class="risk-factor">
          <div
            v-for="item in Object.keys(JSON.parse(scope.row['Risk Factors']))"
          >
            <div
              class="risk-factor-item"
              :class="[
                JSON.parse(scope.row['Risk Factors'])[item] > 0.66
                  ? 'bg-red-600 text-white'
                  : JSON.parse(scope.row['Risk Factors'])[item] > 0.33
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-300',
              ]"
              v-if="JSON.parse(scope.row['Risk Factors'])[item]"
            >
              {{ item }}:
              {{
                Math.round(JSON.parse(scope.row["Risk Factors"])[item] * 100) /
                100
              }}
            </div>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style>
.risk-factor {
  font-size: 11px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  /* padding: 0 1px; */
}
.risk-factor-item {
  border-radius: 20px;
  padding: 2px 9px;
}
</style>
<style scoped>

</style>
