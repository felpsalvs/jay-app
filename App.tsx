import "./patch-turbo-modules";
import "./src/lib/dayjs";
import { StatusBar } from "react-native";
import {
  useFonts,
  Inter_700Bold,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import * as Notifications from 'expo-notifications';

import { Routes } from "./src/routes";
import { Loading } from "./src/components/Loading";
import { useEffect } from "react";
import React from "react";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_800ExtraBold,
  });

  async function schedulePushNotification() {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();
    console.log("Agendadas:", schedule);

    if (schedule.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    const triggerDate = new Date(Date.now());
    triggerDate.setHours(triggerDate.getHours() + 5);
    triggerDate.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Olá, Pessoa!",
        body: "Você praticou seus hábitos hoje?",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  }

  useEffect(() => {
    schedulePushNotification();
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <Routes />
    </>
  );
}
