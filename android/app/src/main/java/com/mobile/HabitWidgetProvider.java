package com.mobile;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Widget provider para o Rastreador de Hábitos
 * Este arquivo seria necessário para implementar um widget Android nativo
 */
public class HabitWidgetProvider extends AppWidgetProvider {

    private static final String HABIT_TOGGLE_ACTION = "com.mobile.HABIT_TOGGLE";
    private static final String EXTRA_HABIT_ID = "habit_id";
    private static final String PREFS_NAME = "HabitWidgetPrefs";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (HABIT_TOGGLE_ACTION.equals(intent.getAction())) {
            String habitId = intent.getStringExtra(EXTRA_HABIT_ID);
            toggleHabit(context, habitId);

            // Atualizar todos os widgets
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
                new android.content.ComponentName(context, HabitWidgetProvider.class)
            );
            onUpdate(context, appWidgetManager, appWidgetIds);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.habit_widget_layout);

        // Atualizar data
        updateDate(views);

        // Carregar e exibir hábitos
        loadHabits(context, views);

        // Configurar cliques nos hábitos
        setupHabitClicks(context, views, appWidgetId);

        // Configurar clique para abrir o app
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static void updateDate(RemoteViews views) {
        SimpleDateFormat dayFormat = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM", new Locale("pt", "BR"));

        Date today = new Date();
        views.setTextViewText(R.id.day_of_week, dayFormat.format(today).toUpperCase());
        views.setTextViewText(R.id.date, dateFormat.format(today));
    }

    private static void loadHabits(Context context, RemoteViews views) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        // Exemplo: carregar 3 hábitos principais
        String[] habitIds = {"1", "2", "3"};
        String[] habitTitles = {
            "Beber 2L de água",
            "Exercitar-se",
            "Meditar"
        };

        int[] habitLayouts = {R.id.habit_1, R.id.habit_2, R.id.habit_3};
        int[] habitCheckboxes = {R.id.habit_1_checkbox, R.id.habit_2_checkbox, R.id.habit_3_checkbox};
        int[] habitTexts = {R.id.habit_1_title, R.id.habit_2_title, R.id.habit_3_title};

        int completedHabits = 0;

        for (int i = 0; i < habitIds.length; i++) {
            String habitKey = "habit_" + habitIds[i] + "_completed";
            boolean isCompleted = prefs.getBoolean(habitKey, false);

            views.setTextViewText(habitTexts[i], habitTitles[i]);
            views.setInt(habitCheckboxes[i], "setVisibility",
                isCompleted ? android.view.View.VISIBLE : android.view.View.GONE);

            if (isCompleted) completedHabits++;
        }

        // Atualizar progresso
        int progress = (completedHabits * 100) / habitIds.length;
        views.setProgressBar(R.id.progress_bar, 100, progress, false);
        views.setTextViewText(R.id.progress_text,
            String.format(new Locale("pt", "BR"), "%d/%d hábitos", completedHabits, habitIds.length));
    }

    private static void setupHabitClicks(Context context, RemoteViews views, int appWidgetId) {
        String[] habitIds = {"1", "2", "3"};
        int[] habitLayouts = {R.id.habit_1, R.id.habit_2, R.id.habit_3};

        for (int i = 0; i < habitIds.length; i++) {
            Intent intent = new Intent(context, HabitWidgetProvider.class);
            intent.setAction(HABIT_TOGGLE_ACTION);
            intent.putExtra(EXTRA_HABIT_ID, habitIds[i]);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                Integer.parseInt(habitIds[i]) + appWidgetId * 10,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            views.setOnClickPendingIntent(habitLayouts[i], pendingIntent);
        }
    }

    private void toggleHabit(Context context, String habitId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String habitKey = "habit_" + habitId + "_completed";
        boolean currentState = prefs.getBoolean(habitKey, false);

        prefs.edit().putBoolean(habitKey, !currentState).apply();

        // Aqui você poderia também sincronizar com o AsyncStorage do React Native
        // através de um bridge nativo se necessário
    }
}