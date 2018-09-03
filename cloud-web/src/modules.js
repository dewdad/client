// 全局组件
import PageHeader from '@/components/pageHeader/PageHeader';
import LabelDropdown from '@/components/label/LabelDropdown';
import ZtFormItem from '@/components/ZTForm/src/form-item.vue';
import ZtForm from '@/components/ZTForm/src/form.vue';
import ZtInput from '@/components/ZTInput/index.js';
import ZTSelect from '@/components/ZTSelect/index.js';
import ZTOption from '@/components/ZTSelect/src/option.vue';
import ztDropdown from '@/components/dropdown/index.vue';
import ztDropdownMenu from '@/components/dropdown/menu.vue';
import ztDropdownItem from '@/components/dropdown/item.vue';
import ZTIcon from '@/components/ZTIcon/Index';
import ZtStatus from '@/components/status/ZtStatus.vue';
import ZtScroller from '@/components/scroller/index.vue';
import ZTAffix from '@/components/ZTAffix';
import ZTTable from '@/components/ZTTable';
// import ZTTableColumn from '@/components/ZTTable/src/table-column';
export default {
    'label-dropdown': LabelDropdown,
    'page-header': PageHeader,
    'zt-form-item': ZtFormItem,
    'zt-form': ZtForm,
    'el-input': ZtInput,
    'el-select': ZTSelect,
    'el-option': ZTOption,
    'zt-dropdown': ztDropdown,
    'zt-dropdown-menu': ztDropdownMenu,
    'zt-dropdown-item': ztDropdownItem,
    'zt-icon': ZTIcon,
    'zt-scroller': ZtScroller,
    'zt-affix': ZTAffix,
    'el-table': ZTTable,
    // 'zt-table-column': ZTTableColumn,
    'zt-status': ZtStatus
};
