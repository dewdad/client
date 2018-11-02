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
import ZtTable from '@/components/table/ZtTable';
import DeleteDailog from '@/components/dialog/DeleteDailog';
import ConfirmDialog from '@/components/dialog/Dialog';
// import ZTTableColumn from '@/components/ZTTable/src/table-column';
import ZtColItem from '@/components/table/ZtColItem.vue';
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
    'zt-table': ZtTable,
    // 'zt-table-column': ZTTableColumn,
    'zt-status': ZtStatus,
    'delete-dialog': DeleteDailog,
    'zt-col-item': ZtColItem,
    'confirm-dialog': ConfirmDialog
};
