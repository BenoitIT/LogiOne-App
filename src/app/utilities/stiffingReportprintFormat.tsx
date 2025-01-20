export const generateTableHTML = (data: any[], headers: any[], totals: any) => {
  const headerRow =
    `<th>No</th>` +
    headers?.map((header) => `<th>${header.header}</th>`).join("");

  const rows = data
    .map(
      (row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${row.delivery || "-"}</td>
        <td>${row.shipperId || "-"}</td>
        <td>${row.consigneeId || "-"}</td>
        <td>${row.phone || "-"}</td>
        <td>${row.code || "-"}</td>
        <td>${row.mark || ""}</td>
        <td>${row.salesAgent || "-"}</td>
        <td>${row.noOfPkgs || "-"}</td>
        <td>${row.weight || "-"}</td>
        <td>${row.line || "-"}</td>
        <td>${row.handling || "-"}</td>
        <td>${row.cbm || "-"}</td>
        <td>${row.description || "-"}</td>
        <td>${row.freight || "-"}</td>
        <td>${row.blFee || "-"}</td>
        <td>${row.jb || "-"}</td>
        <td>${row.carHanging || "-"}</td>
        <td>${row.recovery || "-"}</td>
        <td>${row.insurance || "-"}</td>
        <td>${row.inspection || "-"}</td>
        <td>${row.localCharges || "-"}</td>
        <td>${row.totalUsd || "-"}</td>
        <td>${row.totalAed || "-"}</td>
        <td>${row.invoiceNo || "-"}</td>
      </tr>
    `
    )
    .join("");

  const totalsRow = `
      <tr class="totals-row">
        <td colspan="8">Total</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.noOfPkgs) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.weight) || ""}</td>
        <td>${totals.line || ""}</td>
        <td>${totals.handling || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.cbm) || ""}</td>
        <td></td>
        <td>${Intl.NumberFormat("en-Us").format(totals.freight) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.blFee) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.jb) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.carHanging) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.recovery) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.insurance) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.inspection) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.localCharges) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.totalUsd) || ""}</td>
        <td>${Intl.NumberFormat("en-Us").format(totals.totalAed) || ""}</td>
      </tr>
    `;

  return `
      <table>
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${rows}
          ${totalsRow}
        </tbody>
      </table>
    `;
};

export const printStyles = `
<style>
  @media print {
    @page {
      size: landscape;
      margin: 15mm;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.3;
      padding: 0;
      margin: 0;
    }
    .header-info {
      margin-bottom: 20px;
    }
    .header-info p {
      margin: 5px 0;
      font-size: 14px;
    }
    .report-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: left;
      font-size: 11px;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    .totals-row {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .status-closed {
      color: #dc3545;
    }
    .status-generated {
      color: #28a745;
    }
  }
</style>
`;
