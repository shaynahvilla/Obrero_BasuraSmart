import { Stack } from "expo-router";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { COLORS } from "@/lib/constants";

export default function CollectorLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (user?.userType === "resident") {
      router.replace("/(resident)/home");
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.userType !== "collector") {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="route" />
    </Stack>
  );
}