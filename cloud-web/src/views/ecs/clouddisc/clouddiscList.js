import PageHeader from '@/components/pageHeader/PageHeader';
import searchBox from '@/components/search/SearchBox';
import ClouddiskTable from './clouddiskTable.vue';

let fields = [{field: 'name', label: '磁盘名称', tagType: 'INPUT'}];

let searchObjExtra = {
    fields: fields,
    selField: fields[0]
};
export default {
    components: {
        PageHeader,
        searchBox,
        ClouddiskTable
    },
    data() {
        return {
            region: '',
            tableData: [],
            searchObjExtra,
            labelQueryData: [],
            fieldValue: '',
            retrievalData: [],
            selectLabelList: [],
            showId: ''
        };
    },
    created() {
        //this.getDiskList();
    },
    methods: {
        refresh() {
            this.$refs.cloudDisk.getDiskList();
        }
    }
};
