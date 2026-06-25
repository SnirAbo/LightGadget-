import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';

const AccountScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    userName: currentUser?.userName || '',
    password: '',
  });

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleSave = async () => {
    try {
      await api.put(`/users/${currentUser._id}`, form);
      const updated = { ...currentUser, ...form };
      dispatch({ type: 'LOGIN_USER', payload: updated });
      await SecureStore.setItemAsync('user', JSON.stringify(updated));
      Alert.alert('הצלחה', 'המשתמש עודכן!');
    } catch {
      Alert.alert('שגיאה', 'שגיאה בעדכון המשתמש');
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    dispatch({ type: 'LOGOUT_USER' });
  };

  if (!currentUser) {
    return (
      <View style={styles.notLoggedIn}>
        <Text variant="headlineSmall" style={styles.heading}>ברוך הבא!</Text>
        <Text style={styles.subText}>התחבר כדי לגשת לחשבון שלך</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Login')} buttonColor="#3B82F6" style={styles.btn}>
          כניסה
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Register')} textColor="#3B82F6" style={styles.btn}>
          הרשמה
        </Button>
      </View>
    );
  }

  const inputProps = {
    mode: 'outlined',
    textColor: '#F8FAFC',
    outlineColor: '#334155',
    activeOutlineColor: '#3B82F6',
    style: styles.input,
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        שלום, {currentUser.firstName}
      </Text>
      <TextInput label="שם פרטי" value={form.firstName} onChangeText={set('firstName')} {...inputProps} />
      <TextInput label="שם משפחה" value={form.lastName} onChangeText={set('lastName')} {...inputProps} />
      <TextInput label="שם משתמש" value={form.userName} onChangeText={set('userName')} {...inputProps} />
      <TextInput label="סיסמה חדשה" value={form.password} onChangeText={set('password')} secureTextEntry {...inputProps} />
      <Button mode="contained" onPress={handleSave} buttonColor="#3B82F6" style={styles.btn}>
        שמור
      </Button>
      <Button mode="outlined" onPress={handleLogout} textColor="#EF4444" style={styles.btn}>
        התנתק
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24 },
  notLoggedIn: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  heading: { color: '#F8FAFC', fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  subText: { color: '#94A3B8', marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 16, backgroundColor: '#1E293B' },
  btn: { marginBottom: 12 },
});

export default AccountScreen;
