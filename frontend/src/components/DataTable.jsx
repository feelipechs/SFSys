import * as React from 'react';
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
          {/* select mobile (Dinâmico, usa handleTabChange) */}
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

        {/* tabs list desktop (Dinâmico, usa handleTabChange) */}
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

      {/* conteúdo das abas extras (Dinâmico) */}
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
