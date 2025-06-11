import { useState, useEffect, useCallback } from 'react';
import { WidgetService, WidgetHabit } from '../services/widgetService';

interface UseWidgetHabitsReturn {
  habits: WidgetHabit[];
  loading: boolean;
  refreshing: boolean;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  toggleHabit: (habitId: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  addHabit: (title: string) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
}

export function useWidgetHabits(): UseWidgetHabitsReturn {
  const [habits, setHabits] = useState<WidgetHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  const loadHabits = useCallback(async () => {
    try {
      const todayHabits = await WidgetService.getTodayHabits();
      setHabits(todayHabits);

      const progressData = await WidgetService.getTodayProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshHabits = useCallback(async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  }, [loadHabits]);

  const toggleHabit = useCallback(async (habitId: string) => {
    try {
      // Atualizar estado local imediatamente para feedback visual
      setHabits(prev =>
        prev.map(habit =>
          habit.id === habitId
            ? { ...habit, completed: !habit.completed }
            : habit
        )
      );

      // Atualizar progresso localmente
      const updatedHabits = habits.map(habit =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed }
          : habit
      );

      const completed = updatedHabits.filter(h => h.completed).length;
      const total = updatedHabits.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      setProgress({ completed, total, percentage });

      // Salvar no armazenamento
      await WidgetService.toggleHabit(habitId);
    } catch (error) {
      console.error('Erro ao alternar hábito:', error);
      // Recarregar dados em caso de erro
      await loadHabits();
    }
  }, [habits, loadHabits]);

  const addHabit = useCallback(async (title: string) => {
    try {
      await WidgetService.addWidgetHabit(title);
      await loadHabits();
    } catch (error) {
      console.error('Erro ao adicionar hábito:', error);
      throw error;
    }
  }, [loadHabits]);

  const removeHabit = useCallback(async (habitId: string) => {
    try {
      await WidgetService.removeWidgetHabit(habitId);
      await loadHabits();
    } catch (error) {
      console.error('Erro ao remover hábito:', error);
      throw error;
    }
  }, [loadHabits]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return {
    habits,
    loading,
    refreshing,
    progress,
    toggleHabit,
    refreshHabits,
    addHabit,
    removeHabit,
  };
}