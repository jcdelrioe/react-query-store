import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Product, productActions } from ".."

export const useProductMutation = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: productActions.createProduct,

    onMutate: (product) => {
      console.log("Mutando - Optimistic update")

      // Optimistic Product
      const optimisticProduct = { id: Math.random(), ...product }

      // Almacenar el producto en cache del query Client
      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: product.category }],
        (old) => {
          if (!old) return [optimisticProduct]
          return [...old, optimisticProduct]
        }
      )
    },

    onSuccess: (product) => {
      // Para invalidar la query
      // queryClient.invalidateQueries({
      //   queryKey: ["products", { filterKey: product.category }],
      // })
      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: product.category }],
        (old) => {
          if (!old) return [product]
          return [...old, product]
        }
      )
    },
  })
  return mutation
}
