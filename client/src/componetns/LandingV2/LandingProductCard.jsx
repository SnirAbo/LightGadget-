import { useState } from 'react';
import {
  Card, CardMedia, CardContent, CardActions, CardActionArea,
  Typography, Stack, Chip, Button, Box, Snackbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useDispatch } from 'react-redux';
import { useLanguage } from '../../LanguageContext';

const LandingProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [snack, setSnack] = useState(false);
  const { title, category, price, pic, quantity } = product;
  const inStock = quantity > 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setSnack(true);
  };

  return (
    <>
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
            <Box sx={{
              width: '100%', aspectRatio: '1',
              bgcolor: 'background.paper',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ImageOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            </Box>
          )}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h3" noWrap title={title}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{category}</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 1 }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.25rem' }}>
                {t('currency')}{price}
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
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!inStock}
            onClick={handleAdd}
          >
            {t('addToCart')}
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        message={t('addedToCart')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default LandingProductCard;
