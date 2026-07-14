import {useState, useEffect} from 'react';
import api from '../../api';
import { TextField, Button, Grid, Container, Typography, Box } from '@mui/material';
import {  Link, useNavigate} from 'react-router-dom'
import { useDispatch , useSelector} from 'react-redux';
import { useLanguage } from '../../LanguageContext';


const LoginFormComp = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const [loginData, setloginData] = useState({
        email: '',
        password: ''
      });


    const handleChange = (e) => {
        setloginData((prevFormData) => ({
          ...prevFormData,
          [e.target.name]: e.target.value,  // Dynamically update the corresponding field in formData
        }));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', loginData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'LOGIN_USER', payload: user });
            alert(t('welcome', user.userName));
            navigate('/');
        } catch {
            alert(t('invalidCredentials'));
        }
    }



return (
    <>
    <Container maxWidth="sm" sx={{
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  p: 4,
  mt: 4,
}}>
  <Box>
  <Grid container justifyContent="center">
      <Grid>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('appTitle')}
        </Typography>
      </Grid>
    </Grid>
    <form onSubmit={handleSubmit}>

        <Grid>
          <TextField
            label={t('email')}
            name="email"
            type='email'
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid>
          <TextField
            label={t('password')}
            name="password"
            type="password"
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid>
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('login')}
            </Button>
          </Box>
        </Grid>
        <Grid>
          <Box display="flex" justifyContent="center">
         {t('newUser')} <Link to='/register'>{t('registerLink')}</Link>
          </Box>
        </Grid>
    </form>
  </Box>
</Container>
    </>
 );
}

export default LoginFormComp;
