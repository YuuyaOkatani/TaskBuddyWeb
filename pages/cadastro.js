import React, { useState, useEffect } from "react";
import { db } from "../src/firebase";

import firebase from "firebase/compat/app";
import { StyleSheet } from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";
import {
  Pressable,
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Loading from "./Loading";
const Screen2 = () => {
  const navigation = useNavigation();
  const [newName, setNewName] = useState("");
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [newPhoto, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [passwordApproval, setPasswordApproval] = useState("");
  const [loading, IsLoading] = useState(false);
  const usersCollectionRef = collection(db, "users");
  const validacao = "@gmail.com";
  const terminaCom = email.endsWith(validacao.trim());
  function press() {
    IsLoading(true);
    navigation.navigate("login");
    IsLoading(false);
  }

  const createUser = async () => {
    IsLoading(true);

    await getDocs(query(usersCollectionRef)).then((newdocsnap) => {
      let users = [];
      newdocsnap.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      function escollhaNew(users, EmailAlvo) {
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === EmailAlvo) {
            return i;
          }
        }
      }
      const Posicao = escollhaNew(users, email);

      if (Posicao == undefined) {
        if (terminaCom && email.length > 10) {
          if (password === passwordApproval) {
            if (password.length > 7) {
              addDoc(usersCollectionRef, {
                name: newName,
                email: email,
                password: password,
                photo: newPhoto,
                age: "",
                expec: "",
              })
                .then(() =>
                  firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                )
                .then(
                  () =>
                    firebase
                      .auth()
                      .signInWithEmailAndPassword(email, password)
                      .then((userCredentials) => {
                        const userC = userCredentials.user;
                        navigation.navigate("usuario");
                      }),

                  setNewName(""),
                  setPassword(""),
                  setPasswordApproval(""),
                  setEmail("")
                )
                .catch((error) => {
                  alert("Algo deu errado");
                });
            } else {
              alert("A senha deve ter pelo menos 8 caracteres");
            }
          } else {
            alert(" A senha está um pouco diferente...");
          }
        } else {
          alert("coloque um email valido");
        }
      } else {
        alert("Este email já está sendo usado");
      }
    });
    IsLoading(false);
  };

  if (loading == true) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../img/icon2.png")} style={styles.img} />
      <TextInput
        style={styles.input}
        placeholder="Nome..."
        onChangeText={(event) => setNewName(event)}
      />

      <TextInput
        style={styles.input}
        placeholder="email..."
        onChangeText={(event) => setEmail(event)}
      />

      <TextInput
        style={styles.input}
        textContentType="password"
        secureTextEntry={true}
        placeholder="Senha..."
        onChangeText={(event) => setPassword(event)}
      />

      <TextInput
        style={styles.input}
        textContentType="password"
        secureTextEntry={true}
        placeholder="Confirmar Senha..."
        onChangeText={(event) => setPasswordApproval(event)}
      />

      <TouchableOpacity style={styles.botao} onPress={createUser}>
        <Text style={styles.btnTexto}>cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.teste} onPress={press}>
        <Text style={styles.textstyle}>Voltar a fazer login</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Screen2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dcedfa",
  },
  teste: {
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  img: {
    marginTop: 20,
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  texto: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 5,
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "white",
    fontSize: 20,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: 250,
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
    backgroundColor: "#865DFF",
    borderWidth: 2,
    borderRadius: 10,
  },
  textstyle: {
    color: "black",
  },
});
