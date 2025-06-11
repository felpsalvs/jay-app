import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { useNavigation } from "@react-navigation/native";

import Logo from "../assets/logo.svg";

export function Header() {
  const { navigate } = useNavigation();

  return (
    <View className="w-full flex-row items-center justify-between">
      <Logo />

      <View className="flex-row space-x-3">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row h-11 px-3 border border-zinc-600 rounded-lg items-center"
          onPress={() => navigate("widgetConfig")}
        >
          <Feather name="smartphone" color={colors.zinc[400]} size={18} />
          <Text className="text-zinc-400 ml-2 font-medium text-sm">Widget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
          onPress={() => navigate("new")}
        >
          <Feather name="plus" color={colors.violet[500]} size={20} />
          <Text className="text-white ml-3 font-semibold text-base">Novo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
