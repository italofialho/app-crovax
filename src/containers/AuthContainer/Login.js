import React, { Component } from "react";
import firebase from "firebase";
import {
  Alert,
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Modal,
  BackHandler,
  ActivityIndicator,
  StatusBar,
  NetInfo,
  ImageBackground
} from "react-native";

import { Actions } from 'react-native-router-flux';

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FormInput } from "react-native-elements";
import { loginUserEmail, resetPassword } from "../../actions/AuthAction";

import { Colors, Metrics, Images } from "../../Themes";
import { Container } from "native-base";

const dismissKeyboard = require("dismissKeyboard");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      email: "",
      password: "",
      loading: false
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  focusNextField = nextField => {
    this.refs[nextField].focus();
  };

  loginUser = () => {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type != "none") {
        const { email, password } = this.state;
        if (email === "" && password === "") {
          Alert.alert(
            "Atenção",
            "Preencha os campos de email e senha antes de fazer o login."
          );
        } else if (!this.validateEmail(email)) {
          Alert.alert("Atenção", "Por favor, digite um email válido.");
        } else {
          this.setState({ loading: true });
          const changeLoading = ldg => {
            this.setState({ loading: ldg });
          };
          const deleteAccount = this.props.deleteAccount ? true : false;
          loginUserEmail(email, password, changeLoading, deleteAccount);
        }
      } else {
        Alert.alert("", "Por favor, verifique sua conexão com a internet");
      }
    });
  };

  resetPasswordHelper() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type != "none") {
        const { email } = this.state;
        if (!this.validateEmail(email)) {
          Alert.alert("Atenção", "Por favor, digite um email válido.");
        } else {
          resetPassword(email);
          this.setState({ visible: false });
        }
      } else {
        Alert.alert("", "Por favor, verifique sua conexão com a internet");
      }
    });
  }

  renderModal = () => {
    return (
      <View>
        <Modal
          transparent
          visible={this.state.visible}
          animationType={"fade"}
          onRequestClose={() => {
            this.setState({ visible: false });
          }}
        >
          <View style={styles.containerModal}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }} />
              <TouchableWithoutFeedback
                onPress={() => this.setState({ visible: false })}
              >
                <View style={[styles.closeButton]}>
                  <MaterialIcons name="close" size={25} color="red" />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.modalForgotPassword}>
              <Text style={styles.titleForgotPassword}>Recuperar a senha</Text>
              <Text style={styles.descriptionForgotPassword}>
                Por favor, digite seu email abaixo para que possa receber um
                e-mail de recuperação de senha.
              </Text>
              <View style={styles.inputContainer}>
                <FormInput
                  inputStyle={styles.formInputModal}
                  returnKeyType="next"
                  keyboardType="email-address"
                  onChangeText={email => this.setState({ email })}
                  ref={"email"}
                  textInputRef={"email"}
                  onSubmitEditing={this.resetPasswordHelper}
                  underlineColorAndroid={Colors.black50}
                  value={this.state.email}
                  placeholder="Seu e-mail"
                  placeholderTextColor={Colors.grayGradient0}
                />
              </View>
              <TouchableOpacity onPress={() => this.resetPasswordHelper()}>
                <View style={styles.buttonForgotPassword}>
                  <Text style={styles.textButtonForgotPassword}>
                    Enviar e-mail de recuperação
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
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

  render() {
    return (
      <Container>
        <StatusBar
          backgroundColor={Colors.transparent}
          translucent
          barStyle="light-content"
        />
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
          <View style={styles.container}>
            <ImageBackground source={Images.logoBackground} style={{ width: '100%', height: '100%' }}>
              <View style={styles.container85}>
                <View style={styles.centerEverything}>
                  <Image source={Images.logoWhite} style={styles.logoImage} />
                  <KeyboardAvoidingView behavior={"padding"}>
                    <View style={styles.inputContainer}>
                      <FontAwesome
                        name="user-o"
                        color={Colors.white}
                        size={15}
                        style={styles.formIcon}
                      />
                      <FormInput
                        inputStyle={styles.formInput}
                        returnKeyType="next"
                        keyboardType="email-address"
                        onChangeText={email => this.setState({ email })}
                        ref={"email"}
                        textInputRef={"email"}
                        autoCapitalize="none"
                        onSubmitEditing={() => this.focusNextField("password")}
                        underlineColorAndroid={Colors.white}
                        value={this.state.email}
                        placeholder="E-mail"
                        placeholderTextColor={Colors.white}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <SimpleLineIcons
                        name="lock-open"
                        size={15}
                        color={Colors.white}
                        style={styles.formIcon}
                      />
                      <FormInput
                        inputStyle={styles.formInput}
                        onChangeText={password => this.setState({ password })}
                        ref={"password"}
                        textInputRef={"password"}
                        onSubmitEditing={this.loginUser}
                        secureTextEntry={true}
                        returnKeyType="go"
                        autoCapitalize="none"
                        underlineColorAndroid={Colors.white}
                        value={this.state.password}
                        placeholder="Senha"
                        placeholderTextColor={Colors.white}
                      />
                    </View>
                  </KeyboardAvoidingView>
                  <View style={styles.forgotPasswordView}>
                    <TouchableOpacity
                      style={styles.rightView}
                      onPress={() => this.setState({ visible: true })}
                    >
                      <Text style={styles.textForgotPassword}>
                        Esqueceu a senha?
                    </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => this.loginUser()}>
                    <View style={styles.buttonConnect}>
                      <Text style={styles.textButtonConnect}>Entrar</Text>
                      <FontAwesome
                        name="arrow-right"
                        size={15}
                        color={Colors.white}
                        style={styles.formIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.withoutLoginWrapper}>
                  <Text style={styles.withoutLoginText}>
                    Não possui cadastro?
                </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signupWrapper} onPress={() => Actions.signup()}>
                  <Text style={styles.signupText}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
              {this.renderModal()}
              {this.renderLoading()}
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </Container>
    );
  }
}

const styles = {
  logoImage: {
    marginTop: Metrics.deviceHeight * 0.4,
    backgroundColor: Colors.transparent,
    marginBottom: Metrics.screenHeight * 0.10,
    alignSelf: 'center',
    height: 150,
    width: Metrics.screenWidth * 0.8,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
    flexDirection: "column",
    alignItems: "center"
  },
  container85: {
    height: Metrics.deviceHeight * 0.85,
    width: Metrics.deviceWidth,
    paddingTop: Metrics.deviceHeight * 0.4,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  backgroundImage: {
    position: "absolute",
    "z-index": -90
  },
  buttonConnect: {
    height: Metrics.deviceWidth * 0.12,
    width: Metrics.deviceWidth * 0.55,
    backgroundColor: Colors.mainColor,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: Metrics.screenWidth * 0.1,
    marginBottom: Metrics.screenHeight * 0.5
  },
  textButtonConnect: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: Metrics.deviceWidth * 0.09,
    color: "#fff"
  },
  textSignup: {
    fontSize: 12,
    color: "#fff"
  },
  textSignupLine: {
    fontSize: 12,
    color: "#fff",
    textDecorationLine: "underline"
  },
  forgotPasswordView: {
    width: Metrics.screenWidth * 0.8,
    marginTop: Metrics.screenWidth * 0.018
  },
  inputContainer: {
    flexDirection: "row",
    width: Metrics.deviceWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  rightView: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  formInputContainer: {
    flexDirection: "row",
    width: Metrics.deviceWidth * 0.75,
    alignItems: "center",
    justifyContent: "center"
  },
  formInput: {
    width: Metrics.deviceWidth * 0.75,
    color: Colors.white,
    fontWeight: "bold"
  },
  bottomMenu: {
    borderTopColor: Colors.white,
    borderTopWidth: 1.5,
    width: Metrics.deviceWidth,
    flexDirection: "row",
    height: Metrics.deviceHeight * 0.15,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  withoutLoginWrapper: {
    backgroundColor: Colors.transparent,
    height: Metrics.deviceHeight * 0.15,
    width: Metrics.deviceWidth * 0.6,
    alignItems: "center",
    justifyContent: "center"
  },
  withoutLoginText: {
    fontWeight: "bold",
    color: Colors.white
  },
  signupWrapper: {
    height: Metrics.deviceHeight * 0.15,
    width: Metrics.deviceWidth * 0.4,
    alignItems: "center",
    justifyContent: "center"
  },
  signupText: {
    fontWeight: "bold",
    color: Colors.white
  },
  formInputModal: {
    width: Metrics.deviceWidth * 0.7,
    color: Colors.white
  },
  containerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center"
  },
  modalForgotPassword: {
    borderRadius: 10,
    backgroundColor: "white",
    width: Metrics.deviceWidth * 0.9,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    elevation: Metrics.elevation,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: -20,
    marginRight: Metrics.deviceWidth * 0.1
  },
  titleForgotPassword: {
    fontSize: 20,
    color: "#000",
    marginTop: 20
  },
  buttonForgotPassword: {
    height: Metrics.deviceWidth * 0.1,
    width: Metrics.deviceWidth * 0.7,
    borderRadius: 3,
    backgroundColor: Colors.mainColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: Metrics.elevation,
    marginTop: 20,
    marginBottom: 20
  },
  textButtonForgotPassword: {
    fontSize: 14,
    color: "#fff"
  },
  descriptionForgotPassword: {
    fontSize: 14,
    color: "#000",
    margin: 20,
    textAlign: "center"
  },
  centerEverything: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    width: Metrics.screenWidth,
    height: Metrics.screenHeight * 0.5
  },
  forgotPasswordView: {
    flexDirection: "row",
    width: Metrics.screenWidth * 0.8,
    marginTop: Metrics.screenWidth * 0.018
  },
  textForgotPassword: {
    fontSize: 14,
    color: "#fff",
    textDecorationLine: "underline"
  },
  formIcon: {
    marginRight: -Metrics.screenWidth * 0.03
  }
};

export default Login;
