import {
  Card, CardMedia, CardContent, CardActions, CardActionArea,
  Typography, Stack, Chip, Button, Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useCartDrawer } from '../CartDrawerContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { showAddedToCart } = useCartDrawer();
  const { title, category, price, pic, quantity } = product;
  const inStock = quantity > 0;

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
              label={inStock ? 'במלאי' : 'אזל'}
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
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
            showAddedToCart();
          }}
        >
          הוסף לעגלה
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
