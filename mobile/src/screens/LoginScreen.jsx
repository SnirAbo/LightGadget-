import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { userName, password });
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
        label="שם משתמש"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
        mode="outlined"
        textColor="#F8FAFC"
        outlineColor="#334155"
        activeOutlineColor="#3B82F6"
      />
      <TextInput
        label="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        textColor="#F8FAFC"
        outlineColor="#334155"
        activeOutlineColor="#3B82F6"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button} buttonColor="#3B82F6">
        כניסה
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Register')} textColor="#3B82F6">
        משתמש חדש? הירשם
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', padding: 24 },
  title: { color: '#F8FAFC', textAlign: 'center', marginBottom: 32, fontWeight: 'bold' },
  input: { marginBottom: 16, backgroundColor: '#1E293B' },
  button: { marginTop: 8, marginBottom: 8 },
});

export default LoginScreen;
