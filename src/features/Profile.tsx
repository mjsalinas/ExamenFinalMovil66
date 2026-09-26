import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import { RootStackParamList } from "../navigation/StackNavigator";
import CustomButton from "../components/CustomButton";


// Tipo de navegación que vamos a utilizar para poder movernos entre las pantallas.
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function Profile() {
  // Obtenemos navigation para poder cambiar de pantalla.
  const navigation = useNavigation<NavProp>();

  // Función para cerrar sesión.
  const handleLogout = () => {
    // reset() borra el historial de navegación y deja únicamente LoginScreen.
    // Esto evita que al darle "atrás" el usuario pueda regresar al perfil o a las Tabs.
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  // Función para regresar a la pantalla anterior.
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Espacio para separar un poco los elementos */}
      <View style={styles.spacer} />

      {/* Botón para cerrar la sesión */}
      <CustomButton
        title="Cerrar sesión"
        onPress={handleLogout}
        variant="secondary"
      />

      {/* Botón para regresar a la pantalla anterior */}
      <CustomButton
        title="Ir atrás"
        onPress={handleGoBack}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal de la pantalla.
  // Ocupa toda la pantalla, tiene fondo blanco y centra los elementos.
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  // Estilos que podrían utilizarse para mostrar nombre y correo del usuario.
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  email: {
    fontSize: 13,
    color: "gray",
    marginBottom: 10,
  },

  // Espacio vertical utilizado para separar los elementos.
  spacer: {
    height: 30,
  },
});