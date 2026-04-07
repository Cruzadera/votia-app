import React, { useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/ui/AppShell';
import ProfileIconButton from '../components/ui/ProfileIconButton';
import FieldInput from '../components/ui/FieldInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import api from '../services/api';

type Props = {
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
  onPoll: (params: {
    token: string;
    pollId: string;
    userName?: string | null;
    avatarColor?: string | null;
    avatarImage?: string | null;
  }) => void;
  onBack: () => void;
  onProfile: () => void;
};

const GroupLobbyScreen: React.FC<Props> = ({
  token,
  userName,
  avatarColor,
  avatarImage,
  initialGroup,
  onPoll,
  onBack,
  onProfile
}) => {
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<{
    id: string;
    name: string;
    inviteCode: string;
    memberCount: number;
    pollReady: boolean;
  } | null>(initialGroup ?? null);

  useEffect(() => {
    setCreatedGroup(initialGroup ?? null);
  }, [initialGroup]);

  const handleCreate = async () => {
    if (!groupName.trim()) {
      Alert.alert('Grupo', 'Escribe un nombre para el grupo.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.createGroup(token, groupName.trim());
      setCreatedGroup({
        id: data.group.id,
        name: data.group.name,
        inviteCode: data.group.inviteCode,
        memberCount: data.memberCount,
        pollReady: data.pollReady
      });

      if (data.pollReady && data.poll) {
        onPoll({ token, pollId: data.poll.id, userName, avatarColor, avatarImage });
        return;
      }

      Alert.alert(
        'Grupo creado',
        `Comparte el código ${data.group.inviteCode}. La encuesta diaria se activará cuando haya al menos 2 personas.`
      );
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo crear el grupo.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Grupo', 'Introduce el código de invitación.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.joinGroup(token, inviteCode.trim());
      setCreatedGroup({
        id: data.group.id,
        name: data.group.name,
        inviteCode: data.group.inviteCode,
        memberCount: data.memberCount,
        pollReady: data.pollReady
      });

      if (data.pollReady && data.poll) {
        onPoll({ token, pollId: data.poll.id, userName, avatarColor, avatarImage });
        return;
      }

      Alert.alert('Grupo actualizado', 'Aún no hay suficientes personas para activar la encuesta diaria.');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo unir al grupo.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareGroup = async () => {
    if (!createdGroup) {
      return;
    }

    try {
      await Share.share({
        message: `Únete al grupo "${createdGroup.name}" con este código: ${createdGroup.inviteCode}`
      });
    } catch (error) {
      Alert.alert('Compartir', 'No se pudo abrir el panel de compartir.');
    }
  };

  return (
    <AppShell
      eyebrow={initialGroup ? 'Grupo' : 'Nuevo grupo'}
      title={initialGroup ? initialGroup.name : (userName ? `Hola ${userName}` : 'Tu grupo')}
      subtitle={
        initialGroup
          ? initialGroup.pollReady
            ? 'Este grupo ya tiene encuesta activa.'
            : 'Invita a más personas para activar la encuesta diaria.'
          : 'Crea un grupo nuevo o únete a uno existente con un código.'
      }
      headerAction={<ProfileIconButton name={userName} avatarColor={avatarColor} avatarImage={avatarImage} onPress={onProfile} />}
    >
      {/* Vista de grupo existente (llegando desde GroupList) */}
      {createdGroup ? (
        <>
          <View style={styles.shareCard}>
            <Text style={styles.shareCodeLabel}>Código de invitación</Text>
            <Text style={styles.shareCode}>{createdGroup.inviteCode}</Text>
            <Text style={styles.shareHint}>
              {createdGroup.pollReady
                ? `Encuesta activa · ${createdGroup.memberCount} miembros`
                : `${createdGroup.memberCount} ${createdGroup.memberCount === 1 ? 'miembro' : 'miembros'} · necesita al menos 2`}
            </Text>
            <PrimaryButton title="Compartir código de invitación" onPress={handleShareGroup} />
          </View>

          <PrimaryButton
            title="Volver a mis grupos"
            onPress={onBack}
            variant="secondary"
            style={styles.backButton}
          />
        </>
      ) : null}

      {/* Vista de crear/unirse (sin grupo seleccionado) */}
      {!createdGroup ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crear grupo</Text>
            <FieldInput
              label="Nombre del grupo"
              placeholder="Ej. Piso, amigos, oficina"
              value={groupName}
              onChangeText={setGroupName}
            />
            <PrimaryButton title={loading ? 'Creando...' : 'Crear grupo'} onPress={handleCreate} loading={loading} />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unirse con código</Text>
            <FieldInput
              label="Código"
              placeholder="ABC123"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <PrimaryButton
              title={loading ? 'Uniéndote...' : 'Unirse al grupo'}
              onPress={handleJoin}
              variant="secondary"
              loading={loading}
              disabled={!inviteCode.trim()}
            />
          </View>

          <PrimaryButton
            title="Volver a mis grupos"
            onPress={onBack}
            variant="secondary"
            style={styles.backButton}
          />
        </>
      ) : null}
    </AppShell>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 8
  },
  sectionTitle: {
    marginBottom: 14,
    fontSize: 18,
    fontWeight: '800',
    color: '#11182c'
  },
  divider: {
    height: 1,
    backgroundColor: '#dde4f7',
    marginVertical: 18
  },
  shareCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    marginBottom: 16
  },
  shareCodeLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#607095',
    marginBottom: 6
  },
  shareCode: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#16203a',
    marginBottom: 8
  },
  shareHint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5e6983',
    marginBottom: 16
  },
  backButton: {
    marginTop: 10
  }
});

export default GroupLobbyScreen;
