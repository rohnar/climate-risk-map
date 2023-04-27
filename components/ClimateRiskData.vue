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
  <div >
    <el-pagination v-model:current-page="pagination.currentPage" :page-size="pagination.pageSize" small layout="prev, pager, next" :total="data.length" />
  </div>
<el-table size="small" :data="paginatedData" :height="'100%'" class="mb-2" border>
  <el-table-column lable="" min-width="5">
    <template #default="scope">
      <div>
          <RohnarButton type="text" @click="updateGoTo(scope.row.Lat, scope.row.Long)">G</RohnarButton>
      </div>
    </template>
  </el-table-column>
  <el-table-column v-for="(col, index) in showHeaders" :prop="col" :label="col" :min-width="columnWidths && columnWidths[index] ? columnWidths[index] : undefined">
    <template #default="scope">
      <div v-if="col==='Risk Factors'" class="flex flex-wrap gap-6px">
        <span class="p-2 rounded-2xl bg-teal-600 text-xs text-white" v-for="item in Object.keys(JSON.parse((scope.row['Risk Factors'])))">
          {{ item }}: {{ Math.round(JSON.parse((scope.row['Risk Factors']))[item]*100)/100 }}
        </span>
      </div>
    </template>
  </el-table-column>
</el-table>
</template>

<style>
</style>
