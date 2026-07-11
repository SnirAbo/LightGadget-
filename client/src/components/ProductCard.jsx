import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Stack, Chip, Button, Box,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const ProductCard = ({ product, onAddToCart }) => {
  const { title, category, price, pic, quantity } = product;
  const inStock = quantity > 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {pic ? (
        <CardMedia
          component="img"
          image={pic}
          alt={title}
          sx={{ aspectRatio: '1', objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
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

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!inStock}
          onClick={() => onAddToCart?.(product)}
        >
          הוסף לעגלה
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
