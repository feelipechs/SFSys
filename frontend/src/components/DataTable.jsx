import * as React from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  CodeIcon,
  FileChartColumn,
} from 'lucide-react';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
  IconChevronUp,
  IconArrowsSort,
} from '@tabler/icons-react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export function DataTable({
  data: initialData,
  columns: externalColumns,
  entityName = 'data',
  sheetName = 'Sheet1',
  pdfTitle = 'Relatório',
  tabsData = [],
  mainActionLabel = 'Adicionar Seção',
  mainActionComponent,
  extraTabsContent = [],
  onSortingChange,
  onTabChange,
  initialTabValue,
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // determina o valor da aba principal: usa o valor do primeiro item de tabsData como padrão
  const defaultMainTabValue = tabsData?.[0]?.value || 'first';

  // usa o valor inicial da prop, ou o valor principal padrão
  const [activeTab, setActiveTab] = React.useState(
    initialTabValue || defaultMainTabValue
  );
  const [globalFilter, setGlobalFilter] = React.useState('');

  // sincroniza os dados externos com o estado interno sempre que initialData mudar
  // isso é crucial para que o TanStack Table use os dados filtrados do componente pai
  React.useEffect(() => {
    setData(initialData);
    // opcional: reseta a paginação ao trocar de dados, evitando página vazia
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [initialData]);

  const handleTabChange = (value) => {
    // atualiza o estado interno
    setActiveTab(value);
    // chama o handler do componente pai (Management)
    if (onTabChange) {
      onTabChange(value);
    }
    // reseta o filtro global ao trocar de aba para evitar que o filtro persista em dados diferentes
    setGlobalFilter('');
  };

  const table = useReactTable({
    data,
    columns: externalColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: (updater) => {
      if (onSortingChange) {
        onSortingChange(updater);
      }
      setSorting(updater);
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // função auxiliar genérica para processar os dados antes de exportar
  const processRowsForExport = (rows, table) => {
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

  const exportToCSV = () => {
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

  const exportToExcel = () => {
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

  const exportToJSON = () => {
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

  const exportToPDF = () => {
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

  // identifica quais abas NÃO são abas extras (ou seja, são abas de tabela)
  const isTableTab =
    !extraTabsContent || !extraTabsContent.some((e) => e.value === activeTab);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full flex-col justify-start gap-6"
    >
      {/* header: tabs e botões de ação (CONTROLES UNIFICADOS) */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* pesquisa */}
          <div className="flex items-center">
            <Input
              placeholder="Pesquisar..."
              value={table.getState().globalFilter ?? ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          {/* select mobile (dinâmico, usa handleTabChange) */}
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              {tabsData &&
                tabsData.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* tabs list desktop (dinâmico, usa handleTabChange) */}
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          {tabsData &&
            tabsData.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}{' '}
                {tab.badge && <Badge variant="secondary">{tab.badge}</Badge>}
              </TabsTrigger>
            ))}
        </TabsList>

        {/* botões de ação e customize columns */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customizar Colunas</span>
                <span className="lg:hidden">Colunas</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map((column) => {
                  const label =
                    typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id;

                  if (column.id === 'select' || column.id === 'actions')
                    return null;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* renderiza o componente customizado ou o botão padrão */}
          {mainActionComponent ? (
            mainActionComponent
          ) : (
            <Button variant="outline" size="sm">
              <IconPlus />
              <span className="hidden lg:inline">{mainActionLabel}</span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadIcon className="mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                <FileChartColumn className="mr-2 size-4" />
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheetIcon className="mr-2 size-4" />
                Exportar Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileTextIcon className="mr-2 size-4" />
                Exportar PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToJSON}>
                <CodeIcon className="mr-2 size-4" />
                Exportar JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* conteúdo da tabela (renderiza para qualquer aba que NÃO seja extra) */}
      {/* cria um TabsContent para cada aba que deve conter a tabela */}
      {tabsData
        .filter((tab) => isTableTab || tab.value === activeTab)
        .map((tab) => {
          if (
            extraTabsContent &&
            extraTabsContent.some((e) => e.value === tab.value)
          ) {
            return null; // aaba extra será renderizada no loop abaixo
          }

          return (
            <TabsContent
              key={tab.value}
              value={tab.value} // o valor da aba (ex: 'all-donors', 'pf-donors', 'pj-donors')
              className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
              {/* o conteúdo da tabela só é renderizado se esta for a aba ativa */}
              {activeTab === tab.value && (
                <>
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead
                                  key={header.id}
                                  colSpan={header.colSpan}
                                  className={
                                    header.column.getCanSort()
                                      ? 'cursor-pointer select-none'
                                      : ''
                                  }
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {header.isPlaceholder ? null : (
                                    <div className="flex items-center space-x-1">
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                      {header.column.getCanSort() &&
                                        header.column.id !== 'select' &&
                                        header.column.id !== 'actions' &&
                                        (header.column.getIsSorted() ===
                                        'asc' ? (
                                          <IconChevronUp className="h-4 w-4" />
                                        ) : header.column.getIsSorted() ===
                                          'desc' ? (
                                          <IconChevronDown className="h-4 w-4" />
                                        ) : (
                                          <IconArrowsSort className="h-4 w-4 text-muted-foreground opacity-50" />
                                        ))}
                                    </div>
                                  )}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          <>
                            {table.getRowModel().rows.map((row) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </>
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={table.getAllColumns().length}
                              className="h-24 text-center"
                            >
                              Sem Resultados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* paginação */}
                  <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                      {table.getFilteredSelectedRowModel().rows.length} de{' '}
                      {table.getFilteredRowModel().rows.length} linha(s)
                      selecionada(s).
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                      <div className="hidden items-center gap-2 lg:flex">
                        <Label
                          htmlFor="rows-per-page"
                          className="text-sm font-medium"
                        >
                          Linhas por página
                        </Label>
                        <Select
                          value={`${table.getState().pagination.pageSize}`}
                          onValueChange={(value) => {
                            table.setPageSize(Number(value));
                          }}
                        >
                          <SelectTrigger
                            size="sm"
                            className="w-20"
                            id="rows-per-page"
                          >
                            <SelectValue
                              placeholder={table.getState().pagination.pageSize}
                            />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                              <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de{' '}
                        {table.getPageCount()}
                      </div>
                      <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                          variant="outline"
                          className="hidden h-8 w-8 p-0 lg:flex"
                          onClick={() => table.setPageIndex(0)}
                          disabled={!table.getCanPreviousPage()}
                        >
                          <span className="sr-only">
                            Ir para a primeira página
                          </span>
                          <IconChevronsLeft />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8"
                          size="icon"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                        >
                          <span className="sr-only">
                            Ir para a página anterior
                          </span>
                          <IconChevronLeft />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8"
                          size="icon"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                        >
                          <span className="sr-only">
                            Ir para a próxima página
                          </span>
                          <IconChevronRight />
                        </Button>
                        <Button
                          variant="outline"
                          className="hidden size-8 lg:flex"
                          size="icon"
                          onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                          }
                          disabled={!table.getCanNextPage()}
                        >
                          <span className="sr-only">
                            Ir para a última página
                          </span>
                          <IconChevronsRight />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          );
        })}

      {/* conteúdo das abas extras (dinâmico) */}
      {extraTabsContent &&
        extraTabsContent.map((item) => (
          <TabsContent
            key={item.value}
            value={item.value}
            className="flex flex-col px-4 lg:px-6"
          >
            {item.component}
          </TabsContent>
        ))}
    </Tabs>
  );
}
