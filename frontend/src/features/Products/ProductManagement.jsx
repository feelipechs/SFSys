import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useProductsQuery } from '@/hooks/queries/useProductsQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { productColumns } from './ProductColumns';
import { ProductForm } from './ProductForm';
import {
  LoadingContent,
  LoadingFail,
  NoContent,
} from '@/components/LoadingContent';

const productTabsData = [{ label: 'Produtos', value: 'first' }];

function ProductManagement() {
  const {
    data: products,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useProductsQuery();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const FORM_ID = 'product-form';

  const createButton = (
    <EntityDetailDrawer
      title="Criar Novo Produto"
      description="Preencha os dados da novo produto para criar um registro."
      formId={FORM_ID}
      open={isCreateDrawerOpen}
      onOpenChange={setIsCreateDrawerOpen}
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Novo Produto</span>
        </Button>
      }
    >
      <ProductForm
        formId={FORM_ID}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </EntityDetailDrawer>
  );

  if (isLoading) return <LoadingContent>produtos</LoadingContent>;

  if (isError) return <LoadingFail>produtos</LoadingFail>;

  if (!products || products.length === 0)
    return <NoContent createComponent={createButton}>produtos</NoContent>;

  return (
    <div className="p-4">
      <DataTable
        key={dataUpdatedAt}
        data={products}
        columns={productColumns}
        tabsData={productTabsData}
        mainActionComponent={createButton}
        entityName="products"
        sheetName="Produtos"
        pdfTitle="Relatório de Produtos"
      />
    </div>
  );
}

export default ProductManagement;
