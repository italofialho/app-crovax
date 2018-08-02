import firebase from "firebase";
import { Alert, ToastAndroid, Platform } from "react-native";

import { Actions } from "react-native-router-flux";

import RNFetchBlob from "rn-fetch-blob";

const Blob = RNFetchBlob.polyfill.Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export function registerUser(name, userName, email, password, changeLoading, imageURI) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      firebase.auth().currentUser.updateProfile({ displayName: name });
      createUserRef(name, userName, imageURI);
      changeLoading(false);
    })
    .catch(error => {
      registerUserFail(error);
      changeLoading(false);
    });
}

const registerUserFail = error => {
  if (error.code === "auth/email-already-in-use") {
    Alert.alert("Erro", "Esse endereço de email já está sendo utilizado.");
  } else if (error.code === "auth/weak-password") {
    Alert.alert("Erro", "Sua senha deve conter pelo menos seis caracteres.");
  } else {
    Alert.alert("Um erro desconhecido ocorreu.\nTente novamente mais tarde.");
  }
  return false;
};

export function loginUserEmail(email, password, changeLoading, deleteAccount) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(credData => {
      verifyUserRef(credData.uid, changeLoading, deleteAccount);
    })
    .catch(error => {
      loginUserFail(error);
      changeLoading(false);
    });
}

export function verifyUserRef(uid, changeLoading = null, deleteAccount) {
  if (deleteAccount) {
    Actions.deleteacc();
    if (changeLoading) {
      changeLoading(false);
    }
  } else {
    firebase
      .database()
      .ref("/Users/" + uid)
      .once("value", snapshot => {
        if (snapshot.val() == null) {
          Actions.signup();
        } else {
          let playerData = snapshot.val();
          firebase.auth().currentUser.updateProfile({ displayName: playerData.userName });
          Actions.tabs();
          if (changeLoading) {
            changeLoading(false);
          }
        }
      });
  }
}

const loginUserFail = () => {
  Alert.alert("Atenção", "Email ou senha inválidos.");
  return false;
};

export function resetPassword(email) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      ToastAndroid.show("Email de recuperação enviado!", ToastAndroid.SHORT);
    })
    .catch(error => resetPasswordFail(error));
}

const resetPasswordFail = () => {
  Alert.alert("Atenção", "O email informado não está cadastrado.");
  return false;
};

export function createUserRef(name, userName, imageURI) {
  const { currentUser } = firebase.auth();

  firebase
    .database()
    .ref(`/Users/${currentUser.uid}`)
    .update({
      uid: currentUser.uid,
      email: currentUser.email,
      name,
      userName,
      rule: "player"
    });
  Actions.tabs();

  uploadImage(imageURI, currentUser.uid);
}

export function updateUser(userId, name, userName, imageURI) {
  Actions.pop();
  firebase
    .database()
    .ref(`/Users/${userId}`)
    .update({ name, userName });

  firebase.auth().currentUser.updateProfile({ displayName: userName });

  if (imageURI) {
    uploadImage(imageURI, userId);
  }
}

const uploadImage = (imageURI, userId, mime = "image/png") => {
  return new Promise((resolve, reject) => {
    const fs = RNFetchBlob.fs;
    const uploadUri =
      Platform.OS === "ios"
        ? imageURI.uri.replace("file://", "")
        : imageURI.uri;
    let uploadBlob = null;
    const storage = firebase.storage();
    const imageRef = storage.ref("users").child(`${userId}`);

    fs.readFile(uploadUri, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        resolve(url);

        updateUserImageUrlOnFirebase(userId, url);
      })
      .catch(error => {
        Alert.alert(
          "Ocorreu um erro ao enviar sua imagem para o servidor.\nTente novamente mais tarde."
        );
        reject(error);
      });
  });
};

function updateUserImageUrlOnFirebase(userId, url) {
  firebase
    .auth()
    .currentUser
    .updateProfile({ photoURL: url });

  firebase
    .database()
    .ref(`/Users/${userId}`)
    .update({
      imageURL: url
    });
}
