import Papa from "papaparse";

//all data
const data = ref(null);
//filtered data
const appliedFilters = ref([])
const currentSubset = ref(null);
//deep copy for table sorting
const currentSubsetSortable = ref(null);
//year limits of data
const limits = ref({ year: null });
const filterOptions = ref({ decade: null, asset: null });
const {pagination, paginatedData, setPaginationData} = usePagination()

export function useFilteredData() {

    async function getData() {
        return new Promise((resolve) => {
            Papa.parse("sample.csv", {
                download: true,
                header: true,
                complete: (results) => {
                    data.value = results.data;
                    data.value?.sort((a, b) => {
                        return +a.Year - +b.Year + (+a.Lat - +b.Lat) + (+a.Long - +b.Long);
                    });
                    limits.value.year = [
                        +data.value[0].Year,
                        +data.value[data.value.length - 1].Year,
                    ];
                    filterOptions.value.decade = limits.value.year[0];
                    resolve()
                },
            });
        });
    }

    function filterData() {
        appliedFilters.value = []
        currentSubset.value = data.value.filter((el) => {
            if (
                filterOptions.value.asset &&
                !el["Asset Name"]
                    .toLowerCase()
                    .includes(filterOptions.value.asset.toLowerCase())
            ) {
                return false;
            }
            if (
                filterOptions.value.riskFactor &&
                !el["Risk Factors"]
                    .toLowerCase()
                    .includes(filterOptions.value.riskFactor.toLowerCase())
            ) {
                return false;
            }
            if (
                (filterOptions.value.minLat && el.Lat < filterOptions.value.minLat) ||
                (filterOptions.value.maxLat && el.Lat > filterOptions.value.maxLat)
            ) {
                return false;
            }
            if (
                (filterOptions.value.minLong && el.Lat < filterOptions.value.minLong) ||
                (filterOptions.value.maxLong && el.Lat > filterOptions.value.maxLong)
            ) {
                return false;
            }
            return true;
        });
        //shows user which filters have been applied
        appliedFilters.value = Object.keys(filterOptions.value).filter(f=>{
            if (f==='decade') return false
            return filterOptions.value[f]
        })
        pagination.value.currentPage = 1
    }
    //use this for readonly places (etc map) where sorting is not done
    const computedSubset = computed(() => {
        if (currentSubset.value) {
            return currentSubset.value.filter((el) => {
                if (
                    filterOptions.value.decade &&
                    (+el.Year < filterOptions.value.decade ||
                        +el.Year >= filterOptions.value.decade + 10)
                ) {
                    return false;
                }
                return true;
            });
        }
    });
    watch(currentSubset, (newValue) => {
        currentSubsetSortable.value = JSON.parse(
            JSON.stringify(newValue.filter((el) => {
                if (
                    filterOptions.value.decade &&
                    (+el.Year < filterOptions.value.decade ||
                        +el.Year >= filterOptions.value.decade + 10)
                ) {
                    return false;
                }
                return true;
            }))
        )
        setPaginationData(currentSubsetSortable)
    })
    return {
        limits,
        currentSubset,
        currentSubsetSortable,
        computedSubset,
        filterData,
        filterOptions,
        appliedFilters,
        getData,
        pagination, 
        paginatedData
    };
}
