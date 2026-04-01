import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import api from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Group'>;
  route: RouteProp<RootStackParamList, 'Group'>;
};

const GroupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, userName } = route.params;
  const [groupCode, setGroupCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const goToDailyQuestion = (groupId: number, groupNameValue: string) => {
    navigation.navigate('DailyQuestion', { userId, groupId, groupName: groupNameValue });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Valida', 'Ingresa nombre de grupo');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.createGroup(groupName.trim());
      goToDailyQuestion(data.id, data.name);
    } catch (error) {
      console.error('Error crear grupo', error);
      Alert.alert('Error', 'No se pudo crear grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      Alert.alert('Valida', 'Ingresa código de grupo');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.joinGroup(groupCode.trim());
      goToDailyQuestion(data.id, data.name);
    } catch (error) {
      console.error('Error unirse grupo', error);
      Alert.alert('Error', 'No se pudo unir al grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGroup = () => {
    goToDailyQuestion(999, 'Grupo Demo');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Hola {userName}</Text>
        <Text style={styles.subtitle}>Selecciona o crea un grupo</Text>
        <TextInput style={styles.input} placeholder="Nombre del grupo" value={groupName} onChangeText={setGroupName} />
        <Button title={loading ? 'Cargando...' : 'Crear grupo'} onPress={handleCreateGroup} disabled={loading} />
        <Text style={styles.or}>o</Text>
        <TextInput style={styles.input} placeholder="Código de invitación" value={groupCode} onChangeText={setGroupCode} />
        <Button title={loading ? 'Cargando...' : 'Unirse a grupo'} onPress={handleJoinGroup} disabled={loading || !groupCode.trim()} />
        <View style={styles.buttonSpace}>
          <Button title="Usar Grupo Demo (sin API)" onPress={handleDemoGroup} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f3f6ff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8
  },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: '#334175' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 16, color: '#5f6a86' },
  input: { borderWidth: 1, borderColor: '#ccd2e5', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#fafbff' },
  or: { textAlign: 'center', marginVertical: 8, color: '#6f7b9a' },
  buttonSpace: { marginTop: 12 }
});

export default GroupScreen;
