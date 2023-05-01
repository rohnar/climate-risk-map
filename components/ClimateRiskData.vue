<script setup>
const props = defineProps({
    data: Array,
    headers: Array,
    columnWidths: Array,
    tableHeight: Number
})
const mapFocus = useState('mapFocus')
const { pagination, paginatedData } = usePagination()
const showHeaders = props.headers ? ref(props.headers) : Object.keys(props.data[0])
function updateGoTo(lat, long) {
  mapFocus.value=[+lat,+long]
}
</script>

<template>
  <div class="p-2 flex gap-1rem justify-end">
    <span class="risk-factor-item bg-cyan-700 text-white">Filters TBD</span>
    <!-- <div>filters</div>
    <div>filters</div> -->
    <el-pagination v-model:current-page="pagination.currentPage" :page-size="pagination.pageSize" small layout="prev, pager, next" :total="data.length" />
  </div>
<el-table size="small" :data="paginatedData" :height="'100%'" class="mb-2" border>
  <el-table-column lable="" min-width="5">
    <template #default="scope">
      <div>
          <RohnarButton type="text" @click="updateGoTo(scope.row.Lat, scope.row.Long)"><i class="fa fa-location-dot"></i></RohnarButton>
      </div>
    </template>
  </el-table-column>
  <el-table-column v-for="(col, index) in showHeaders" :prop="col" :label="col" :min-width="columnWidths && columnWidths[index] ? columnWidths[index] : undefined">
    <template #default="scope">
      <div v-if="col==='Risk Factors'" class="risk-factor">
        <div v-for="item in Object.keys(JSON.parse((scope.row['Risk Factors'])))">
          <div class="risk-factor-item" :class="[
          JSON.parse((scope.row['Risk Factors']))[item] > 0.66 ? 'bg-red-600 text-white' : 
          (JSON.parse((scope.row['Risk Factors']))[item] > 0.33 ? 'bg-yellow-600 text-white' : 'bg-gray-300')]" v-if="JSON.parse((scope.row['Risk Factors']))[item]">{{ item }}: {{ Math.round(JSON.parse((scope.row['Risk Factors']))[item]*100)/100 }}
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
