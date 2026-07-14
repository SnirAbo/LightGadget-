import PublicHeader from '../componetns/Layout/PublicHeader';
import ProductCatalogComp from '../componetns/Customer/ProductCatalog';
import { CartDrawerProvider } from '../CartDrawerContext';

const HomePage = () => {
  return (
    <CartDrawerProvider>
      <PublicHeader />
      <ProductCatalogComp />
    </CartDrawerProvider>
  );
};

export default HomePage;
