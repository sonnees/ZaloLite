import { faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QR_Test from "./../../assets/QR_Test.png";
import Cookies from "universal-cookie";
// import { WebSocket } from 'vite';
import { encryptData } from "../../utils/cookies";

export default function LoginForm() {
  const cookies = new Cookies();

  const [token, setToken] = useState(null);

  const [isSelectQR, setIsSelectQR] = useState(true);
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);
  const [flag, setFlag] = useState(false);

  // // Hàm để đặt user ID vào cookie khi người dùng đăng nhập
  //   const setUserIdInCookie = (id) => {
  //       // Tạo chuỗi cookie với tên là "userId", giá trị là user ID, và hạn sử dụng là 1 ngày
  //       document.cookie = `userId=${id}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;
  //       // Cập nhật state userId
  //       setUserId(id);
  //   };

  // Hàm để đặt token vào cookie
  const setTokenInCookie = (tokenValue) => {
    const tokenEncoded = encryptData(tokenValue);
    // Đặt cookie token với thời gian hết hạn là 1 ngày và các tùy chọn bảo mật
    cookies.set("token", tokenValue, {
      expires: new Date(Date.now() + 86400e3), // Thời gian hết hạn: 1 ngày
      // secure: true, // Chỉ truy cập thông qua HTTPS
      // sameSite: 'strict', // Giới hạn truy cập cookie trong cùng một trang web
      // httpOnly: true // Ngăn chặn việc truy cập cookie bằng JavaScript
    });
  };

  // Hàm để mã hóa số điện thoại và đặt vào cookie
  const setPhoneNumberInCookie = (phoneNumberValue) => {
    // Mã hóa số điện thoại trước khi lưu vào cookie
    const phoneNumberEncoded = encryptData(phoneNumberValue);

    // Tính toán thời gian hết hạn bằng cách thêm số lượng millisecond tương ứng với một ngày vào thời điểm hiện tại
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Thêm một ngày

    // Đặt cookie số điện thoại với thời gian hết hạn và các tùy chọn bảo mật
    cookies.set("phoneNumber", phoneNumberValue, {
      // expires: expirationDate,
    });
  };

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
  //   function isJSON(str) {
  //     try {
  //       JSON.parse(str);
  //       return true;
  //     } catch (e) {
  //       return false;
  //     }
  //   }
  // //=========================================================

  useEffect(() => {
    // Gọi API ở đây
    const fetchQrCode = async () => {
      try {
        const response = await fetch(
          `${process.env.HOST}/api/v1/auth/authenticate/qr-code`,
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
          `${process.env.SOCKET_ACCOUNT}/ws/auth/` + data.field1,
        );
        // console.log(data.field1);
        newSocket.onopen = () => {
          // console.log("WebSocket connected");
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
        `${process.env.HOST}/api/v1/auth/authenticate`,
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

      if (response.status == 401) {
        setFlag(true);
        console.error("Failed login");
        return;
      }

      if (response.ok) {
        // Xử lý khi API trả về thành công

        const token = await response.json();
        localStorage.setItem("token", token.field);
        // navigate('/app', {token: token.field});
        navigate("/app", {
          state: { token: token.field, phoneNumber: phoneNumber },
        });

        //Lưu userID, token vào cookie
        setTokenInCookie(token.field);
        // console.log(token.field);
        setPhoneNumberInCookie(phoneNumber);

        // console.log("API call successful");
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
        // console.log(data);
        if (data.token != null) {
          // console.log(data.token);
          // navigate("/app", { token: data.token });
          navigate("/app", {
            state: { token: data.token, phoneNumber: data.phone },
          });
        } else if (data.connect == "ACCEPT") {
          let device = navigator.userAgent.match("Windows") ? "Windows" : "MAC";
          let day = new Date();
          let time =
            day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
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
    <div>
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
            <div className="-ml-2 w-full items-center">
              <div className="mx-2 mb-2 flex w-full items-center border-b-2 py-4">
                <FontAwesomeIcon icon={faMobileScreen} className="mx-3" />
                <select
                  id="contryOption"
                  className="mx-3 text-center focus:outline-none "
                >
                  <option value="">+84</option>
                  <option value="option1">+1</option>
                  <option value="option2">+2</option>
                  <option value="option3">+3</option>
                </select>

                <input
                  id="input-phone"
                  placeholder="Số điện thoại"
                  className="mr-1 w-full px-3 py-1 focus:outline-none"
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                ></input>
              </div>
            </div>

            <div className="mx-2 mb-2 border-b-2 py-4">
              <FontAwesomeIcon icon={faLock} className="mx-3" />
              <input
                id="input-password"
                placeholder="Mật khẩu"
                className="mx-3 w-64 px-3 focus:outline-none"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              ></input>
            </div>

            {flag && (
              <div className="mx-2 mb-2 py-4">
                <span>
                  <p className="text-red-600">
                    Tài khoản hoặc mật khẩu không chính xác
                  </p>
                </span>
              </div>
            )}

            <div className="mt-6">
              <button
                className="w-full transform rounded-md bg-[#0D86EB] py-2 tracking-wide text-white transition-colors duration-200"
                type="submit"
                // onClick={() => {}}
              >
                Đăng nhập với mật khẩu
              </button>
            </div>
          </form>

          <div className="flex">
            {/* <p className="flex-1 mt-8 text-center text-xs font-light text-gray-700">
              <a
                onClick={() => navigate('/auth/forgot-password')}
                className="text-black-100 font-medium hover:underline"
              >
                Đăng ký tài khoản
              </a>
            </p> */}

            <p className="mt-8 flex-1 text-center text-xs font-light text-gray-700">
              <a
                onClick={() => {
                  if (!flag) {
                    navigate("/auth/forgot-password");
                  } else {
                    navigate("/auth/forgot-password", {
                      state: { phoneProp: phoneNumber },
                    });
                  }
                }}
                className="text-black-100 font-medium hover:underline"
              >
                Quên mật khẩu?
              </a>
            </p>
          </div>
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

            <p className="w-60 text-center text-base font-normal text-[#0862ED]">
              Chỉ dùng để đăng nhập
            </p>

            <p className="text-black-600 mb-3 w-60 text-center text-base font-normal">
              Zalo trên máy tính
            </p>
          </div>

          <p className="-mt-1 mb-6 text-center text-xs font-medium text-gray-600">
            Sử dụng ứng dụng Zalo để quét mã QR
          </p>
        </>
      )}
    </div>
  );
}
