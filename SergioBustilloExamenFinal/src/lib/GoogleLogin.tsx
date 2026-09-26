import { supabase } from "../lib/supabase";
import * as AuthSession from "expo-auth-session";
import { Button } from "react-native";

export default function GoogleLogin() {
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
      redirectTo: AuthSession.makeRedirectUri(),
      },
    });

    if (error) console.error(error);
  };

  return <Button title="Continuar con Google" onPress={handleLogin} />;
}
