import FileSaver from 'file-saver';
import XLSX from 'xlsx';

/**
 * 导出 Excel
 * @param {*} el dom选择器
 * @param {*} name 保存文件名称
 */
export const exportExcel = ({el = '.el-table', name = 'sheetjs'} = {}) => {
    let dom = document.querySelector(el);
    if (!el) {
        throw new Error(el + '，未找到');
    }
    /* generate workbook object from table */
    let wb = XLSX.utils.table_to_book(dom);
    /* get binary string as output */
    let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
    });
    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), `${name}.xlsx`);
    return wbout;
};
