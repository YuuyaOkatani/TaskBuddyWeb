import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { db, firebaseAuth } from "../src/firebase";
import { provider } from "../src/firebase";
import { signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

import * as WebBrowser from "expo-web-browser";
import Loading from "./Loading";
import firebase from "firebase/compat/app";
import { GoogleAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();
const Screen1 = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, IsLoading] = useState(false);
  const [varEmail, setVarEmail] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const usersCollectionRef = collection(db, "users");
  const auth = firebaseAuth;
  const currentUser = auth.currentUser;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("usuario");
      } else {
      }
    });
  }, []);

  /// pelo visto, terei que incluir um novo auth com google, com o auth normal (senha e email)
  function press() {
    navigation.navigate("cadastro");
  }
  const login = async () => {
    setIsAuthenticating(true);
    IsLoading(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        navigation.navigate("usuario");
      })
      .catch((error) => {
        alert("Senha ou email incorreto");

        return;
      });
    IsLoading(false);
  };
  if (loading == true) {
    return <Loading />;
  }
  const GoogleLogin = async (e) => {
    const provider = await new GoogleAuthProvider();
    const respond = await signInWithPopup(auth, provider);
    if (auth.currentUser.email) {
      /// adicionei o if para não ativar a função de criar um novo documento antes de fazer um login com google
      await getDocs(query(usersCollectionRef)).then((newdocsnap) => {
        let users = [];
        newdocsnap.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        function escolhaNew(users, EmailAlvo) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].email === EmailAlvo) {
              return i;
            }
          }
        }

        const posicao = escolhaNew(users, auth.currentUser.email);
        if (posicao === undefined) {
          // problema de login firestore com google resolvido !

          addDoc(usersCollectionRef, {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            password: "",
            photo: auth.currentUser.photoURL,
            age: "",
            expec: "",
          })
            .then((userCredentials) => {
              const userC = userCredentials.user;
              navigation.navigate("usuario");
            })
            .catch((error) => {
              alert("Algo deu errado");
            });
        }
      });
    }
    // o programa precisa saber se fez cadastro primeiro.
  };

  return (
    <View style={styles.container}>
      <Image source={require("../img/icon2.png")} style={styles.img} />
      <Text style={styles.texto}>Login</Text>
      <TextInput
        value={email}
        onChangeText={(event) => setEmail(event)}
        placeholder="email..."
        style={styles.input}
      />
      <TextInput
        value={password}
        textContentType="password"
        secureTextEntry={true}
        onChangeText={(event) => setPassword(event)}
        placeholder="senha..."
        style={styles.input}
      />
      <TouchableOpacity onPress={() => GoogleLogin()} style={styles.btnGoogle}>
        <View>
          <Text> Fazer login com Google </Text>
          <Image
            source={require("../img/googleLogo.png")}
            style={{
              left: 170,
              bottom: 18,
              height: 20,
              width: 20,
              borderRadius: 100,
            }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={login} style={styles.botao}>
        <Text style={styles.btnTexto}>fazer login!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.teste} onPress={press}>
        <Text style={styles.textstyle}>
          Ainda não se cadastrou? Clique aqui!
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Screen1;

const styles = StyleSheet.create({
  teste: {
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dcedfa",
  },
  img: {
    marginTop: 20,
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imgfundo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    color: "black",
    fontWeight: "bold",
  },
  input: {
    height: 45,
    width: 250,
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "white",
    fontSize: 20,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  btnTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 15,
  },
  botao: {
    marginTop: 20,
    height: 55,
    width: 120,
    backgroundColor: "#00bdd3",
    borderWidth: 2,
    borderRadius: 10,
  },
  textstyle: {
    color: "black",
  },
  btnGoogle: {
    height: 30,
    width: 200,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 5,
    marginTop: 10,
  },
});
