import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ActivityIndicator, RefreshControl, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/ui/AppShell';
import PrimaryButton from '../components/ui/PrimaryButton';
import ProfileIconButton from '../components/ui/ProfileIconButton';
import api, { GroupSummary } from '../services/api';

type Props = {
  token: string;
  userName?: string | null;
  avatarColor?: string | null;
  avatarImage?: string | null;
  onGroupLobby: (params: {
    token: string;
    userName?: string | null;
    avatarColor?: string | null;
    avatarImage?: string | null;
    initialGroup?: {
      id: string;
      name: string;
      inviteCode: string;
      memberCount: number;
      pollReady: boolean;
    };
  }) => void;
  onPoll: (params: {
    token: string;
    pollId: string;
    userName?: string | null;
    avatarColor?: string | null;
    avatarImage?: string | null;
  }) => void;
  onProfile: () => void;
};

const GroupListScreen: React.FC<Props> = ({
  token,
  userName,
  avatarColor,
  avatarImage,
  onGroupLobby,
  onPoll,
  onProfile
}) => {
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGroups = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await api.listGroups(token);
      setGroups(data.groups);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo cargar la lista de grupos.';
      Alert.alert('Grupos', message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleOpenGroup = async (group: GroupSummary) => {
    try {
      const { data } = await api.joinGroup(token, group.inviteCode);

      if (data.pollReady && data.poll) {
        onPoll({
          token,
          pollId: data.poll.id,
          userName,
          avatarColor,
          avatarImage
        });
        return;
      }

      onGroupLobby({
        token,
        userName,
        avatarColor,
        avatarImage,
        initialGroup: {
          id: data.group.id,
          name: data.group.name,
          inviteCode: data.group.inviteCode,
          memberCount: data.memberCount,
          pollReady: data.pollReady
        }
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo abrir el grupo.';
      Alert.alert('Grupo', message);
    }
  };

  return (
    <AppShell
      eyebrow="Mis grupos"
      title={userName ? `Hola, ${userName}` : 'Mis grupos'}
      subtitle="Toca un grupo para entrar en su encuesta diaria."
      headerAction={<ProfileIconButton name={userName} avatarColor={avatarColor} avatarImage={avatarImage} onPress={onProfile} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => loadGroups(true)} />
      }
    >
      {loading ? (
        <ActivityIndicator size="large" color="#4f6cff" style={styles.loader} />
      ) : null}

      {!loading && groups.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Aún no tienes grupos</Text>
          <Text style={styles.emptyText}>Crea tu primer grupo o únete con un código de invitación.</Text>
        </View>
      ) : null}

      {groups.map((group) => (
        <View key={group.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.groupName}>{group.name}</Text>
            <View style={[styles.badge, group.pollReady ? styles.badgeReady : styles.badgeWaiting]}>
              <Text style={[styles.badgeText, group.pollReady ? styles.badgeTextReady : styles.badgeTextWaiting]}>
                {group.pollReady ? 'Lista' : 'Esperando'}
              </Text>
            </View>
          </View>
          <Text style={styles.groupMeta}>{group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'} · {group.inviteCode}</Text>
          {!group.pollReady ? (
            <Text style={styles.groupStatus}>Necesita al menos 2 miembros para activar la encuesta.</Text>
          ) : null}
          <PrimaryButton
            title={group.pollReady ? 'Entrar a la encuesta' : 'Invitar personas'}
            onPress={() => handleOpenGroup(group)}
            style={styles.cardButton}
          />
        </View>
      ))}

      <View style={styles.footer}>
        <PrimaryButton
          title="Crear o unirme a otro grupo"
          onPress={() => onGroupLobby({ token, userName, avatarColor, avatarImage })}
          variant="secondary"
        />
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginVertical: 32
  },
  card: {
    backgroundColor: '#eef2ff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  cardButton: {
    marginTop: 12
  },
  groupName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#13203a',
    flexShrink: 1,
    marginRight: 8
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10
  },
  badgeReady: {
    backgroundColor: '#dcfce7'
  },
  badgeWaiting: {
    backgroundColor: '#fef9c3'
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  badgeTextReady: {
    color: '#166534'
  },
  badgeTextWaiting: {
    color: '#713f12'
  },
  groupMeta: {
    fontSize: 13,
    color: '#4d5a79',
    marginBottom: 2
  },
  groupStatus: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: '#5e6983'
  },
  emptyCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#7c2d12',
    marginBottom: 6
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#9a3412'
  },
  footer: {
    marginTop: 8
  }
});

export default GroupListScreen;
