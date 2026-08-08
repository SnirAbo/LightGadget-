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
import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero-bg.mp4';
import { CartDrawerProvider } from '../CartDrawerContext';
import PublicHeader from '../componetns/Layout/PublicHeader';
import Cart from '../componetns/Customer/Cart';
import SectionTitle from '../componetns/SectionTitle';
import { useLanguage } from '../LanguageContext';
import LandingProductCard from '../componetns/LandingV2/LandingProductCard';
import api from '../api';

// ── Hero video tunables ──────────────────────────────────────
const OVERLAY_OPACITY         = 0.45; // tune 0–1: higher = darker overlay, more legible text
const DISABLE_VIDEO_ON_MOBILE = true; // true → static theme background on mobile for perf

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
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
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
  const [rm] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  );
  const showVideo = !rm && !(DISABLE_VIDEO_ON_MOBILE && isMobile);

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
        position: 'relative',
        minHeight: { xs: '80vh', md: '88vh' },
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}>
        {/* Video background — skipped on mobile (DISABLE_VIDEO_ON_MOBILE) and prefers-reduced-motion */}
        {showVideo && (
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}

        {/* Overlay — tune OVERLAY_OPACITY above to balance video brightness vs. text legibility */}
        {showVideo && (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: `rgba(0,0,0,${OVERLAY_OPACITY})`,
            zIndex: 1,
          }} />
        )}

        {/* Hero content — above video + overlay */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack alignItems="center" sx={{ textAlign: 'center' }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                color: showVideo ? '#fff' : 'text.primary',
                mb: 3,
                maxWidth: 700,
              }}
            >
              {t('landingHeroTitle')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: showVideo ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                mb: 4,
                maxWidth: 480,
              }}
            >
              {t('landingHeroSub')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/products"
              sx={{ fontSize: '1rem', px: 5, py: 1.5 }}
            >
              {t('landingHeroCta')}
            </Button>
          </Stack>
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
