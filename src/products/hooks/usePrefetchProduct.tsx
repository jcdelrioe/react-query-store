import { useQueryClient } from "@tanstack/react-query"
import { productActions } from ".."

export const usePrefetchProduct = () => {
  const queryClient = useQueryClient()

  const preFetchProduct = async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["product", id],
      queryFn: () => productActions.getProductById(id),
    })
  }
  return preFetchProduct
}
