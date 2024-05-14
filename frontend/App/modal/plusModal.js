import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';


export const PlusModal = ({ modalVisible, setModalVisible }) => {
    let navigation = useNavigation();
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                        backgroundColor: "transparent",
                        margin: 6,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            height: 285,
                            width: 200,
                            borderRadius: 2,
                            elevation: 5,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "flex-start",
                                alignItems: "flex-end",
                                backgroundColor: "transparent",
                                margin: 6,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "white",
                                    height: 285,
                                    width: 200,
                                    borderRadius: 2,
                                    elevation: 5,
                                }}
                            >
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => {
                                        navigation.navigate("AddFriendScreen", {
                                            typeScreen: "MessagesScreen",
                                        });
                                        setModalVisible(false);
                                    }}
                                >
                                    <Icon
                                        name="adduser"
                                        size={22}
                                        color={"gray"}
                                        style={{ marginRight: 5 }}
                                    ></Icon>
                                    <Text style={styles.textInModal}>Add friend</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => {
                                        setModalVisible(false);
                                        navigation.navigate("CreactGroupScreen", {
                                            typeScreen: "MessagesScreen",
                                        });
                                    }}
                                >
                                    <Icon
                                        name="addusergroup"
                                        size={22}
                                        color={"gray"}
                                        style={{ marginRight: 5 }}
                                    ></Icon>
                                    <Text style={styles.textInModal}>Create group</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Icon
                                        name="cloudo"
                                        size={22}
                                        color={"gray"}
                                        style={{ marginRight: 5 }}
                                    ></Icon>
                                    <Text style={styles.textInModal}>My Cloud</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Icon
                                        name="calendar"
                                        size={22}
                                        color={"gray"}
                                        style={{ marginRight: 5 }}
                                    ></Icon>
                                    <Text style={styles.textInModal}>Zalo Calendar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Icon
                                        name="videocamera"
                                        size={22}
                                        color={"gray"}
                                        style={{ marginRight: 5 }}
                                    ></Icon>
                                    <Text style={styles.textInModal}>Create group call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonInModal}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Icon
                                        name="iconfontdesktop"
                                        size={22}
                                        color={"gray"}
                                        style={{ marginRight: 5 }}
                                    ></Icon>
                                    <Text style={styles.textInModal}>Logged-in devices</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonInModal: {
        flexDirection: "row",
        margin: 11.5,
        alignItems: "center",
        marginTop: 13,
        marginLeft: 20,
    },
    textInModal: {
        marginLeft: 10,
        fontSize: 16,
    },
    buttonNav: {
        flex: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonInChatModal: {
        flexDirection: "row",
        margin: 11.5,
        alignItems: "center",
        marginTop: 15,
        marginLeft: 20,
    },
});