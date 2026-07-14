import { Box, Typography, Paper, Button, TextField, Card, CardContent, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../../LanguageContext';

const ProductManagerComp = () => {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const products = useSelector((state) => state.product.products);
    const categories = useSelector((state) => state.category.categories);
    const [newProduct, setNewProduct] = useState({
        title: '',
        quantity: 0,
        category: '',
        description: '',
        price: 0,
        pic: '',
    });

    const [updatedProducts, setUpdatedProducts] = useState({});
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

    const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
    const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

    const getValidCategory = (id) => {
        const cat = updatedProducts[id]?.category ?? products.find(p => p._id === id)?.category;
        return categories.some(c => c.name === cat) ? cat : '';
    };

    const addNew = (e) => {
        setNewProduct((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleProductChange = (id, field, value) => {
        setUpdatedProducts((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const handleImageUpload = async (file, onUrlReady) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onUrlReady(res.data.url);
        } catch {
            showSnack(t('uploadError'), 'error');
        }
    };

    const handleSave = async (id) => {
        const updated = updatedProducts[id];
        if (updated) {
            try {
                await api.put(`/products/${id}`, updated);
                fetchProducts();
                showSnack(t('productUpdated'));
            } catch {
                showSnack(t('errorUpdatingProduct'), 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
            showSnack(t('productDeleted'));
        } catch {
            showSnack(t('errorDeletingProduct'), 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = ['title', 'category', 'description', 'price'];
        if (requiredFields.some(field => !newProduct[field])) {
            alert(t('fillRequired'));
            return;
        }
        try {
            await api.post('/products', newProduct);
            fetchProducts();
            showSnack(t('productAdded', newProduct.title));
        } catch {
            showSnack(t('errorAddingProduct'), 'error');
        }
        console.log(newProduct);
    };

    const [isClicked, setIsClicked] = useState(false);

    const fetchProducts = () => {
        api.get('/products').then((res) => {
            dispatch({ type: 'LOAD_PRODUCT', payload: res.data });
        });
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        api.get('/categories').then((res) => {
            dispatch({ type: 'LOAD_CATEGORY', payload: res.data });
        });
    }, []);

    return (
        <>
            <Box sx={{ mt: 2, p: 2, maxWidth: 600, margin: 'auto', padding: 3 }}>
                {products.map((product) => (
                    <Card key={product._id} variant="outlined" component={Paper} sx={{ maxWidth: 600, maxHeight: 600, mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                <Typography>{t('titleLabel')}</Typography>
                                <TextField
                                    InputProps={{ sx: { height: 40 } }}
                                    value={updatedProducts[product._id]?.title ?? product.title}
                                    onChange={(e) => handleProductChange(product._id, 'title', e.target.value)}
                                />
                                <Typography>{t('quantityLabel')}</Typography>
                                <TextField
                                    InputProps={{ sx: { height: 40 } }}
                                    value={updatedProducts[product._id]?.quantity ?? product.quantity}
                                    onChange={(e) => handleProductChange(product._id, 'quantity', e.target.value)}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>{t('priceLabel')}</Typography>
                                <TextField
                                    InputProps={{ sx: { height: 40 } }}
                                    value={updatedProducts[product._id]?.price ?? product.price}
                                    onChange={(e) => handleProductChange(product._id, 'price', e.target.value)}
                                />
                            </Box>
                            <Box>
                                <Typography>{t('categoryLabel')}</Typography>
                                <Select
                                    value={getValidCategory(product._id)}
                                    onChange={(e) => handleProductChange(product._id, 'category', e.target.value)}
                                    sx={{ height: 40 }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category.name}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box>
                                <Typography>{t('descriptionLabel')}</Typography>
                                <TextField
                                    InputProps={{ sx: { height: 40 } }}
                                    value={updatedProducts[product._id]?.description ?? product.description}
                                    onChange={(e) => handleProductChange(product._id, 'description', e.target.value)}
                                />
                            </Box>
                            <Box>
                                <Typography>{t('pictureLabel')}</Typography>
                                <TextField
                                    InputProps={{ sx: { height: 40 } }}
                                    value={updatedProducts[product._id]?.pic ?? product.pic}
                                    onChange={(e) => handleProductChange(product._id, 'pic', e.target.value)}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            handleImageUpload(e.target.files[0], (url) =>
                                                handleProductChange(product._id, 'pic', url)
                                            );
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button size="small" variant="contained" color="primary" onClick={() => handleSave(product._id)}>
                                    {t('save')}
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(product._id)}>
                                    {t('remove')}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
                <Button onClick={(e) => setIsClicked(!isClicked)} size="small" variant="contained" color="primary">
                    {t('addNew')}
                </Button>
                {isClicked && (
                    <Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <Typography>{t('titleLabel')}</Typography>
                            <TextField name="title" InputProps={{ sx: { height: 40 } }} onChange={addNew} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <Typography>{t('quantityLabel')}</Typography>
                            <TextField name="quantity" InputProps={{ sx: { height: 40 } }} onChange={addNew} />
                        </Box>
                        <Box>
                            <Typography>{t('categoryLabel')}</Typography>
                            <Select name="category" value={newProduct.category} onChange={addNew} sx={{ height: 40 }}>
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <Typography>{t('descriptionLabel')}</Typography>
                            <TextField name="description" InputProps={{ sx: { height: 40 } }} onChange={addNew} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{t('priceLabel')}</Typography>
                            <TextField name="price" type="number" InputProps={{ sx: { height: 40 } }} onChange={addNew} />
                        </Box>
                        <Box>
                            <Typography>{t('pictureLabel')}</Typography>
                            <TextField
                                name="pic"
                                value={newProduct.pic}
                                InputProps={{ sx: { height: 40 } }}
                                onChange={addNew}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleImageUpload(e.target.files[0], (url) =>
                                            setNewProduct((prev) => ({ ...prev, pic: url }))
                                        );
                                    }
                                }}
                            />
                        </Box>
                        <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
                            {t('save')}
                        </Button>
                    </Box>
                )}
            </Box>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={closeSnack} severity={snack.severity} variant="filled">
                    {snack.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ProductManagerComp;
