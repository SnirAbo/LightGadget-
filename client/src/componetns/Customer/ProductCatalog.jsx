import { Box, Typography, Button, Select, MenuItem, TextField, Grid, Container } from '@mui/material';
import { Stack, Slider } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import Cart from './Cart';
import { useLanguage } from '../../LanguageContext';
import ProductCard from '../../components/ProductCard';

const ProductCatalogComp = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchText, setSearchText] = useState('');

  function handleChange(e) {
    const value = Number(e.target.value);
    dispatch({ type: 'SET_QUANTITY', payload: value });
  }

  useEffect(() => {
    api.get('/products').then((res) => {
      dispatch({ type: 'LOAD_PRODUCT', payload: res.data });
    });
  }, []);

  useEffect(() => {
    api.get('/categories').then((res) => {
      dispatch({ type: 'LOAD_CATEGORY', payload: res.data });
    });
  }, []);

  const filterProducts = () => {
    return products.filter(product =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.price <= maxPrice &&
      product.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(1000);
    setSearchText('');
  };

  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Cart handleChange={handleChange} />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>

        {/* Filter bar */}
        <Box sx={{ p: 1, backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2">{t('category')}</Typography>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ height: 32, minWidth: 100 }}
              size="small"
            >
              <MenuItem value="All">{t('all')}</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="body2">{t('price')}</Typography>
            <Box sx={{ width: 150 }}>
              <Slider
                onChange={(e) => setMaxPrice(e.target.value)}
                size="small"
                defaultValue={70}
                aria-label="Price"
                valueLabelDisplay="auto"
              />
            </Box>

            <TextField
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              InputProps={{ sx: { height: 32, maxWidth: 120 } }}
              placeholder="..."
            />
            <Button
              onClick={clearFilters}
              size="small"
              sx={{ height: 32, color: 'black', backgroundColor: 'lightgrey' }}
            >
              {t('clear')}
            </Button>
          </Stack>
        </Box>

        {/* Product grid */}
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Grid container spacing={2}>
            {filterProducts().map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product._id}>
                <ProductCard
                  product={product}
                  onAddToCart={(p) => dispatch({ type: 'ADD_TO_CART', payload: p })}
                />
              </Grid>
            ))}
          </Grid>
        </Container>

      </Box>
    </Box>
    </>
  );
};

export default ProductCatalogComp;
