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
      return { optimisticProduct }
    },

    onSuccess: (product, variables, context) => {
      console.log(product, variables, context)

      // Para invalidar la query
      // queryClient.invalidateQueries({
      //   queryKey: ["products", { filterKey: product.category }],
      // })

      // Borrar el optimistic Product despues de que ya se actualizo
      queryClient.removeQueries({
        queryKey: ["product", context?.optimisticProduct.id],
        exact: true,
      })

      queryClient.setQueryData<Product[]>(
        ["products", { filterKey: product.category }],
        (old) => {
          if (!old) return [product]

          return old.map((cacheProduct) => {
            return cacheProduct.id === context?.optimisticProduct.id
              ? product
              : cacheProduct
          })
        }
      )
    },
  })
  return mutation
}
