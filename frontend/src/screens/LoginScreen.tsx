import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import api from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.login(name);
      const userId = data.id;
      navigation.replace('Group', { userId, userName: name });
    } catch (error) {
      console.error('Error login', error);
      Alert.alert('Error', 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    navigation.replace('Group', { userId: 999, userName: 'DemoUsuario' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>AskUs Daily</Text>
        <TextInput style={styles.input} placeholder="Tu nombre" value={name} onChangeText={setName} />
        <Button title={loading ? 'Cargando...' : 'Empezar'} onPress={handleLogin} disabled={!name.trim() || loading} />
        <View style={styles.buttonSpace}>
          <Button title="Entrar demo (sin API)" onPress={handleDemo} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f3f6ff'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#334175'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#fafbff'
  },
  buttonSpace: {
    marginTop: 10
  }
});

export default LoginScreen;
