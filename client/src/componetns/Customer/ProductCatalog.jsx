import { Box, Typography, Button, Card, CardContent, CardMedia, CardActions, Select, MenuItem, TextField, Grid, Chip } from '@mui/material';
import { Stack, Slider } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import Cart from './Cart';
import { useLanguage } from '../../LanguageContext';

const ProductCatalogComp = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const cart = useSelector((state) => state.cart.cart);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchText, setSearchText] = useState('');

  function handleChange(e) {
    const value = Number(e.target.value);
    dispatch({ type: 'SET_QUANTITY', payload: value });
  }

  const increment = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

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
                <MenuItem key={category.id} value={category.name}>
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
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {filterProducts().map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.pic || 'https://placehold.co/300x160?text=No+Image'}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap title={product.title}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 0.5 }}>
                      ₪{product.price}
                    </Typography>
                    <Chip
                      label={product.quantity > 0 ? t('inStockStatus') : t('outOfStock')}
                      color={product.quantity > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </CardContent>
                  <CardActions sx={{ p: 1 }}>
                    <Button
                      onClick={() => increment(product)}
                      variant="contained"
                      color="success"
                      size="small"
                      fullWidth
                      disabled={product.quantity === 0}
                    >
                      {t('addToCart')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Box>
    </Box>
    </>
  );
};

export default ProductCatalogComp;
