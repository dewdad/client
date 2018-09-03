import PageHeader from '@/components/pageHeader/PageHeader';
import RegionRadio from '@/components/regionRadio/RegionRadio';
import ClouddiskTable from './clouddiskTable.vue';


export default {
    components: {
        PageHeader,
        RegionRadio,
        ClouddiskTable       
    },
    data() {
       
        return {
            region: '',  
            tableData: [],
          
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
        
    }
};
