import { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useDispatch } from 'react-redux';
import { useLanguage } from '../../LanguageContext';

const RegisterFormComp = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_USER', payload: formData });
    await api.post('/auth/register', formData);
    alert(t('userRegistered', formData.userName));
    console.log(formData);

  };

  return (
    <Container maxWidth="sm" >
  <Box sx={{ mt: 4 }}>
  <Grid container justifyContent="center">
      <Grid item>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('register')}
        </Typography>
      </Grid>
    </Grid>
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <TextField
            label={t('firstName')}
            name="firstName"
            onChange={handleChange}
            variant="outlined"
            sx={{ width: '250px' }}
          />
        </Grid>

        <Grid item>
          <TextField
            label={t('lastName')}
            name="lastName"
            onChange={handleChange}
            variant="outlined"
            sx={{ width: '250px' }}
          />
        </Grid>

        <Grid item>
          <TextField
            label={t('username')}
            name="userName"
            onChange={handleChange}
            variant="outlined"
            sx={{ width: '250px' }}
          />
        </Grid>

        <Grid item>
          <TextField
            label={t('password')}
            name="password"
            type="password"
            onChange={handleChange}
            variant="outlined"
            sx={{ width: '250px' }}
          />
        </Grid>

        <Grid item>
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {t('register')}
            </Button>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="center">
            {t('alreadyHaveAccount')} <Link to="/login">{t('loginLink')}</Link>
          </Box>
        </Grid>
      </Grid>
    </form>
  </Box>
</Container>
  );
};

export default RegisterFormComp;
