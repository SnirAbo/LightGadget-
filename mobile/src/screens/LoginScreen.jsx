import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_USER', payload: user });
      navigation.navigate('Main');
    } catch {
      Alert.alert('שגיאה', 'שם משתמש או סיסמה שגויים');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>GadgetLight</Text>
      <TextInput
        label="אימייל"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        textColor="#1A1A1A"
        outlineColor="#E5E7EB"
        activeOutlineColor="#FF6B00"
      />
      <TextInput
        label="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        textColor="#1A1A1A"
        outlineColor="#E5E7EB"
        activeOutlineColor="#FF6B00"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button} buttonColor="#FF6B00">
        כניסה
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Register')} textColor="#FF6B00">
        משתמש חדש? הירשם
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

export default LoginScreen;
