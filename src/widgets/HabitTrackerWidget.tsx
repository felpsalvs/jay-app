import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { useWidgetHabits } from '../hooks/useWidgetHabits';

interface HabitTrackerWidgetProps {
  onHabitToggle?: (habitId: string) => void;
}

const MAX_HABITS_DISPLAY = 3;

export function HabitTrackerWidget({ onHabitToggle }: HabitTrackerWidgetProps) {
  const { habits, loading, progress, toggleHabit } = useWidgetHabits();

  const today = dayjs().format('DD/MM');
  const dayOfWeek = dayjs().format('dddd');

  const handleHabitToggle = async (habitId: string) => {
    await toggleHabit(habitId);
    onHabitToggle?.(habitId);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-zinc-700';
    if (percentage < 20) return 'bg-violet-900';
    if (percentage < 40) return 'bg-violet-800';
    if (percentage < 60) return 'bg-violet-700';
    if (percentage < 80) return 'bg-violet-600';
    return 'bg-violet-500';
  };

  if (loading) {
    return (
      <View className="bg-zinc-900 rounded-xl p-4 flex-1 justify-center items-center">
        <Text className="text-zinc-400 text-sm">Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="bg-zinc-900 rounded-xl p-4 flex-1">
      {/* Header */}
      <View className="mb-3">
        <Text className="text-zinc-400 text-xs font-semibold uppercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white text-lg font-bold">
          {today}
        </Text>
      </View>

      {/* Progress Indicator */}
      <View className="mb-4 relative">
        <View className="bg-zinc-700 h-2 rounded-full" />
        <View
          className={clsx(
            'h-2 rounded-full absolute top-0 left-0',
            getProgressColor(progress.percentage)
          )}
          style={{ width: `${progress.percentage}%` }}
        />
        <Text className="text-zinc-400 text-xs mt-1">
          {progress.completed}/{progress.total} hábitos
        </Text>
      </View>

      {/* Habits List */}
      <View className="flex-1">
        {habits.slice(0, MAX_HABITS_DISPLAY).map((habit) => (
          <TouchableOpacity
            key={habit.id}
            onPress={() => handleHabitToggle(habit.id)}
            className="flex-row items-center mb-2 p-2 rounded-lg bg-zinc-800 active:bg-zinc-700"
          >
            <View className={clsx(
              'w-4 h-4 rounded border-2 mr-3 justify-center items-center',
              habit.completed
                ? 'bg-violet-500 border-violet-500'
                : 'border-zinc-500'
            )}>
              {habit.completed && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </View>
            <Text className={clsx(
              'flex-1 text-sm',
              habit.completed
                ? 'text-zinc-400 line-through'
                : 'text-white'
            )}>
              {habit.title}
            </Text>
          </TouchableOpacity>
        ))}

        {habits.length > MAX_HABITS_DISPLAY && (
          <Text className="text-zinc-500 text-xs text-center mt-2">
            +{habits.length - MAX_HABITS_DISPLAY} mais
          </Text>
        )}

        {habits.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-zinc-500 text-center text-sm">
              Nenhum hábito configurado
            </Text>
            <Text className="text-zinc-600 text-center text-xs mt-1">
              Configure seus hábitos no app principal
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Componente de preview para desenvolvimento e configuração
export function HabitTrackerWidgetPreview() {
  return (
    <View className="border-2 border-zinc-600 rounded-xl" style={{ height: 180 }}>
      <HabitTrackerWidget />
    </View>
  );
}

// Exportar também uma versão para uso futuro em widgets nativos
export default HabitTrackerWidget;