import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import api from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DailyQuestion'>;
  route: RouteProp<RootStackParamList, 'DailyQuestion'>;
};

const DailyQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, groupId, groupName } = route.params;
  const [question, setQuestion] = useState('Cargando pregunta...');
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<'single' | 'multiple' | 'text'>('text');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestion = async () => {
      if (groupId === 999) {
        // Modo demo offline
        setQuestionId(999);
        setQuestion('¿Quién es el/la más divertido/a del grupo?');
        setQuestionType('multiple');
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.getDailyQuestion(groupId);
        setQuestionId(data.question?.id || 0);
        setQuestion(data.question?.text || 'No hay pregunta diaria aún');
        const rawType = data.question?.tipoSeleccion || 'text';
        setQuestionType(rawType === 'single' || rawType === 'multiple' ? rawType : 'text');
      } catch (error) {
        console.error('Error pregunta diaria', error);
        Alert.alert('Error', 'No se pudo obtener la pregunta diaria');
        setQuestion('No hay pregunta diaria aún');
        setQuestionType('text');
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [groupId]);

  const goAnswer = () => {
    if (!questionId) {
      Alert.alert('Espera', 'No hay pregunta disponible aún');
      return;
    }
    const type = (questionType === 'single' || questionType === 'multiple') ? questionType : 'text';
    navigation.navigate('Answer', { userId, groupId, groupName, questionId, questionText: question, questionType: type });
  };

  const goResults = () => navigation.navigate('Results', { userId, groupId, groupName });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{groupName}</Text>
        <Text style={styles.subTitle}>Pregunta del día</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4f6cff" />
        ) : (
          <>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.questionType}>Tipo: {questionType}</Text>
          </>
        )}
        <View style={styles.buttonArea}>
          <Button title="Responder" onPress={goAnswer} disabled={loading || !questionId} />
        </View>
        <View style={styles.buttonArea}>
          <Button title="Ver resultados" onPress={goResults} color="#5863ff" />
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
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8
  },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: '#334175' },
  subTitle: { fontSize: 16, textAlign: 'center', marginBottom: 16, color: '#5f6a86' },
  question: { fontSize: 18, textAlign: 'center', marginBottom: 8, color: '#24335f' },
  questionType: { fontSize: 14, color: '#586a96', textAlign: 'center', marginBottom: 16 },
  buttonArea: { marginTop: 10 }
});

export default DailyQuestionScreen;
