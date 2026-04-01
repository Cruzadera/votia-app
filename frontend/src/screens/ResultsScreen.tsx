import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import api from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

type Voter = { name: string; avatar: string };

type RankingItem = { name: string; score: number; voters: Voter[] };

const COLORS = ['#ffc107', '#ff6b6b', '#6f42c1', '#4f6cff', '#20c997', '#fd7e14'];

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fff&color=374151&rounded=true&size=64`;

const ResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, groupId, groupName, questionText } = route.params;
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (groupId === 999) {
          setRankings([
            {
              name: 'Adrian',
              score: 23,
              voters: [
                { name: 'Dani', avatar: getAvatarUrl('Dani') },
                { name: 'El cojo', avatar: getAvatarUrl('El cojo') },
                { name: 'Marco', avatar: getAvatarUrl('Marco') }
              ]
            },
            {
              name: 'Dani',
              score: 23,
              voters: [
                { name: 'Adrian', avatar: getAvatarUrl('Adrian') },
                { name: 'Virgi', avatar: getAvatarUrl('Virgi') },
                { name: 'Elena', avatar: getAvatarUrl('Elena') }
              ]
            },
            {
              name: 'El cojo',
              score: 23,
              voters: [
                { name: 'Adrian', avatar: getAvatarUrl('Adrian') },
                { name: 'Marco', avatar: getAvatarUrl('Marco') },
                { name: 'Dani', avatar: getAvatarUrl('Dani') }
              ]
            },
            {
              name: 'Marco',
              score: 15,
              voters: [
                { name: 'Virgi', avatar: getAvatarUrl('Virgi') },
                { name: 'Elena', avatar: getAvatarUrl('Elena') }
              ]
            },
            {
              name: 'Virgi',
              score: 7,
              voters: [{ name: 'Dani', avatar: getAvatarUrl('Dani') }]
            },
            {
              name: 'Elena',
              score: 7,
              voters: [{ name: 'Adrian', avatar: getAvatarUrl('Adrian') }]
            }
          ]);
          return;
        }

        const { data } = await api.getResults(groupId);
        setRankings(data.ranking || []);
      } catch (error) {
        console.error('Error resultados', error);
        Alert.alert('Error', 'No se pudieron obtener los resultados del grupo');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [groupId]);

  const totalScore = rankings.reduce((sum, item) => sum + item.score, 0);
  const filledCount = rankings.length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{questionText || 'Resultados de la pregunta'}</Text>
        <Text style={styles.subTitle}>{groupName}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4f6cff" />
        ) : (
          <>
            <Text style={styles.infoText}>Han respondido {filledCount} participantes</Text>
            <ScrollView style={styles.scrollArea}>
              {rankings.length > 0 ? (
                rankings.map((item, index) => {
                  const percent = totalScore > 0 ? Math.round((item.score / totalScore) * 100) : 0;
                  const barColor = COLORS[index % COLORS.length];

                  return (
                    <View key={item.name} style={styles.optionRow}>
                      <View style={styles.progressBackground}>
                        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: barColor }]} />
                      </View>

                      <View style={styles.optionDetail}>
                        <View style={styles.optionLabelRow}>
                          <Text style={styles.optionName}>{item.name}</Text>
                          <Text style={styles.percentText}>{percent}%</Text>
                        </View>
                        <Text style={styles.optionSubText}>{item.score} votos</Text>

                        <View style={styles.voterRow}>
                          {item.voters.slice(0, 4).map((voter, vi) => (
                            <Image key={`${item.name}-${vi}`} source={{ uri: voter.avatar }} style={[styles.voterAvatar, { marginLeft: vi === 0 ? 0 : -10 }]} />
                          ))}
                          {item.voters.length > 4 && (
                            <View style={styles.moreVotesBadge}>
                              <Text style={styles.moreVotesText}>+{item.voters.length - 4}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>Aún no se han registrado respuestas</Text>
              )}
            </ScrollView>

            <View style={styles.commentPlaceholder}>
              <Text style={styles.commentPlaceholderText}>Sección de comentarios disponible pronto...</Text>
            </View>

            <View style={styles.buttonArea}>
              <Button
                title="Volver a pregunta"
                onPress={() => navigation.navigate('DailyQuestion', { userId, groupId, groupName })}
                color="#5863ff"
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: '#eff3ff' },
  card: {
    width: '96%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 10,
    maxHeight: '96%'
  },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: '#334175' },
  subTitle: { fontSize: 16, textAlign: 'center', marginBottom: 10, color: '#5f6a86' },
  infoText: { fontSize: 14, color: '#5f6a86', marginBottom: 12, textAlign: 'center' },
  scrollArea: { maxHeight: 360 },
  optionRow: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: '#f6f8ff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e3e8f9'
  },
  progressBackground: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#eef3ff',
    marginBottom: 8,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 14
  },
  optionDetail: { marginTop: -52, paddingTop: 10 },
  optionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionName: { color: '#1b2766', fontWeight: 'bold', fontSize: 16 },
  percentText: { color: '#1b2766', fontWeight: '700', fontSize: 14, backgroundColor: '#ffffffc8', paddingHorizontal: 8, borderRadius: 10 },
  optionSubText: { marginTop: 4, color: '#3f557d', fontSize: 13 },
  voterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  voterAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.4, borderColor: '#fff' },
  moreVotesBadge: {
    marginLeft: 8,
    backgroundColor: '#dbe7ff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  moreVotesText: { fontSize: 12, fontWeight: '700', color: '#3751a6' },
  emptyText: { color: '#51618f', textAlign: 'center', paddingVertical: 24 },
  commentPlaceholder: { marginTop: 12, padding: 10, borderWidth: 1, borderColor: '#d2daf0', borderRadius: 10, backgroundColor: '#f6f8ff' },
  commentPlaceholderText: { textAlign: 'center', color: '#586b90', fontSize: 13 },
  buttonArea: { marginTop: 14 }
});

export default ResultsScreen;
