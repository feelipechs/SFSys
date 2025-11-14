import { useQuery } from '@tanstack/react-query';
import ProductService from '@/services/productService';

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: ProductService.findAll,
  });
};
