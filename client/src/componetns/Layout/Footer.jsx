import { Box, Container, Divider, Grid, Stack, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import storeInfo from '../../storeInfo';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 6 }}>
          {/* Brand */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              LightGadget
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('footerTagline')}
            </Typography>
          </Grid>

          {/* Quick links */}
          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              {t('footerQuickLinks')}
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                to="/"
                underline="hover"
                sx={{ color: 'text.secondary', typography: 'body2' }}
              >
                {t('products')}
              </MuiLink>
              <MuiLink
                component={Link}
                to="/account/myaccount"
                underline="hover"
                sx={{ color: 'text.secondary', typography: 'body2' }}
              >
                {t('myAccount')}
              </MuiLink>
              <MuiLink
                component={Link}
                to="/account/orders"
                underline="hover"
                sx={{ color: 'text.secondary', typography: 'body2' }}
              >
                {t('orders')}
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              {t('footerContactUs')}
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                href={`tel:${storeInfo.phone}`}
                underline="hover"
                sx={{ color: 'text.secondary', typography: 'body2' }}
              >
                {t('phoneNumber')}: {storeInfo.phone}
              </MuiLink>
              <MuiLink
                href={`mailto:${storeInfo.email}`}
                underline="hover"
                sx={{ color: 'text.secondary', typography: 'body2' }}
              >
                {storeInfo.email}
              </MuiLink>
              <MuiLink
                href={`https://wa.me/${storeInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: 'text.secondary', typography: 'body2' }}
              >
                {t('footerWhatsapp')}: {storeInfo.phone}
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        <Box sx={{ py: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            © 2026 LightGadget
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
