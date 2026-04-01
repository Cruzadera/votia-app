import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import api from '../services/api';
import { mockUsers } from '../data/mockUsers';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Answer'>;
  route: RouteProp<RootStackParamList, 'Answer'>;
};

const AnswerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, groupId, groupName, questionId, questionText, questionType } = route.params;
  const [answerText, setAnswerText] = useState('');
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleTarget = (selectedId: number) => {
    if (questionType === 'single') {
      setSelectedTargetIds([selectedId]);
      return;
    }
    setSelectedTargetIds((prev) =>
      prev.includes(selectedId) ? prev.filter((id) => id !== selectedId) : [...prev, selectedId]
    );
  };

  const submitAnswer = async () => {
    if (questionType === 'single' && selectedTargetIds.length !== 1) {
      Alert.alert('Selecciona', 'Debes elegir exactamente una persona.');
      return;
    }

    if (questionType === 'multiple' && selectedTargetIds.length === 0) {
      Alert.alert('Selecciona', 'Debes elegir al menos una persona.');
      return;
    }

    if (questionType === 'text' && !answerText.trim()) {
      Alert.alert('Texto requerido', 'Escribe una respuesta.');
      return;
    }

    setLoading(true);
    try {
      if (groupId === 999) {
        // Modo demo: no llamamos backend, solo navegamos a resultados
        navigation.replace('Results', { userId, groupId, groupName, questionText });
        return;
      }

      if (questionType === 'single' || questionType === 'multiple') {
        const targetAnswers = selectedTargetIds.map((targetId) => {
          const targetUser = mockUsers.find((u) => u.id === targetId);
          return {
            questionId,
            userFromId: userId,
            userTargetId: targetId,
            groupId,
            isAnonymous: anonymous,
            answerText: targetUser ? targetUser.name : 'Seleccionado',
            date: new Date().toISOString()
          };
        });

        for (const payload of targetAnswers) {
          await api.submitAnswer(payload);
        }
      } else {
        await api.submitAnswer({
          questionId,
          userFromId: userId,
          userTargetId: null,
          groupId,
          isAnonymous: anonymous,
          answerText: answerText.trim(),
          date: new Date().toISOString()
        });
      }

      navigation.replace('Results', { userId, groupId, groupName, questionText });
    } catch (error) {
      console.error('Error enviar respuesta', error);
      Alert.alert('Error', 'No se pudo enviar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const isSelectionMode = questionType === 'single' || questionType === 'multiple';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Responder</Text>
        <Text style={styles.subTitle}>{questionText}</Text>

        {isSelectionMode ? (
          <ScrollView style={styles.pickerContainer}>
            {mockUsers.map((user) => {
              const selected = selectedTargetIds.includes(user.id);
              return (
                <TouchableOpacity key={user.id} style={[styles.userItem, selected && styles.userItemSelected]} onPress={() => toggleTarget(user.id)}>
                  <Text style={[styles.userItemText, selected && styles.userItemTextSelected]}>{user.name}</Text>
                  <Text style={styles.checkMark}>{selected ? '✔' : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Escribe tu respuesta..."
            value={answerText}
            onChangeText={setAnswerText}
            multiline
            maxLength={500}
          />
        )}

        <View style={styles.row}>
          <Text>Responder de forma anónima</Text>
          <Switch value={anonymous} onValueChange={setAnonymous} />
        </View>

        <Button
          title={loading ? 'Enviando...' : isSelectionMode ? (questionType === 'single' ? 'Elegir y enviar' : 'Enviar selección') : 'Enviar respuesta'}
          onPress={submitAnswer}
          disabled={loading}
        />
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
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8
  },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 10, color: '#334175' },
  subTitle: { fontSize: 16, textAlign: 'center', marginBottom: 16, color: '#5f6a86' },
  input: { borderWidth: 1, borderColor: '#ccd2e5', borderRadius: 10, padding: 14, marginBottom: 12, textAlignVertical: 'top', minHeight: 110, backgroundColor: '#fafbff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pickerContainer: { maxHeight: 260, marginBottom: 16 },
  userItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#ccd2e5', borderRadius: 10, marginBottom: 8, backgroundColor: '#fff' },
  userItemSelected: { backgroundColor: '#e6f4ff', borderColor: '#6aa8ff' },
  userItemText: { fontSize: 16, color: '#2d3d6e' },
  userItemTextSelected: { fontWeight: '700', color: '#0f4bb5' },
  checkMark: { fontSize: 16, color: '#0f4bb5' }
});

export default AnswerScreen;
