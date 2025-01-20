import * as XLSX from "xlsx";

const exportDataInExcel = (data: any[], headers: { header: string, field: string }[], fileName: string) => {
    const formattedData = data?.map((item: any) => {
        const row: any = {};
        headers.forEach(header => {
            row[header.header] = item[header.field];
        });
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xls`);
};
export default exportDataInExcel;