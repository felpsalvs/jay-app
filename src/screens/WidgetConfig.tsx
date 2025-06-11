import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { BackButton } from '../components/BackButton';
import { Loading } from '../components/Loading';
import { WidgetHabit } from '../services/widgetService';
import { HabitTrackerWidgetPreview } from '../widgets/HabitTrackerWidget';
import { useWidgetHabits } from '../hooks/useWidgetHabits';

export function WidgetConfig() {
  const { habits, loading, addHabit, removeHabit } = useWidgetHabits();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleAddHabit = async () => {
    if (!newHabitTitle.trim()) {
      Alert.alert('Atenção', 'Digite um título para o hábito');
      return;
    }

    try {
      await addHabit(newHabitTitle.trim());
      setNewHabitTitle('');
      Alert.alert('Sucesso', 'Hábito adicionado ao widget!');
    } catch (error) {
      console.error('Erro ao adicionar hábito:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o hábito');
    }
  };

  const handleRemoveHabit = async (habitId: string) => {
    Alert.alert(
      'Remover Hábito',
      'Tem certeza que deseja remover este hábito do widget?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeHabit(habitId);
            } catch (error) {
              console.error('Erro ao remover hábito:', error);
              Alert.alert('Erro', 'Não foi possível remover o hábito');
            }
          }
        }
      ]
    );
  };

  const renderHabitItem = ({ item }: { item: WidgetHabit }) => (
    <View className="bg-zinc-800 rounded-lg p-4 mb-3 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white text-base font-medium">
          {item.title}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveHabit(item.id)}
        className="bg-red-600 rounded-lg px-3 py-2 ml-3"
      >
        <Text className="text-white text-sm font-medium">Remover</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Configurar Widget
        </Text>

        <Text className="text-zinc-400 text-base mt-2 mb-6">
          Configure quais hábitos aparecerão no seu widget Android
        </Text>

        {/* Adicionar Novo Hábito */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-3">
            Adicionar Novo Hábito
          </Text>

          <View className="bg-zinc-800 rounded-lg p-4 mb-3">
            <TextInput
              className="text-white text-base"
              placeholder="Digite o nome do hábito..."
              placeholderTextColor="#a1a1aa"
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
              maxLength={50}
            />
          </View>

          <TouchableOpacity
            onPress={handleAddHabit}
            className="bg-violet-600 rounded-lg p-4 items-center"
            disabled={!newHabitTitle.trim()}
          >
            <Text className="text-white font-semibold text-base">
              Adicionar Hábito
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Hábitos */}
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-3">
            Hábitos do Widget ({habits.length})
          </Text>

          {habits.length === 0 ? (
            <View className="bg-zinc-800 rounded-lg p-6 items-center">
              <Text className="text-zinc-400 text-center">
                Nenhum hábito configurado
              </Text>
              <Text className="text-zinc-500 text-center text-sm mt-1">
                Adicione hábitos para exibir no widget
              </Text>
            </View>
          ) : (
            <FlatList
              data={habits}
              renderItem={renderHabitItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Preview do Widget */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-lg font-semibold">
              Preview do Widget
            </Text>
            <TouchableOpacity
              onPress={() => setShowPreview(!showPreview)}
              className="bg-zinc-700 rounded-lg px-3 py-2"
            >
              <Text className="text-white text-sm">
                {showPreview ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {showPreview && (
            <View className="bg-zinc-800 rounded-lg p-4">
              <Text className="text-zinc-400 text-sm mb-3 text-center">
                Como ficará no seu Android
              </Text>
              <View style={{ height: 200 }}>
                <HabitTrackerWidgetPreview />
              </View>
            </View>
          )}
        </View>

        {/* Instruções */}
        <View className="bg-zinc-800 rounded-lg p-4">
          <Text className="text-white text-base font-semibold mb-2">
            Como usar o widget:
          </Text>
          <Text className="text-zinc-400 text-sm mb-2">
            • Configure seus hábitos acima
          </Text>
          <Text className="text-zinc-400 text-sm mb-2">
            • Adicione o widget à tela inicial do Android
          </Text>
          <Text className="text-zinc-400 text-sm mb-2">
            • Toque nos hábitos para marcá-los como concluídos
          </Text>
          <Text className="text-zinc-400 text-sm">
            • O progresso será sincronizado com o app principal
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}