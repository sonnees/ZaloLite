import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
export const ChatModal = ({ modalChatVisible, setModalChatVisible, data }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalChatVisible}
            onRequestClose={() => {
                setModalChatVisible(false);
            }}
        >
            <TouchableWithoutFeedback onPress={() => setModalChatVisible(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            height: 420,
                            width: 300,
                            borderRadius: 2,
                            elevation: 5,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                height: 70,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}
                            >
                                {/* Thiện Đạt */}
                                {data.chatName}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 0.2,
                                    borderRadius: 50,
                                    width: 24,
                                    height: 24,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: 10,
                                    marginRight: 20,
                                }}
                            >
                                <Image
                                    style={{ width: 13, height: 13, resizeMode: "contain" }}
                                    source={require("../assets/draw.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                borderBottomColor: "gray",
                                borderBottomWidth: 0.2,
                                width: "100%",
                            }}
                        />
                        <TouchableOpacity style={styles.buttonInChatModal}>
                            <Text style={styles.textInModal}>Chuyển sang mục khác</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonInChatModal}>
                            <Text style={styles.textInModal}>Ẩn trò chuyện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonInChatModal}>
                            <Text style={styles.textInModal}>Xóa trò chuyện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonInChatModal}>
                            <Text style={styles.textInModal}>Đánh dấu đã đọc</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonInChatModal}>
                            <Text style={styles.textInModal}>Bật chế độ Bong Bóng Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonInChatModal}>
                            <Text style={styles.textInModal}>Tắt thông báo</Text>
                        </TouchableOpacity>
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