import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Grid, Typography, Button, Chip, Stack, Alert, Skeleton, Container,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useDispatch } from 'react-redux';
import api from '../../api';
import Cart from './Cart';
import { useCartDrawer } from '../../CartDrawerContext';
import { useLanguage } from '../../LanguageContext';

const ProductPageComp = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    setError(false);
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const { showAddedToCart } = useCartDrawer();
  const { t } = useLanguage();

  const handleAddToCart = () => {
    if (product) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
      showAddedToCart();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, pb: { xs: 12, md: 0 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '1', borderRadius: '16px' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton width="70%" height={40} />
            <Skeleton width="30%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="40%" height={56} sx={{ mb: 2 }} />
            <Skeleton width="20%" height={32} sx={{ mb: 3 }} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="90%" height={20} />
            <Skeleton width="80%" height={20} sx={{ mb: 4 }} />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Skeleton variant="rounded" width="100%" height={52} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchProduct}>
              {t('retry')}
            </Button>
          }
        >
          {t('errorLoadingProduct')}
        </Alert>
      </Container>
    );
  }

  const { title, category, price, pic, description } = product;
  const inStock = product.quantity > 0;

  return (
    <>
      <Cart />
      <Container maxWidth="lg" sx={{ py: 4, pb: { xs: 12, md: 0 } }}>
        <Grid container spacing={4}>

          {/* Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            {pic ? (
              <Box
                component="img"
                src={pic}
                alt={title}
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'contain',
                  bgcolor: 'background.paper',
                  borderRadius: '16px',
                  display: 'block',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  bgcolor: 'background.paper',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
              </Box>
            )}
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h1" sx={{ mb: 0.5 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {category}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'primary.main' }}>
                ₪{price}
              </Typography>
              <Chip
                label={inStock ? 'במלאי' : 'אזל'}
                size="small"
                sx={{
                  bgcolor: inStock ? 'success.light' : 'error.light',
                  color: inStock ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              />
            </Stack>

            {description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {description}
              </Typography>
            )}

            {/* Desktop buy button — sticky bar handles mobile */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                הוסף לעגלה
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Container>

      {/* Mobile sticky bottom bar — hidden on desktop */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
          zIndex: (theme) => theme.zIndex.appBar - 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          הוסף לעגלה
        </Button>
      </Box>
    </>
  );
};

export default ProductPageComp;
