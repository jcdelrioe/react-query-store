import axios from "axios"

const productsApi = axios.create({
  baseURL: "http://localehost:3100",
})

export { productsApi }
