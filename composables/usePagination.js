//put the pagination here in case it needs to be re-used
//similar to adding the pagination/paginatedData to state
export function usePagination() {
  const data = useState('currentSubset')
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
  })

  const paginatedData = computed(()=>{
    console.log('computing...')
    let limit = pagination.value.currentPage*pagination.value.pageSize > data.value.length ? data.value.length-1 : pagination.value.currentPage*pagination.value.pageSize - 1;
    return data.value.slice(((pagination.value.currentPage-1)*pagination.value.pageSize), limit)
  })

  return {
    paginatedData,
    pagination
  }
}