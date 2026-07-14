import { useState } from 'react';
import { TextField, Button, Grid, Checkbox, Typography, Box } from '@mui/material';
import api from '../../api';
import { useLanguage } from '../../LanguageContext';
import SectionTitle from '../SectionTitle';

const MyAccountComp = () => {
    const loggedUser = JSON.parse(sessionStorage.getItem('user'));
    const { t } = useLanguage();

    const [activeUser, setActiveUser] = useState({
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        userName: loggedUser.userName,
        password: loggedUser.password,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({activeUser});
        await api.put(`/users/${loggedUser._id}`, { ...activeUser });
        alert(t('userUpdated'));
    }

    const handleChange = (e) => {
        setActiveUser((prevFormData) => ({
          ...prevFormData,
          [e.target.name]: e.target.value,
        }));
    }

    return (
      <Box sx={{ pt: 2, mt: 1, maxWidth: 400, margin: 'auto' }}>
        <SectionTitle>{t('myAccount')}</SectionTitle>
        <Box component="form" onSubmit={handleSubmit} sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <Grid container direction="column" justifyContent="center" alignItems="center" spacing={3}>
            <Grid>
              <TextField
                name="firstName"
                value={activeUser.firstName}
                onChange={handleChange}
                variant="outlined"
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                name="lastName"
                value={activeUser.lastName}
                onChange={handleChange}
                variant="outlined"
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                name="userName"
                value={activeUser.userName}
                onChange={handleChange}
                variant="outlined"
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                name="password"
                type="password"
                value={activeUser.password}
                onChange={handleChange}
                variant="outlined"
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary">
                  {t('save')}
                </Button>
              </Box>
              <Typography>{t('allowOthers')}</Typography>
              <Checkbox />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
}

export default MyAccountComp;
