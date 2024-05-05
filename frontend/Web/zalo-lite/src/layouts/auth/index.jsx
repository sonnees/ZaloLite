import { faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import QR_Test from "./../../assets/QR_Test.png";
// import { WebSocket } from 'vite';

export default function AuthLayout() {
  const [isSelectQR, setIsSelectQR] = useState(true);
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);

  //=========================================================
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

//=========================================================
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
//=========================================================
  

  useEffect(() => {
    // Gọi API ở đây
    const fetchQrCode = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/v1/auth/authenticate/qr-code",
        );
        // Nếu sử dụng axios:
        // const response = await axios.post('your_api_url_here', { key: 'value' });

        if (!response.ok) {
          throw new Error("Failed to fetch QR code");
        }

        const data = await response.json();
        // console.log(data);
        setQrCodeUrl("data:image/png;base64," + data.field2); // Thay "qrCodeUrl" bằng trường dữ liệu thực tế từ API
        // console.log(qrCodeUrl);
        //=========SOCKET=========
        const socketLink = data.field1;
        const newSocket = new WebSocket('ws://localhost:8081/ws/auth/' + data.field1);
        console.log(data.field1);
        newSocket.onopen = () => {
          console.log("WebSocket connected");
        };

        setSocket(newSocket);
        return () => {
          newSocket.close();
        };
        //========================
      } catch (error) {
        console.error("Error fetching QR code:", error.message);
      }
    };

    fetchQrCode();
  }, []); // useEffect sẽ chạy một lần khi component được render

  useEffect(() => {
    if (socket) {
      handleReceiveToken();
    }
  });
//=========================================================

  async function fetchData(link) {
    let response = await fetch(link);
    let data = await response.json();
    return data;
  }

  //===========================================
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password,
          }),
          // body: JSON.stringify({
          //   "phoneNumber": "0123456789",
          //   "password": "123"
          // }),
        },
      );

      if (response.ok) {
        // Xử lý khi API trả về thành công
        const token = await response.json();
        console.log(">>>>>>>TOKEN>>>>>>>>>>", token.field);
        // navigate('/app', {token: token.field});
        navigate("/app", {
          state: { token: token.field, phoneNumber: phoneNumber },
        });
        console.log("API call successful");
      } else {
        // Xử lý khi API trả về lỗi
        navigate("/auth/login");
        console.error("API call failed");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      navigate("/");
      console.error("Error calling API:", error);
    }
  };
  //===========================================
  const handleReceiveToken = () => {
    socket.onmessage = async (event) => {
      if (isJSON(event.data)) {
        let data = JSON.parse(event.data);
        console.log(data);
        if (data.token != null) {
          // console.log(data.token);
          navigate("/app", { token: data.token });
        } else if (data.connect == "ACCEPT") {
          let device = navigator.userAgent.match("Windows") ? "Windows" : "MAC";
          let day = new Date();
          let time = day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
          let location = "TP.HCM";
          socket.send(
            JSON.stringify({ device: device, time: time, location: location }),
          );
          // console.log(socket);
        }
      }
    };
  };

  return (
    <div className="w-full">
      <div className="absolute inset-0 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="xMinYMin slice">
          <path fill="#aad6ff" d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"></path>
          <path fill="#e8f3ff" d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"></path>
          <path fill="#cee7ff" d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"></path>
          <path fill="#e8f3ff" d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"></path>
          <path fill="#e8f3ff" d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"></path>
          <path fill="#eef4f8" d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"></path>
          <path fill="#e8f3ff" d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"></path>
        </svg>
      </div>
      <div className="relative flex flex-col overflow-hidden">
        <div className="">
          <h1 className="mt-10 p-3 text-center text-6xl font-semibold text-blue-600">
            Zalo
          </h1>
          <h2 className="text-center font-normal">Đăng nhập tài khoản Zalo</h2>
          <h2 className="text-center font-normal">
            để kết nối với ứng dụng Zalo Web
          </h2>
        </div>

        <div className="mx-auto my-5 w-full bg-white pb-6 shadow-md lg:max-w-[388px]">
          {/* =================================================================================== */}
          <Outlet/>
          {/* =================================================================================== */}
        </div>

        <div className="m-3 mt-10">
          <p className=" text-center text-xs text-blue-600">
            <a className="font-semibold" href="#">
              Tiếng Việt
            </a>{" "}
            <span> </span>
            <a className="font-thin" href="#">
              English{" "}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
