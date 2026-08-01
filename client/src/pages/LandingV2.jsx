import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Grid, Stack, Typography, Button,
  Skeleton, Alert, Card, CardContent, CardActions,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Link } from 'react-router-dom';
import { CartDrawerProvider } from '../CartDrawerContext';
import PublicHeader from '../componetns/Layout/PublicHeader';
import Cart from '../componetns/Customer/Cart';
import SectionTitle from '../componetns/SectionTitle';
import { useLanguage } from '../LanguageContext';
import LandingProductCard from '../componetns/LandingV2/LandingProductCard';
import api from '../api';

// ── Hero: staggered product image mosaic ─────────────────────
const MOSAIC_SLOTS = [
  { pos: { top: '2%', left: '4%' },     rotate: '-4deg', zIndex: 3 },
  { pos: { top: '18%', right: '4%' },   rotate: '3deg',  zIndex: 2 },
  { pos: { bottom: '4%', left: '16%' }, rotate: '-1deg', zIndex: 1 },
];

// ── Mosaic card motion tunables ───────────────────────────────
const ORBIT_DURATION  = 50;   // s — one full orbit; higher = calmer
const ORBIT_RADIUS    = 10;   // px — max drift from rest (container clips at edges)
const FLOAT_AMPLITUDE = 8;    // px — up/down bob height
const SPIN_CARDS      = false; // true → each card also slowly rotates on its own axis

const _FLOAT_DUR = [5.0, 4.3, 5.8]; // mismatched durations → organic, async bob
const _FLOAT_DEL = [0, 1.8, 0.9];   // stagger so no two cards bob together

const _orbitKF = (i) => {
  const phase = (i * 2 * Math.PI) / 3; // 0°, 120°, 240° — evenly spaced
  const N = 16;
  const stops = Array.from({ length: N + 1 }, (_, k) => {
    const pct   = ((k / N) * 100).toFixed(1);
    const angle = (2 * Math.PI * k) / N + phase;
    const x     = (ORBIT_RADIUS * Math.sin(angle)).toFixed(2);
    const y     = (-ORBIT_RADIUS * Math.cos(angle)).toFixed(2);
    const spin  = SPIN_CARDS ? `rotate(${((360 * k) / N).toFixed(1)}deg) ` : '';
    return `${pct}%{transform:${spin}translate(${x}px,${y}px)}`;
  });
  return `@keyframes hmc-o${i}{${stops.join('')}}`;
};
const _floatKF = (i) =>
  `@keyframes hmc-f${i}{0%,100%{transform:translateY(0)}50%{transform:translateY(-${FLOAT_AMPLITUDE}px)}}`;

const MOSAIC_CSS = [0, 1, 2].map(i => _orbitKF(i) + _floatKF(i)).join('');

const ProductMosaic = ({ products, loading }) => {
  const [rm, setRm] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = (e) => setRm(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  return (
    <Box sx={{ position: 'relative', height: 380, width: '100%', overflow: 'hidden' }}>
      {!rm && <style>{MOSAIC_CSS}</style>}

      {/* Orange accent circle behind cards */}
      <Box sx={{
        position: 'absolute',
        width: 260, height: 260,
        borderRadius: '50%',
        bgcolor: 'primary.light',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
      }} />

      {MOSAIC_SLOTS.map((slot, idx) => (
        // Orbit wrapper — absolute positioned; CSS animation adds a slow circular drift
        <Box key={idx} sx={{
          position: 'absolute',
          width: 140,
          zIndex: slot.zIndex,
          ...slot.pos,
          animation: (!rm && !isMobile)
            ? `hmc-o${idx} ${ORBIT_DURATION}s linear infinite`
            : 'none',
        }}>
          {/* Float wrapper — gentle up/down bob, independent of orbit */}
          <Box sx={{
            animation: !rm
              ? `hmc-f${idx} ${_FLOAT_DUR[idx]}s ease-in-out infinite ${_FLOAT_DEL[idx]}s`
              : 'none',
          }}>
            {/* Card visual — static tilt, rounded corners, shadow */}
            <Box sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              bgcolor: 'background.paper',
              transform: `rotate(${slot.rotate})`,
            }}>
              {loading || !products[idx] ? (
                <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '1' }} />
              ) : products[idx].pic ? (
                <Box
                  component="img"
                  src={products[idx].pic}
                  alt={products[idx].title}
                  sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <Box sx={{
                  width: '100%', aspectRatio: '1',
                  bgcolor: 'background.paper',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ImageOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// ── Trust strip ───────────────────────────────────────────────
const TRUST = [
  { Icon: LocalShippingOutlinedIcon, titleKey: 'landingTrustDelivery', subKey: 'landingTrustDeliverySub' },
  { Icon: SecurityOutlinedIcon,       titleKey: 'landingTrustPayment',  subKey: 'landingTrustPaymentSub'  },
  { Icon: StarOutlineIcon,            titleKey: 'landingTrustWarranty', subKey: 'landingTrustWarrantySub' },
  { Icon: SupportAgentOutlinedIcon,   titleKey: 'landingTrustSupport',  subKey: 'landingTrustSupportSub'  },
];

const TrustStrip = () => {
  const { t } = useLanguage();
  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider',
      py: 4,
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {TRUST.map(({ Icon, titleKey, subKey }) => (
            <Grid key={titleKey} size={{ xs: 6, md: 3 }}>
              <Stack alignItems="center" spacing={1} sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon sx={{ color: 'primary.main', fontSize: 24 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {t(titleKey)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {t(subKey)}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// ── Categories ────────────────────────────────────────────────
const CategoriesSection = ({ categories, loading }) => {
  const { t } = useLanguage();
  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <SectionTitle>{t('landingTopCategories')}</SectionTitle>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '2px' },
          }}
        >
          {loading
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width={160} height={120} sx={{ flexShrink: 0 }} />
              ))
            : categories.map((cat) => (
                <Box
                  key={cat._id}
                  component={Link}
                  to="/"
                  sx={{
                    flexShrink: 0,
                    width: 160, height: 120,
                    borderRadius: '12px',
                    bgcolor: 'background.paper',
                    border: '1px solid', borderColor: 'divider',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'transform .2s, box-shadow .2s, border-color .2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      borderColor: 'primary.main',
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                      '&:hover': { transform: 'none' },
                    },
                  }}
                >
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShoppingBagOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center', px: 1 }}
                  >
                    {cat.name}
                  </Typography>
                </Box>
              ))}
        </Stack>
      </Container>
    </Box>
  );
};

// ── Featured products ─────────────────────────────────────────
const FeaturedSection = ({ products, loading, error, onRetry }) => {
  const { t } = useLanguage();
  const featured = products.slice(0, 8);

  return (
    <Box id="products" sx={{ bgcolor: 'background.paper', py: 8 }}>
      <Container maxWidth="lg">
        <SectionTitle>{t('landingFeaturedProducts')}</SectionTitle>

        {error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={onRetry}>
                {t('retry')}
              </Button>
            }
          >
            {t('errorLoadingProducts')}
          </Alert>
        ) : (
          <>
            <Grid container spacing={2} alignItems="stretch">
              {loading
                ? [...Array(8)].map((_, i) => (
                    <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
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
                : featured.length === 0
                ? (
                    <Grid size={{ xs: 12 }}>
                      <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="h3" color="text.secondary">
                          {t('landingNoProducts')}
                        </Typography>
                      </Stack>
                    </Grid>
                  )
                : featured.map((product) => (
                    <Grid key={product._id} size={{ xs: 6, sm: 4, md: 3 }}>
                      <LandingProductCard product={product} />
                    </Grid>
                  ))}
            </Grid>

            {!loading && !error && featured.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Button variant="outlined" color="primary" size="large" component={Link} to="/products">
                  {t('landingViewAll')}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

// ── Closing CTA ───────────────────────────────────────────────
const ClosingCTA = () => {
  const { t } = useLanguage();
  return (
    <Box sx={{ bgcolor: 'text.primary', py: 10 }}>
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={3} sx={{ textAlign: 'center' }}>
          <Typography sx={{
            color: 'primary.contrastText',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            {t('landingCtaTitle')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>
            {t('landingCtaSub')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/products"
            sx={{ fontSize: '1rem', px: 5, py: 1.5 }}
          >
            {t('landingCtaBtn')}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

// ── Page ──────────────────────────────────────────────────────
const LandingV2Inner = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const fetchProducts = useCallback(() => {
    setProductsLoading(true);
    setProductsError(false);
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => setProductsError(true))
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .finally(() => setCategoriesLoading(false));
  }, [fetchProducts]);

  return (
    <>
      <PublicHeader />
      <Cart />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Box sx={{
        minHeight: { xs: '80vh', md: '88vh' },
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Headline + CTA */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                {t('landingHeroTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480 }}>
                {t('landingHeroSub')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component="a"
                href="/products"
                sx={{ fontSize: '1rem', px: 5, py: 1.5 }}
              >
                {t('landingHeroCta')}
              </Button>
            </Grid>

            {/* Mosaic — desktop only */}
            <Grid
              size={{ md: 5 }}
              sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}
            >
              <ProductMosaic products={products} loading={productsLoading} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <TrustStrip />
      <CategoriesSection categories={categories} loading={categoriesLoading} />
      <FeaturedSection
        products={products}
        loading={productsLoading}
        error={productsError}
        onRetry={fetchProducts}
      />
      <ClosingCTA />
    </>
  );
};

const LandingV2 = () => (
  <CartDrawerProvider>
    <LandingV2Inner />
  </CartDrawerProvider>
);

export default LandingV2;
