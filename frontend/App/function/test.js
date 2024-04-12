// export { ChatItem, containsDoublePipe }

// import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
// import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
// import { Video } from 'expo-av';
// import { getTime } from '../function/CalTime';
// const ChatItem = memo(({ item, conversationOpponent, myUserInfo }) => {
//     const [textHeight, setTextHeight] = useState(40);
//     const touchableRef = useRef(null);
//     const [videoKey, setVideoKey] = useState(0);
//     const myMessage = '#B0E2FF';
//     const handleTextLayout = (e) => {
//         const { height } = e.nativeEvent.layout;
//         setTextHeight(height);
//         if (touchableRef.current) {
//             touchableRef.current.setNativeProps({
//                 style: { height: height + 20 } // 20 là padding dự phòng
//             });
//         }
//     };
//     const [imageSize, setImageSize] = useState({ width: null, height: null });

//     const handleImageLoad = (event) => {
//         const { width, height } = event.nativeEvent.source;
//         setImageSize({ width, height });
//     };
//     const alignmentStyle = item.userID === myUserInfo.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
//     //Hiển thị bên đối phương
//     if (item.userID !== myUserInfo.id) {
//         if (!item.hidden.includes(myUserInfo.id)) {
//             if (!item.recall) {
//                 if (item.contents.length > 1) {
//                     return (
//                         <React.Fragment>
//                             {item.contents.map((content, contentIndex) => {
//                                 if (content.key === 'image') {
//                                     return (
//                                         <View style={{ alignItems: 'center' }}>
//                                             <TouchableOpacity
//                                                 key={contentIndex}
//                                                 style={{
//                                                     flexDirection: 'row',
//                                                     borderRadius: 12,
//                                                     backgroundColor: 'white',
//                                                     marginHorizontal: 10,
//                                                     ...alignmentStyle,
//                                                     paddingHorizontal: 10,
//                                                     width: imageSize.width,
//                                                     height: 300,
//                                                     maxHeight: 300,
//                                                     maxWidth: '60%',
//                                                     // flexDirection: 'column'
//                                                 }}
//                                             >
//                                                 <Image
//                                                     source={{ uri: content.value }}
//                                                     style={{ height: '100%', width: '100%' }}
//                                                     resizeMode="contain"
//                                                     onLoad={handleImageLoad}
//                                                 />
//                                             </TouchableOpacity>
//                                             <View style={{ height: 8 }} />
//                                         </View>
//                                     )
//                                 }
//                             })}
//                         </React.Fragment>
//                     );
//                 } else {
//                     if (item.contents[0].key === 'image') {
//                         return (
//                             <View style={{ alignItems: 'center' }}>
//                                 <TouchableOpacity
//                                     style={{
//                                         flexDirection: 'row',
//                                         borderRadius: 12,
//                                         backgroundColor: 'white',
//                                         marginHorizontal: 10,
//                                         ...alignmentStyle,
//                                         paddingHorizontal: 10,
//                                         width: imageSize.width,
//                                         height: 300,
//                                         maxHeight: 300,
//                                         maxWidth: '60%',
//                                         // flexDirection: 'column'
//                                     }}
//                                 >
//                                     <Image
//                                         source={{ uri: item.contents[0].value }}
//                                         style={{ height: '100%', width: '100%' }}
//                                         resizeMode="contain"
//                                         onLoad={handleImageLoad}
//                                     />
//                                 </TouchableOpacity>
//                                 <View style={{ height: 8 }} />
//                             </View>
//                         );
//                     }
//                 }
//             }
//         }
//     }
//     /// Hiển thị bên mình
//     else {
//         if (!item.hidden.includes(myUserInfo.id)) {
//             if (!item.recall) {
//                 if (item.contents.length > 1) {
//                     return (
//                         <React.Fragment>
//                             {item.contents.map((content, contentIndex) => {
//                                 if (content.key === 'image') {
//                                     return (
//                                         <View style={{ alignItems: 'center' }}>
//                                             <TouchableOpacity
//                                                 key={contentIndex}
//                                                 style={{
//                                                     flexDirection: 'row',
//                                                     borderRadius: 12,
//                                                     backgroundColor: myMessage,
//                                                     marginHorizontal: 10,
//                                                     ...alignmentStyle,
//                                                     paddingHorizontal: 10,
//                                                     width: imageSize.width,
//                                                     height: 300,
//                                                     maxHeight: 300,
//                                                     maxWidth: '60%',
//                                                     // flexDirection: 'column'
//                                                 }}
//                                             >
//                                                 <Image
//                                                     source={{ uri: content.value }}
//                                                     style={{ height: '100%', width: '100%' }}
//                                                     resizeMode="contain"
//                                                     onLoad={handleImageLoad}
//                                                 />
//                                             </TouchableOpacity>
//                                             <View style={{ height: 8 }} />
//                                         </View>
//                                     );
//                                 }
//                             })}
//                         </React.Fragment>
//                     );
//                 } else {
//                     if (item.contents[0].key === 'image') {
//                         return (
//                             <View style={{ alignItems: 'center' }}>
//                                 <TouchableOpacity
//                                     style={{
//                                         flexDirection: 'row',
//                                         borderRadius: 12,
//                                         backgroundColor: myMessage,
//                                         marginHorizontal: 10,
//                                         ...alignmentStyle,
//                                         paddingHorizontal: 10,
//                                         width: imageSize.width,
//                                         height: 300,
//                                         maxHeight: 300,
//                                         maxWidth: '60%',
//                                         // flexDirection: 'column'
//                                     }}
//                                 >
//                                     <Image
//                                         source={{ uri: item.contents[0].value }}
//                                         style={{ height: '100%', width: '100%' }}
//                                         resizeMode="contain"
//                                         onLoad={handleImageLoad}
//                                     />
//                                 </TouchableOpacity>
//                                 <View style={{ height: 8 }} />
//                             </View>
//                         );
//                     }
//                 }
//             }
//         }
//     }

// });
// function containsDoublePipe(key) {
//     return key.indexOf('|') !== key.lastIndexOf('|');
// }
function findTopChatActivity(messageID, topChatActivity) {
    for (let i = 0; i < topChatActivity.length; i++) {
        if (topChatActivity[i].messageID === messageID) {
            return topChatActivity[i];
        }
    }
    // Nếu không tìm thấy, trả về null hoặc giá trị tùy ý khác để chỉ ra không tìm thấy
    return null;
}