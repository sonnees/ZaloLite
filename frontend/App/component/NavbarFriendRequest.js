import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // Import Icon from AntDesign

const NavbarFriendRequest = ({ conversationOpponent }) => {
    const { type } = conversationOpponent;

    return (
        <>
            {type === 'REQUESTED' && (
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 40,
                        width: '100%',
                        position: 'absolute',
                        top: '50',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1,
                    }}
                >
                    <Text style={{ marginLeft: 20 }}>Sent you a friend request</Text>
                    <TouchableOpacity
                        style={{
                            height: 30,
                            width: 80,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20,
                            backgroundColor: '#1E90FF',
                            marginRight: 10,
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 12 }}>ACCEPT</Text>
                    </TouchableOpacity>
                </View>
            )}
            {type === 'REQUESTS' && (
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 40,
                        width: '100%',
                        position: 'absolute',
                        top: '50',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Icon name="adduser" size={20} color={'gray'}></Icon>
                    <Text style={{ marginLeft: 10 }}>Friend request has been sent</Text>
                </View>
            )}
            {type === 'STRANGER' && (
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 40,
                        width: '100%',
                        position: 'absolute',
                        top: '50',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Icon name="adduser" size={20} color={'gray'}></Icon>
                    <Text style={{ marginLeft: 10 }}>Add friend</Text>
                </View>
            )}
        </>
    );
};

export default NavbarFriendRequest;
