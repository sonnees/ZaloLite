// import React, { useEffect, useRef, useState } from "react";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import TextField from "@mui/material/TextField";
// import ReactPlayer from "react-player";

// import Peer from "simple-peer";
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:9999");

// function VideoCall() {
//   const [me, setMe] = useState("");
//   const [stream, setStream] = useState();
//   const [receivingCall, setReceivingCall] = useState(false);
//   const [caller, setCaller] = useState("");
//   const [callerSignal, setCallerSignal] = useState();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [idToCall, setIdToCall] = useState("");
//   const [callEnded, setCallEnded] = useState(false);
//   const [name, setName] = useState("");
//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();

//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setStream(stream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = stream;
//         }
//       });

//     socket.on("me", (id) => {
//       setMe(id);
//     });

//     socket.on("callUser", (data) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setName(data.name);
//       setCallerSignal(data.signal);
//     });
//   }, []);

//   const callUser = (id) => {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       socket.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: me,
//         name: name,
//       });
//     });

//     peer.on("stream", (stream) => {
//       userVideo.current.srcObject = stream;
//     });

//     socket.on("callAccepted", (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const answerCall = () => {
//     setCallAccepted(true);
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       socket.emit("answerCall", { signal: data, to: caller });
//     });

//     peer.on("stream", (stream) => {
//       userVideo.current.srcObject = stream;
//     });

//     peer.signal(callerSignal);
//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     connectionRef.current.destroy();
//   };

//   return (
//     <div className="flex h-screen w-full pl-16 pt-10">
//       <div className="flex w-full flex-col items-center justify-center">
//         <h1 className="mb-8 text-2xl">Zalo Call</h1>
//         <div className="h-5/6 w-full flex-1  items-center justify-center border border-4 border-red-600">
//           <div className="video-container flex h-fit items-center justify-center border-2 border-blue-600">
//             <div className="video">
//               {stream && (
//                 <video
//                   playsInline
//                   muted
//                   ref={myVideo}
//                   autoPlay
//                   className="h-[700px] border-2 border-red-600"
//                 />
//               )}
//             </div>

//             <div className="video">
//               {callAccepted && !callEnded ? (
//                 <video
//                   playsInline
//                   ref={userVideo}
//                   autoPlay
//                   className="h-full w-full"
//                 />
//               ) : null}
//             </div>
//           </div>
//           {/* <div className="myId">
//             <TextField
//               id="filled-basic"
//               label="Name"
//               variant="filled"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mb-4"
//             />
//             <CopyToClipboard text={me} className="mb-8">
//               <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
//                 Copy ID
//               </button>
//             </CopyToClipboard>

//             <TextField
//               id="filled-basic"
//               label="ID to call"
//               variant="filled"
//               value={idToCall}
//               onChange={(e) => setIdToCall(e.target.value)}
//               className="mb-4"
//             />
//             <div className="call-button">
//               {callAccepted && !callEnded ? (
//                 <button
//                   className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
//                   onClick={leaveCall}
//                 >
//                   End Call
//                 </button>
//               ) : (
//                 <button
//                   className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
//                   onClick={() => callUser(idToCall)}
//                 >
//                   Call
//                 </button>
//               )}
//             </div>
//           </div> */}
//           <div>
//             {receivingCall && !callAccepted ? (
//               <div className="caller">
//                 <h1>{name} is calling...</h1>
//                 <button
//                   className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
//                   onClick={answerCall}
//                 >
//                   Answer
//                 </button>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VideoCall;
