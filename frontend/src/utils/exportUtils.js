import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// função auxiliar genérica para processar os dados antes de exportar
export const processRowsForExport = (rows, table) => {
  return rows.map((row) => {
    const processedRow = {};

    table
      .getAllColumns()
      .filter((col) => {
        // ignora colunas não visíveis ou marcadas como não exportáveis
        return col.getIsVisible() && col.columnDef.meta?.exportable !== false;
      })
      .forEach((col) => {
        const { header, meta, accessorKey, accessorFn, id } = col.columnDef;
        const columnHeader = typeof header === 'string' ? header : id;

        // prioridade: se tem exportValue no meta, usa ele
        if (meta?.exportValue) {
          processedRow[columnHeader] = meta.exportValue(row.original);
        }
        // se tem accessorKey direto (ex: 'id')
        else if (accessorKey && typeof accessorKey === 'string') {
          // para accessorKeys aninhados como 'entity.Name'
          const keys = accessorKey.split('.');
          let value = row.original;

          for (const key of keys) {
            value = value?.[key];
            if (value === undefined || value === null) break;
          }

          processedRow[columnHeader] = value ?? '';
        }
        // se tem accessorFn (função que computa o valor)
        else if (accessorFn) {
          processedRow[columnHeader] = accessorFn(row.original);
        }
        // fallback: tenta pegar diretamente do original pelo id da coluna
        else {
          processedRow[columnHeader] = row.original[id] ?? '';
        }
      });

    return processedRow;
  });
};

export const exportToCSV = (table, entityName) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const rowsToExport =
    selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

  const dataToExport = processRowsForExport(rowsToExport, table);

  const csv = Papa.unparse(dataToExport, { header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${entityName}-export-${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (table, entityName, sheetName = 'Sheet1') => {
  const selectedRows = table.getSelectedRowModel().rows;
  const rowsToExport =
    selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

  const dataToExport = processRowsForExport(rowsToExport, table);

  if (dataToExport.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const colWidths = [];
  const headers = Object.keys(dataToExport[0] || {});

  headers.forEach((header) => {
    const maxLength = Math.max(
      header.length,
      ...dataToExport.map((row) => String(row[header] || '').length)
    );
    colWidths.push({ wch: Math.min(maxLength + 2, 50) });
  });

  worksheet['!cols'] = colWidths;

  XLSX.writeFile(
    workbook,
    `${entityName}-export-${new Date().toISOString().split('T')[0]}.xlsx`
  );
};

export const exportToJSON = (table, entityName) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const rowsToExport =
    selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

  const dataToExport = processRowsForExport(rowsToExport, table);

  const json = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${entityName}-export-${new Date().toISOString().split('T')[0]}.json`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (table, entityName, pdfTitle = 'Relatório') => {
  const selectedRows = table.getSelectedRowModel().rows;
  const rowsToExport =
    selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

  const dataToExport = processRowsForExport(rowsToExport, table);

  if (dataToExport.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4'); // 'p' = portrait (retrato) | 'l' = landscape (paisagem)

  // título do documento
  doc.setFontSize(16);
  doc.text(pdfTitle, 14, 15);

  // adicionar data de geração
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);

  // extrair headers e dados
  const headers = Object.keys(dataToExport[0] || {});
  const rows = dataToExport.map((row) =>
    headers.map((header) => row[header] || '')
  );

  // gerar tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 28 },
  });

  // download
  doc.save(
    `${entityName}-export-${new Date().toISOString().split('T')[0]}.pdf`
  );
};
