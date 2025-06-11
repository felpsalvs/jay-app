import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

export interface WidgetHabit {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export interface HabitProgress {
  habitId: string;
  date: string;
  completed: boolean;
}

const WIDGET_HABITS_KEY = '@habit_tracker:widget_habits';
const WIDGET_PROGRESS_KEY = '@habit_tracker:widget_progress';

export class WidgetService {
  /**
   * Busca os hábitos configurados para o widget
   */
  static async getWidgetHabits(): Promise<WidgetHabit[]> {
    try {
      const stored = await AsyncStorage.getItem(WIDGET_HABITS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Se não há hábitos salvos, retorna hábitos padrão
      const defaultHabits: WidgetHabit[] = [
        { id: '1', title: 'Beber 2L de água', completed: false, date: dayjs().format('YYYY-MM-DD') },
        { id: '2', title: 'Exercitar-se', completed: false, date: dayjs().format('YYYY-MM-DD') },
        { id: '3', title: 'Meditar', completed: false, date: dayjs().format('YYYY-MM-DD') },
      ];

      await this.saveWidgetHabits(defaultHabits);
      return defaultHabits;
    } catch (error) {
      console.error('Erro ao buscar hábitos do widget:', error);
      return [];
    }
  }

  /**
   * Salva os hábitos configurados para o widget
   */
  static async saveWidgetHabits(habits: WidgetHabit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(WIDGET_HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Erro ao salvar hábitos do widget:', error);
    }
  }

  /**
   * Busca os hábitos do dia atual
   */
  static async getTodayHabits(): Promise<WidgetHabit[]> {
    const today = dayjs().format('YYYY-MM-DD');
    const habits = await this.getWidgetHabits();
    const progress = await this.getHabitProgress(today);

    return habits.map(habit => ({
      ...habit,
      date: today,
      completed: progress.find(p => p.habitId === habit.id)?.completed || false,
    }));
  }

  /**
   * Marca/desmarca um hábito como concluído
   */
  static async toggleHabit(habitId: string): Promise<void> {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const progress = await this.getHabitProgress(today);

      const existingProgress = progress.find(p => p.habitId === habitId);

      if (existingProgress) {
        existingProgress.completed = !existingProgress.completed;
      } else {
        progress.push({
          habitId,
          date: today,
          completed: true,
        });
      }

      await this.saveHabitProgress(today, progress);

      // Tentar sincronizar com o servidor
      await this.syncWithServer(habitId, today,
        progress.find(p => p.habitId === habitId)?.completed || false
      );
    } catch (error) {
      console.error('Erro ao alternar hábito:', error);
    }
  }

  /**
   * Busca o progresso dos hábitos para uma data específica
   */
  static async getHabitProgress(date: string): Promise<HabitProgress[]> {
    try {
      const key = `${WIDGET_PROGRESS_KEY}:${date}`;
      const stored = await AsyncStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao buscar progresso dos hábitos:', error);
      return [];
    }
  }

  /**
   * Salva o progresso dos hábitos para uma data específica
   */
  static async saveHabitProgress(date: string, progress: HabitProgress[]): Promise<void> {
    try {
      const key = `${WIDGET_PROGRESS_KEY}:${date}`;
      await AsyncStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
      console.error('Erro ao salvar progresso dos hábitos:', error);
    }
  }

  /**
   * Sincroniza com o servidor (quando disponível)
   */
  static async syncWithServer(habitId: string, date: string, completed: boolean): Promise<void> {
    try {
      // Implementar sincronização com a API quando estiver disponível
      await api.post('/habits/toggle', {
        habitId,
        date,
        completed,
      });
    } catch (error) {
      console.log('Sincronização com servidor falhada, dados salvos localmente');
    }
  }

  /**
   * Calcula a porcentagem de progresso do dia
   */
  static async getTodayProgress(): Promise<{ completed: number; total: number; percentage: number }> {
    const todayHabits = await this.getTodayHabits();
    const completed = todayHabits.filter(h => h.completed).length;
    const total = todayHabits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  /**
   * Adiciona um novo hábito ao widget
   */
  static async addWidgetHabit(title: string): Promise<void> {
    try {
      const habits = await this.getWidgetHabits();
      const newHabit: WidgetHabit = {
        id: Date.now().toString(),
        title,
        completed: false,
        date: dayjs().format('YYYY-MM-DD'),
      };

      habits.push(newHabit);
      await this.saveWidgetHabits(habits);
    } catch (error) {
      console.error('Erro ao adicionar hábito ao widget:', error);
    }
  }

  /**
   * Remove um hábito do widget
   */
  static async removeWidgetHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getWidgetHabits();
      const filteredHabits = habits.filter(h => h.id !== habitId);
      await this.saveWidgetHabits(filteredHabits);
    } catch (error) {
      console.error('Erro ao remover hábito do widget:', error);
    }
  }
}