import React, { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Image, Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase.js";
import firebase from "firebase";
import { Alert } from "react-native";
import * as GoogleSignIn from 'expo-google-sign-in';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    initGoogleSignIn();

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log('authUser:' + authUser?.email);
      if (authUser) {

        const userRef = db.collection("users")
          .doc(authUser.uid);

        userRef.get().then((docSnapshot) => {
          if (!docSnapshot.exists) {
            userRef.set({
              uid: authUser.uid,
              maps: []
            })
          }
          userRef.update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const initGoogleSignIn = async () => {
    await GoogleSignIn.initAsync({
      clientId: "652220259634-v039dc3can3s6242qs8uct3ph4ls1qb9.apps.googleusercontent.com"
    });
  };

  const googleSignIn = async () => {
    try {
      const playServices = await GoogleSignIn.askForPlayServicesAsync();
      console.log(playServices);
      if (playServices) {
        const auth = await GoogleSignIn.signInAsync();
        console.dir(auth);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  const signIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light"></StatusBar>
      <Image
        source={require("../assets/hyper.png")}
        style={{ width: 150, height: 150, marginBottom: 50 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button containerStyle={styles.btn} title="Login" onPress={signIn} />
      <Button
        containerStyle={styles.btn}
        type="outline"
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />

      <Button containerStyle={styles.btn} title="Sign in with Google" onPress={googleSignIn} />

      <View style={{ height: 120 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  btn: {
    width: 200,
    marginTop: 10
  },
});
