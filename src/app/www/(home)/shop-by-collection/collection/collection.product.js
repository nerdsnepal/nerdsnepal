import ProductList from "@/app/www/component/products/product-list";
import { useSichuFetch } from "@/app/www/hooks/use-fetch";

const CollectionProduct = ({category}) => {
    const {data,isLoading} = useSichuFetch({endPoint:`products/category?name=${category?.name}&subcategory=${category?.subCategory}`,revalidate:120})
    if(isLoading)return <h1>Loading..</h1>
    return (<ProductList products={data} />);
}
 
export default CollectionProduct;