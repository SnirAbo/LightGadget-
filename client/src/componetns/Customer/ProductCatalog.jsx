import { Box, Typography, Button, TextField, Grid, Container, Stack, Slider, Skeleton, Card, CardContent, CardActions, Chip, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import Cart from './Cart';
import { useLanguage } from '../../LanguageContext';
import ProductCard from '../ProductCard';
import SectionTitle from '../SectionTitle';

const ProductCatalogComp = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  function handleChange(e) {
    const value = Number(e.target.value);
    dispatch({ type: 'SET_QUANTITY', payload: value });
  }

  const fetchProducts = () => {
    setLoading(true);
    setProductsError(false);
    api.get('/products').then((res) => {
      dispatch({ type: 'LOAD_PRODUCT', payload: res.data });
      setLoading(false);
    }).catch(() => {
      setProductsError(true);
      setLoading(false);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(); }, []);

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
      {/* Hero */}
      <Box sx={{
        width: '100%',
        minHeight: { xs: 240, md: 380 },
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 3, md: 8 },
        gap: 4,
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h1" sx={{ mb: 2 }}>
            {t('SmartHomeTech')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            גאדג&apos;טים, ציוד חכם ואביזרים לבית המודרני — במחירים שמפתיעים.
          </Typography>
          <Button variant="contained" color="primary" component="a" href="#products">
           {t('productCatalog')}
          </Button>
        </Box>
        {products[0]?.pic && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Box
              component="img"
              src={products[0].pic}
              alt="hero"
              sx={{ maxHeight: 300, maxWidth: '100%', objectFit: 'contain' }}
            />
          </Box>
        )}
      </Box>

      <Cart />

      {/* Categories */}
      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
            <SectionTitle>{t('categories')}</SectionTitle>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={t('all')}
                clickable
                onClick={() => setSelectedCategory('All')}
                color={selectedCategory === 'All' ? 'primary' : 'default'}
                variant={selectedCategory === 'All' ? 'filled' : 'outlined'}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat._id}
                  label={cat.name}
                  clickable
                  onClick={() => setSelectedCategory(cat.name)}
                  color={selectedCategory === cat.name ? 'primary' : 'default'}
                  variant={selectedCategory === cat.name ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Box>

          {/* Filter bar */}
          <Box sx={{ px: 1, py: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
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
              <Button onClick={clearFilters} size="small" variant="outlined" sx={{ height: 32 }}>
                {t('clear')}
              </Button>
            </Stack>
          </Box>

          {/* Product grid */}
          <Container maxWidth="lg" sx={{ py: 2 }} id="products">
            <SectionTitle>{t('ourProducts')}</SectionTitle>
            {!loading && productsError ? (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={fetchProducts}>
                    {t('retry')}
                  </Button>
                }
              >
                {t('errorLoadingProducts')}
              </Alert>
            ) : (
            <Grid container spacing={2} alignItems="stretch">
              {loading
                ? [...Array(8)].map((_, i) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                      <Card>
                        <Box sx={{ width: '100%', aspectRatio: '1' }}>
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                        </Box>
                        <CardContent>
                          <Skeleton width="80%" height={28} />
                          <Skeleton width="40%" height={20} />
                          <Skeleton width="50%" height={28} sx={{ mt: 1 }} />
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Skeleton variant="rounded" width="100%" height={44} />
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                : filterProducts().map((product) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product._id}>
                      <ProductCard
                        product={product}
                        onAddToCart={(p) => dispatch({ type: 'ADD_TO_CART', payload: p })}
                      />
                    </Grid>
                  ))}
            </Grid>
            )}
          </Container>

    </>
  );
};

export default ProductCatalogComp;
