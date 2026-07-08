import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import api from '../api/api';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', userName: '', password: '' });

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.userName || !form.password) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות');
      return;
    }
    try {
      await api.post('/auth/register', form);
      Alert.alert('הצלחה', 'נרשמת בהצלחה!');
      navigation.navigate('Login');
    } catch {
      Alert.alert('שגיאה', 'שגיאה בהרשמה');
    }
  };

  const inputProps = {
    mode: 'outlined',
    textColor: '#1A1A1A',
    outlineColor: '#E5E7EB',
    activeOutlineColor: '#FF6B00',
    style: styles.input,
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>הרשמה</Text>
      <TextInput label="שם פרטי" value={form.firstName} onChangeText={set('firstName')} {...inputProps} />
      <TextInput label="שם משפחה" value={form.lastName} onChangeText={set('lastName')} {...inputProps} />
      <TextInput label="אימייל" value={form.email} onChangeText={set('email')} keyboardType="email-address" {...inputProps} />
      <TextInput label="שם משתמש" value={form.userName} onChangeText={set('userName')} {...inputProps} />
      <TextInput label="סיסמה" value={form.password} onChangeText={set('password')} secureTextEntry {...inputProps} />
      <Button mode="contained" onPress={handleRegister} style={styles.button} buttonColor="#FF6B00">
        הרשמה
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Login')} textColor="#FF6B00">
        כבר יש לך חשבון? התחבר
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', padding: 24 },
  title: { color: '#1A1A1A', textAlign: 'center', marginBottom: 32, fontWeight: 'bold' },
  input: { marginBottom: 16, backgroundColor: '#F8F9FA' },
  button: { marginTop: 8, marginBottom: 8 },
});

export default RegisterScreen;
