//put the pagination here in case it needs to be re-used
//similar to adding the pagination/paginatedData to state 

const state = ref(null)

export function usePagination(data) {
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
  });

  function setPaginationData(data) {
    state.value = unref(data)
  }

  const paginatedData = computed(() => {
    const dataLength = state.value?.length || 0;
    if (dataLength > 0) {
      let limit =
        pagination.value.currentPage * pagination.value.pageSize > dataLength
          ? dataLength
          : pagination.value.currentPage * pagination.value.pageSize;
      return state.value.slice(
        (pagination.value.currentPage - 1) * pagination.value.pageSize,
        limit
      );
    }
  });

  return {
    paginatedData,
    pagination,
    setPaginationData
  };
}
