import { useState } from 'react';
import {
  Card, CardMedia, CardContent, CardActions, CardActionArea,
  Typography, Stack, Chip, Button, Box, IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCartDrawer } from '../CartDrawerContext';
import { useLanguage } from '../LanguageContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { showAddedToCart } = useCartDrawer();
  const { t } = useLanguage();
  const { title, category, price, pic, quantity } = product;
  const inStock = quantity > 0;
  const [qty, setQty] = useState(1);

  return (
    <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        to={`/product/${product._id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {pic ? (
          <CardMedia
            component="img"
            image={pic}
            alt={title}
            sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              aspectRatio: '1',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h3" noWrap title={title}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {category}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 1 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.25rem' }}>
              ₪{price}
            </Typography>
            <Chip
              label={inStock ? t('inStockStatus') : t('outOfStock')}
              size="small"
              sx={{
                bgcolor: inStock ? 'success.light' : 'error.light',
                color: inStock ? 'success.main' : 'error.main',
                fontWeight: 500,
              }}
            />
          </Stack>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 0.5, alignItems: 'stretch' }}>
        {inStock ? (
          <>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }}
                disabled={qty <= 1}
                aria-label={t('decreaseQty')}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{qty}</Typography>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); setQty(q => Math.min(quantity, q + 1)); }}
                disabled={qty >= quantity}
                aria-label={t('increaseQty')}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.({ ...product, selectedQty: qty });
                showAddedToCart();
              }}
            >
              {t('addToCart')}
            </Button>
          </>
        ) : (
          <Chip
            label={t('outOfStockMsg')}
            sx={{ bgcolor: 'error.light', color: 'error.main', fontWeight: 500 }}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
