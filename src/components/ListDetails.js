import React, { Component } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Toast } from 'native-base';
import HeaderComponent from './common/Header';

import { Colors, Metrics, Images } from "../Themes";

import firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';

export default class ListDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingPlayers: false,
            players: [],
            ...props
        };

        console.log("componentWillReceiveProps", props.list, props.list.id)

        if (props.list && props.list.id) {
            this.getListById(props.list.id);
        }

        console.log("ListDetails props:", props);
    }

    componentWillReceiveProps(props) {
        this.setState({ ...props });
        console.log("componentWillReceiveProps", props.list, props.list.id)
        if (props.list && props.list.id) {
            this.getListById(props.list.id);
        }
    }

    getListById(listId) {
        console.log("getListById called!");
        firebase
            .database()
            .ref(`Lists/${listId}/`)
            .on("value", (listSnapshot) => {
                console.log("getListById snapshot");
                let listData = listSnapshot.val();
                this.setState({ list: listData, loading: false });
                this.getPlayersData(listData);
            });
    }

    getPluralString(value) {
        if (value && value > 1) return "s";
    }

    getPlayersData(list) {
        console.log("getPlayersData called!");

        let playersList = [];

        if (_.size(list.playerList) === 0) {
            this.setState({ players: [] });
            return;
        }

        _.each(list.playerList, player => {
            console.log("getPlayersData:", player.playerId);
            firebase
                .database()
                .ref(`Users/${player.playerId}`)
                .once("value")
                .then((playerSnapshot) => {
                    let playerData = playerSnapshot.val();
                    playersList.push(playerData);

                    if (playersList.length === _.size(list.playerList)) {
                        console.log("getPlayersData list completed!");
                        this.setState({ players: playersList });
                    }

                })
                .catch((error) => {
                    console.log("getPlayersData error:", error);
                });
        });
    }

    renderPlayersList(playerList) {
        const { list, loadingPlayers, players } = this.state;

        if (loadingPlayers) {
            return (
                <View style={{ marginTop: Metrics.deviceHeight * 0.5 }}>
                    <ActivityIndicator size="large" color={Colors.mainColor} />
                </View>
            );
        }

        return (
            <Card>
                <CardItem header>
                    <Text>Players confirmados
                        <Text style={{ fontStyle: 'italic' }}>({_.size(playerList)}/{list.maxPlayers})</Text>
                    </Text>
                </CardItem>
                {_.size(players) > 0 ?
                    _.map(players, player => {
                        return (
                            <CardItem style={[styles.cardItem, { borderLeftColor: Colors.green }]}>
                                <Left>
                                    <Thumbnail source={player.imageURL
                                        ? { uri: player.imageURL }
                                        : Images.logoWhite}
                                        style={styles.thumbnail}
                                    />

                                    <Body>
                                        <Text>{player.userName}</Text>
                                        <Text style={{ fontStyle: "italic" }}>{player.name}</Text>
                                    </Body>

                                </Left>
                                <Right>
                                    <Icon name="md-checkmark" style={{ color: Colors.green }} />
                                </Right>
                            </CardItem>
                        )
                    })
                    :
                    <CardItem style={[styles.cardItem]}>
                        <Body>
                            <Text>Nenhum player confirmou presença para essa lista!</Text>
                        </Body>
                    </CardItem>
                }
            </Card>
        )
    }

    confirmPresence(playerOnList) {
        const listId = this.state.list.id;
        const authPlayer = firebase.auth().currentUser;
        const playerId = authPlayer.uid;

        if (!playerOnList) {
            firebase
                .database()
                .ref(`Lists/${listId}/playerList/${playerId}`)
                .set({
                    confirmed: true,
                    confirmedDateEpoch: moment().valueOf(),
                    playerId
                }).then(() => {
                    Toast.show({
                        text: 'Você foi adicionado com sucesso a lista!',
                        buttonText: 'OK',
                        type: "success"
                    });
                })
                .catch(() => {
                    Toast.show({
                        text: 'Não foi possivel adicionar você a lista!',
                        buttonText: 'OK',
                        type: "error"
                    });
                })
        } else {
            firebase
                .database()
                .ref(`Lists/${listId}/playerList/${playerId}`)
                .remove()
                .then(() => {
                    Toast.show({
                        text: 'Você foi removido com sucesso a lista!',
                        buttonText: 'OK',
                        type: "success"
                    });
                })
                .catch(() => {
                    Toast.show({
                        text: 'Não foi possivel remover você a lista!',
                        buttonText: 'OK',
                        type: "error"
                    });
                })
        }
    }


    renderConfirm(listPlayers) {

        const authPlayer = firebase.auth().currentUser;
        const playerOnList = _.includes(_.keys(listPlayers), authPlayer.uid);
        console.log("renderConfirm:", authPlayer.uid, _.keys(listPlayers));

        const { list } = this.state;
        const listFull = list.maxPlayers === _.size(list.playerList);

        return (
            <Card>
                <CardItem style={[styles.cardItem, { borderLeftColor: playerOnList ? Colors.mainColor : listFull ? Colors.black : Colors.green }]}>
                    <Body>
                        <Button
                            full
                            success={!listFull && !playerOnList}
                            danger={playerOnList}
                            dark={listFull && !playerOnList}
                            onPress={() => this.confirmPresence(playerOnList)}
                            disabled={listFull && !playerOnList}>
                            {
                                listFull && !playerOnList ?
                                    <Text>Lista já está cheia</Text>
                                    :
                                    <Text>{playerOnList ? "Sair da lista" : "Confirmar presença"}</Text>
                            }
                        </Button>
                    </Body>
                </CardItem>
            </Card>
        )
    }

    renderDescription(description) {

        if(!description) return null;

        return (
            <Card>
                <CardItem style={styles.cardItem}>
                    <Body>
                        <Text>{description}</Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }


    render() {
        const { backButton, list } = this.state;
        return (
            <Container>
                <HeaderComponent
                    title={list.title}
                    subtitleText={list.type}
                    backButton={backButton} />
                <Content padder>
                    <Card>
                        <CardItem style={styles.cardItem}>
                            <Left>
                                <Thumbnail source={list.userProfileImage
                                    ? { uri: list.userProfileImage }
                                    : Images.logoWhite}
                                    style={styles.thumbnail} />
                                <Body>
                                    <Text>{list.title}</Text>
                                    <Text note>{list.type}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                    </Card>
                    {this.renderDescription(list.description)}
                    {this.renderConfirm(list.playerList)}
                    {this.renderPlayersList(list.playerList)}
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    cardItem: { borderLeftColor: Colors.mainColor, borderLeftWidth: 5 },
    thumbnail: { borderColor: Colors.mainColor, borderWidth: 1 }
})
