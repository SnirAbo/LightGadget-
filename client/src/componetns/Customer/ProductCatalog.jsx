import { Box, Typography, Button, TextField, Grid, Container, Stack, Slider, Skeleton, Card, CardContent, CardActions, Chip, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import Cart from './Cart';
import { useLanguage } from '../../LanguageContext';
import ProductCard from '../ProductCard';
import SectionTitle from '../SectionTitle';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import bannerImg from '../../assets/banner.jpg';

// ── Left banner strip tunables ────────────────────────────────────────────────
const STRIP_WIDTH       = 200;  // px — width of the banner image
const STRIP_SIDE_MARGIN = 40;   // px — padding on each side of the image inside the rail
const STRIP_TOP         = 72;   // px — sticky top offset (clearance for the header)
const STRIP_BREAKPOINT  = 'xl'; // MUI breakpoint — strip appears only above this width
// Height mode — change this one line to switch between options:
const STRIP_STICKY      = true; // true → Option B: sticky, stays in frame while scrolling
                                // false → Option A: stretches to full product-grid height, scrolls with page

// ── Right animated text strip tunables ───────────────────────────────────────
const RSTRIP_WIDTH          = 80;   // px — total width of the right strip column
const RSTRIP_TEXT_ROTATION  = 90;   // deg — 90 = tilt head right to read; try -90 if reversed
const SCROLL_DURATION       = 20;   // seconds — full loop duration (higher = slower)
const RSTRIP_SEGMENT_HEIGHT = 280;  // px — vertical space each text copy occupies

const ProductCatalogComp = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') || 'All'
  );
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

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
    setMaxPrice(Infinity);
    setSearchText('');
  };

  return (
    <>
      {/* Hero */}
      {/* <Box sx={{
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
             {t('smartGadgets')} - {t('SurprisingPrices')}
          </Typography>
          <Button variant="contained" color="primary" component="a" href="#products">
           {t('productCatalog')}
          </Button>
        </Box>

      </Box> */}

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
              {(() => {
                const prices = products.map((p) => p.price);
                const priceMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
                const priceMax = prices.length ? Math.ceil(Math.max(...prices)) : 1000;
                const sliderVal = isFinite(maxPrice) ? Math.min(maxPrice, priceMax) : priceMax;
                return (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      {t('currency')}{priceMin}
                    </Typography>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={sliderVal}
                        min={priceMin}
                        max={priceMax}
                        onChange={(_, val) => setMaxPrice(val)}
                        size="small"
                        aria-label={t('price')}
                        valueLabelDisplay="auto"
                        disabled={products.length === 0}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('currency')}{priceMax}
                    </Typography>
                  </Stack>
                );
              })()}
              <TextField
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                 sx: { height: 32, maxWidth: 220 }
                }}

                placeholder="חפש מוצר"
              />
              <Button onClick={clearFilters} size="small" variant="outlined">
                {t('clear')}
              </Button>
            </Stack>
          </Box>

      {/* ── Product-grid area: [left banner | grid] ── */}
      <Box sx={{ display: { xs: 'block', [STRIP_BREAKPOINT]: 'flex' }, alignItems: STRIP_STICKY ? 'flex-start' : 'stretch' }}>

        {/* LEFT banner strip outer column — order:2 = physical left in RTL flex row */}
        <Box
          sx={{
            display: { xs: 'none', [STRIP_BREAKPOINT]: 'flex' },
            justifyContent: 'center',
            width: STRIP_WIDTH + 2 * STRIP_SIDE_MARGIN,
            flexShrink: 0,
            order: 2,
          }}
        >
          {/* Inner box — sticky (STRIP_STICKY=true) or stretch (STRIP_STICKY=false) */}
          <Box
            sx={{
              width: STRIP_WIDTH,
              ...(STRIP_STICKY
                ? { position: 'sticky', top: STRIP_TOP, alignSelf: 'flex-start' }
                : { height: '100%' }),
            }}
          >
            <Box
              component="img"
              src={bannerImg}
              alt=""
              sx={{
                width: '100%',
                display: 'block',
                borderRadius: 1,
                ...(STRIP_STICKY
                  ? { height: 'auto' }
                  : { height: '100%', objectFit: 'cover', objectPosition: 'top' }),
              }}
            />
          </Box>
        </Box>

        {/* RIGHT animated text strip — order:0 = physical rightmost in RTL flex row */}
        <Box
          sx={{
            display: { xs: 'none', [STRIP_BREAKPOINT]: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            width: RSTRIP_WIDTH,
            flexShrink: 0,
            order: 0,
            overflow: 'hidden',
            ...(STRIP_STICKY
              ? { position: 'sticky', top: STRIP_TOP, alignSelf: 'flex-start', height: `calc(100vh - ${STRIP_TOP}px)` }
              : {}),
          }}
        >
          {/* Scrolling track — 10 copies, animates -50% for a seamless loop */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              ...(!reducedMotion && {
                animation: `rStripScroll ${SCROLL_DURATION}s linear infinite`,
                '@keyframes rStripScroll': {
                  '0%': { transform: 'translateY(0)' },
                  '100%': { transform: 'translateY(-50%)' },
                },
              }),
            }}
          >
            {[...Array(10)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: RSTRIP_WIDTH,
                  height: RSTRIP_SEGMENT_HEIGHT,
                  flexShrink: 0,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    transform: `rotate(${RSTRIP_TEXT_ROTATION}deg)`,
                    transformOrigin: 'center',
                    whiteSpace: 'nowrap',
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    letterSpacing: 2,
                    display: 'block',
                  }}
                >
                  {t('catalogStripText')}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Product grid — order:1 = physical right in RTL flex row, takes remaining width */}
        <Box sx={{ flex: 1, minWidth: 0, order: 1 }}>
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
        </Box>{/* /product grid */}

      </Box>{/* /banner + grid flex */}

    </>
  );
};

export default ProductCatalogComp;
