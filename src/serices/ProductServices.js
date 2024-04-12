import axios from 'axios'
const ProductService = {}
ProductService.createProd = function(data) {

    return axios.post('http://localhost:4000/Products/createProduct', data)
}

ProductService.getAllProducts = function(data){
    return axios.get('http://localhost:4000/Products/getAllProducts', data)
}



export default ProductService;