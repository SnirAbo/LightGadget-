import PublicHeader from '../componetns/Layout/PublicHeader';
import ProductPageComp from '../componetns/Customer/ProductPage';
import { CartDrawerProvider } from '../CartDrawerContext';

const ProductPage = () => (
  <CartDrawerProvider>
    <PublicHeader />
    <ProductPageComp />
  </CartDrawerProvider>
);

export default ProductPage;
