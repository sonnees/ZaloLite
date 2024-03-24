import { faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QR_Test from "./../../assets/QR_Test.png";
// import { WebSocket } from 'vite';

export default function LoginForm() {
  const [isSelectQR, setIsSelectQR] = useState(true);
  const navigate = useNavigate();

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
  const [qrCodeUrl, setQrCodeUrl] = useState("");

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
        const newSocket = new WebSocket(
          "ws://localhost:8081/ws/auth/" + data.field1,
        );
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
          navigate("/app", { token: token.field });
        } else if (data.connect == "ACCEPT") {
          let device = navigator.userAgent.match("Windows") ? "Windows" : "MAC";
          let day = new Date();
          let time =
            day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
          let location = "navigator.userAgent";
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
      <div className="absolute inset-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1280 654"
          preserveAspectRatio="xMinYMin slice"
        >
          <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff" />
          <path
            fill="#e8f3ff"
            d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z"
          />
          <path
            fill="#e8f3ff"
            d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z"
          />
          <path
            fill="#aad6ff"
            d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z"
          />
          <path
            fill="#d0e4fc"
            d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z"
          />
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
          {!isSelectQR ? (
            <>
              <ul className="flex border-b-2 py-3">
                <li
                  className="flex-1 text-center font-thin"
                  onClick={() => setIsSelectQR(true)}
                >
                  VỚI MÃ QR
                </li>
                <span className="font-thin text-slate-300">|</span>
                <li className="flex-1 text-center font-medium">
                  VỚI SỐ ĐIỆN THOẠI
                </li>
              </ul>

              <form onSubmit={handleSubmitLogin} className="mt-2  px-6">
                <div className="mx-2 mb-2 border-b-2 py-4">
                  <FontAwesomeIcon icon={faMobileScreen} className="mx-3" />
                  <select
                    id="contryOption"
                    className="mx-3 text-center focus:outline-none"
                  >
                    <option value="">+84</option>
                    <option value="option1">+1</option>
                    <option value="option2">+2</option>
                    <option value="option3">+3</option>
                  </select>

                  <input
                    id="input-phone"
                    placeholder="Số điện thoại"
                    className="px-3 focus:outline-none "
                    onChange={(event) => {
                      setPhoneNumber(event.target.value);
                    }}
                  ></input>
                </div>

                <div className="mx-2 mb-2 border-b-2 py-4">
                  <FontAwesomeIcon icon={faLock} className="mx-3" />
                  <input
                    id="input-password"
                    placeholder="Mật khẩu"
                    className="mx-3 px-3 focus:outline-none"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  ></input>
                </div>

                <div className="mt-6">
                  <button
                    className="w-full transform rounded-md bg-blue-400 py-2 tracking-wide text-white transition-colors duration-200"
                    type="submit"
                    // onClick={() => {}}
                  >
                    Đăng nhập với mật khẩu
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    className="bg-white-700 w-full transform rounded-md border-2 py-2 tracking-wide text-blue-400 transition-colors duration-200"
                    type="button"
                    // onClick={() => navigate('/')}
                  >
                    Đăng nhập với bằng thiết bị di động
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-xs font-light text-gray-700">
                <a
                  href="#"
                  className="text-black-100 font-medium hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </p>
            </>
          ) : (
            <>
              <ul className="flex border-b-2 py-3">
                <li className="flex-1 text-center font-medium">VỚI MÃ QR</li>
                <span className="font-thin text-slate-300">|</span>
                <li
                  className="flex-1 text-center font-thin"
                  onClick={() => setIsSelectQR(false)}
                >
                  VỚI SỐ ĐIỆN THOẠI
                </li>
              </ul>

              <div className="m-6 mx-20 flex flex-col items-center rounded-lg border-2">
                <img
                  src={qrCodeUrl}
                  alt="QR"
                  className="my-3"
                  style={{ width: 200, height: 200, borderRadius: 5 }}
                />

                <p className="w-60 text-center text-base font-normal text-blue-600">
                  Chỉ dùng để đăng nhập
                </p>

                <p className="text-black-600 mb-3 w-60 text-center text-base font-normal">
                  Zalo trên máy tính
                </p>
              </div>

              <p className="mb-6 text-center text-xs font-medium text-gray-600">
                Sử dụng ứng dụng Zalo để quét mã QR
              </p>
            </>
          )}
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
