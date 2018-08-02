import React, { Component } from "react";
import {
  Alert,
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
  BackAndroid,
  ScrollView,
  NetInfo,
  ImageBackground,
  StatusBar
} from "react-native";
import { Actions } from "react-native-router-flux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FormInput } from "react-native-elements";
import { registerUser, updateUser } from "../../actions/AuthAction";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Colors, Metrics, Images } from "../../Themes";

import firebase from "firebase";

import ImagePicker from "react-native-image-picker";

import { Container } from "native-base";

const dismissKeyboard = require("dismissKeyboard");

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordCheck: "",
      loading: false,
      name: "",
      filledEmail: "",
      imageURI: null,
      loggedUserUid: ""
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener("hardwareBackPress", this.handleBackButton);

    if (this.props.isEditing) {
      this.loadUserData();
    }
  }

  loadUserData() {
    const { currentUser } = firebase.auth();

    const userEmail = currentUser.email ? currentUser.email : "";

    this.setState({
      loggedUserUid: currentUser.uid,
      email: userEmail
    });

    firebase
      .database()
      .ref("/Users/" + currentUser.uid)
      .on("value", snapshot => {
        if (snapshot.val() != null) {
          this.setStateValues(snapshot.val());
          this.state.currentUser = snapshot.val();
        }
      });
  }

  setStateValues(loggedUser) {
    this.setState({
      name: loggedUser.name ? loggedUser.name : "",
      userName: loggedUser.userName ? loggedUser.userName : "",
      imageURL: loggedUser.imageURL ? loggedUser.imageURL : ""
    });
  }

  handleBackButton() {
    Actions.pop();
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  focusNextField = nextField => {
    this.refs[nextField].focus();
  };

  renderBackButton = () => {
    return (
      <TouchableOpacity style={styles.backButton} onPress={() => Actions.pop()}>
        <MaterialIcons name="arrow-back" size={25} color="white" />
      </TouchableOpacity>
    );
  };

  processUpdateUser = () => {
    const { loggedUserUid, name, userName, imageURI } = this.state;

    updateUser(loggedUserUid, name, userName, imageURI);
  };

  processRegister = () => {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type != "none") {
        const { name, userName, email, password, passwordCheck, imageURI } = this.state;

        console.log("imageURI: ", imageURI);

        if (!imageURI) {
          Alert.alert("Atenção", "Você precisa enviar a foto do perfil.");
        } else if (
          name === "" ||
          email === "" ||
          password === "" ||
          passwordCheck === ""
        ) {
          Alert.alert(
            "Atenção",
            "Preencha todos os campos antes de prosseguir com o cadastro."
          );
        } else if (!this.validateEmail(email)) {
          Alert.alert("Atenção", "Por favor, digite um email válido.");
        } else if (password !== passwordCheck) {
          Alert.alert("Atenção", "As senhas devem coincidir.");
        } else {
          this.setState({ loading: true });
          const changeLoading = ldg => {
            this.setState({ loading: ldg });
          };
          registerUser(name, userName, email, password, changeLoading, imageURI);
        }
      } else {
        Alert.alert("", "Por favor, verifique sua conexão com a internet");
      }
    });
  };

  renderLoading = () => {
    return (
      <View>
        <Modal transparent visible={this.state.loading} animationType={"fade"}>
          <View style={styles.containerModal}>
            <ActivityIndicator size="large" color="white" />
          </View>
        </Modal>
      </View>
    );
  };

  renderImage = (imageName, iconSize, styleImage, styleNoImage) => {
    if (this.state.imageURI) {
      return (
        <TouchableOpacity
          onPress={() => this.selectPhotoTapped(imageName)}
          activeOpacity={0.7}
        >
          <Image source={this.state.imageURI} style={styleImage} />
        </TouchableOpacity>
      );
    } else if (this.state.imageURL) {
      return (
        <TouchableOpacity
          onPress={() => this.selectPhotoTapped(imageName)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: this.state.imageURL }} style={styleImage} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.selectPhotoTapped(imageName)}
          activeOpacity={0.7}
        >
          <View style={styleNoImage}>
            <FontAwesome name="plus" size={iconSize} color="white" />
          </View>
        </TouchableOpacity>
      );
    }
  };

  selectPhotoTapped = imageName => {
    const options = {
      title: "Selecione uma foto",
      mediaType: "photo",
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      },
      cancelButtonTitle: "Cancelar",
      takePhotoButtonTitle: "Tirar uma foto...",
      chooseFromLibraryButtonTitle: "Selecionar da galeria..."
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        let source = "";
        if (response.fileSize < 1048576) {
          //1mb
          source = { uri: response.uri };

          let imageURI = source;
          this.setState({ imageURI });
        } else {
          Alert.alert(
            "Atenção!",
            "A imagem selecionada é muito grande, por favor selecione outra com menor resolução."
          );
        }
      }
    });
  };

  render() {
    const { isEditing } = this.props;

    return (
      <Container>
        <StatusBar backgroundColor="transparent" />
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
          <View style={styles.container}>
            <ImageBackground source={Images.logoBackground} style={{ width: '100%', height: '100%' }}>
              <ScrollView style={styles.background}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.centerEverything}>
                    <Text style={styles.title}>{isEditing ? "Editar Perfil" : "Cadastro"}</Text>
                    <View style={styles.inputPictureWrapper}>
                      <View style={[styles.inputPicture, styles.mainImageView]}>
                        {this.renderImage(
                          "temporary_name",
                          30,
                          styles.bigImage,
                          styles.bigMediaButton
                        )}
                        <Text style={styles.tipText}>Foto do Perfil *</Text>
                      </View>
                    </View>
                    <View style={styles.inputContainer}>
                      <SimpleLineIcons
                        name="user"
                        size={15}
                        color="white"
                        style={styles.formIcon}
                      />
                      <FormInput
                        inputStyle={styles.formInput}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.focusNextField("userName")
                        }}
                        onChangeText={name => this.setState({ name })}
                        ref={"name"}
                        keyboardType="text"
                        textInputRef={"name"}
                        value={this.state.name}
                        underlineColorAndroid="white"
                        placeholder="Seu Nome *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <SimpleLineIcons
                        name="trophy"
                        size={15}
                        color="white"
                        style={styles.formIcon}
                      />
                      <FormInput
                        inputStyle={styles.formInput}
                        returnKeyType="next"
                        onSubmitEditing={() => this.focusNextField("email")}
                        onChangeText={userName => this.setState({ userName })}
                        ref={"userName"}
                        keyboardType="default"
                        textInputRef={"userName"}
                        value={this.state.userName}
                        underlineColorAndroid="white"
                        placeholder="Seu Nick *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                      />
                    </View>

                    {!isEditing && this.renderSignUpFields()}

                    <TouchableOpacity
                      style={styles.buttonConnect}
                      onPress={() =>
                        isEditing
                          ? this.processUpdateUser()
                          : this.processRegister()
                      }
                    >
                      <Text style={styles.textButtonConnect}>{isEditing ? "SALVAR" : "CADASTRAR"}</Text>
                    </TouchableOpacity>
                    {this.renderLoading()}
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
              {this.renderBackButton()}
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </Container>
    );
  }

  renderSignUpFields() {
    return (
      <View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons
            name="envelope"
            size={15}
            color="white"
            style={styles.formIcon}
          />
          <FormInput
            inputStyle={styles.formInput}
            returnKeyType="next"
            onSubmitEditing={() => this.focusNextField("password")}
            onChangeText={email => this.setState({ email })}
            ref={"email"}
            keyboardType="email-address"
            textInputRef={"email"}
            value={this.state.email}
            underlineColorAndroid="white"
            placeholder="Seu E-mail *"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons
            name="lock-open"
            size={15}
            color="white"
            style={styles.formIcon}
          />
          <FormInput
            inputStyle={styles.formInput}
            returnKeyType="next"
            onChangeText={password => this.setState({ password })}
            ref={"password"}
            textInputRef={"password"}
            secureTextEntry={true}
            onSubmitEditing={() => this.focusNextField("passwordCheck")}
            value={this.state.password}
            underlineColorAndroid="white"
            placeholder="Sua Senha *"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons
            name="lock-open"
            size={15}
            color="white"
            style={styles.formIcon}
          />
          <FormInput
            inputStyle={styles.formInput}
            onChangeText={passwordCheck => this.setState({ passwordCheck })}
            ref={"passwordCheck"}
            textInputRef={"passwordCheck"}
            secureTextEntry={true}
            returnKeyType="go"
            onSubmitEditing={this.processRegister}
            value={this.state.passwordCheck}
            underlineColorAndroid="white"
            placeholder="Confirmar Senha *"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.mainColor
  },
  inputPictureWrapper: {
    flex: 1
  },
  labelText: {
    color: Colors.white95,
    fontSize: 10,
    marginLeft: Metrics.deviceWidth * 0.06,
    marginTop: Metrics.deviceWidth * 0.05
  },
  tipText: {
    fontSize: 10,
    color: Colors.white
  },
  backgroundImage: {
    position: "absolute",
    width: Metrics.deviceWidth,
    height: Metrics.deviceHeight * 0.6,
    marginTop: Metrics.deviceHeight * 0.2,
    "z-index": -90
  },
  buttonConnect: {
    height: Metrics.deviceWidth * 0.12,
    width: Metrics.deviceWidth * 0.75,
    borderRadius: 100,
    backgroundColor: Colors.white15,
    justifyContent: "center",
    alignItems: "center",
    elevation: Metrics.elevation,
    borderWidth: 1,
    borderColor: "white",
    marginTop: 50
  },
  textButtonConnect: {
    fontSize: 14,
    color: "#fff"
  },
  inputContainer: {
    width: Metrics.deviceWidth,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  inputPicture: {
    width: Metrics.deviceWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  formInput: {
    width: Metrics.deviceWidth * 0.8,
    color: "white"
  },
  backButton: {
    position: "absolute",
    top: Metrics.navBarHeight + 20,
    left: 20
  },
  centerEverything: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50
  },
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  containerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    flex: 1,
    color: Colors.white,
    fontSize: 30,
    marginTop: Metrics.deviceHeight * 0.15
  },
  mainImageView: {
    flex: 1,
    paddingTop: Metrics.deviceWidth * 0.08,
    flexDirection: "column"
  },
  formIcon: {
    marginRight: -Metrics.screenWidth * 0.03
  },
  bigImage: {
    width: Metrics.deviceWidth * 0.3,
    height: Metrics.deviceWidth * 0.3,
    borderRadius: 5,
    borderColor: Colors.white,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bigMediaButton: {
    backgroundColor: Colors.black20,
    width: Metrics.deviceWidth * 0.3,
    height: Metrics.deviceWidth * 0.3,
    borderRadius: 5,
    borderColor: Colors.white,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  }
};

export default Signup;
