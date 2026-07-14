import { Box, Typography, Paper, Button, TextField, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../../LanguageContext';

const CategoryManagerComp = () => {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const categories = useSelector((state) => state.category.categories);
    const [newCategory, setNewCategory] = useState({ name: '', status: 'NEW' });
    const [newName, setNewName] = useState({ name: '', status: 'NEW' });
    const [editingId, setEditingId] = useState(null);
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

    const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
    const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

    const fetchCategories = () => {
        api.get('/categories').then((res) => {
            dispatch({ type: 'LOAD_CATEGORY', payload: res.data });
        });
    };

    useEffect(() => { fetchCategories(); }, []);

    const newData = async () => {
        try {
            await api.post('/categories', newCategory);
            fetchCategories();
            showSnack(t('categoryAdded'));
        } catch {
            showSnack(t('errorAddingCategory'), 'error');
        }
    };

    const removeData = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
            showSnack(t('categoryRemoved'));
        } catch {
            showSnack(t('errorRemovingCategory'), 'error');
        }
    };

    const updateData = async (id) => {
        try {
            await api.put(`/categories/${id}`, { name: newName.name });
            setEditingId(null);
            fetchCategories();
            showSnack(t('categoryUpdated'));
        } catch {
            showSnack(t('errorUpdatingCategory'), 'error');
        }
    };

    return (
        <>
            <Box sx={{ pt: 2, mt: 1, maxWidth: 600, margin: 'auto', padding: 3 }}>
                <Typography sx={{ mt: 1 }} variant="h4" fontWeight="bold">{t('categoriesTitle')}</Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    {categories.map((category) => (
                        <Card key={category._id} variant="outlined" component={Paper} sx={{ maxWidth: 250, mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                    <Typography>{category.name}</Typography>
                                    <Button
                                        onClick={() => {
                                            setEditingId(editingId === category._id ? null : category._id);
                                            setNewName({ name: category.name });
                                        }}
                                        size="small"
                                        variant="outlined"
                                    >
                                        {t('update')}
                                    </Button>
                                    <Button
                                        onClick={() => removeData(category._id)}
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                    >
                                        {t('remove')}
                                    </Button>
                                </Box>
                                {editingId === category._id && (
                                    <Box sx={{ mt: 1 }}>
                                        <TextField
                                            placeholder={t('newName')}
                                            InputProps={{ sx: { height: 40 } }}
                                            onChange={(e) => setNewName({ name: e.target.value })}
                                        />
                                        <Button
                                            onClick={() => updateData(category._id)}
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                        >
                                            {t('save')}
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    <TextField
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder={t('addNewCategory')}
                        sx={{ maxWidth: 250 }}
                        InputProps={{ sx: { height: 40, '& input': { padding: '10px 14px' } } }}
                    />
                    <Button onClick={newData} size="small" variant="contained" color="primary">
                        {t('addNew')}
                    </Button>
                </Box>
            </Box>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={closeSnack} severity={snack.severity} variant="filled">
                    {snack.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default CategoryManagerComp;
