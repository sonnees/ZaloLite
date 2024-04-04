import { faAnglesLeft, faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";

export default function RegisterUser() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [flag, setFlag] = useState(false);
    const location = useLocation()
    const phone = location.state.phoneNumber;

    console.log(phone);
    console.log(newPassword);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password!=newPassword) {
            setFlag(true)
            console.error("Failed reset password");
            return ;
        }
        
        try {
        const response = await fetch(
            "http://localhost:8081/api/v1/auth/reset-password",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                field1: phone,
                field2: newPassword,
            }),
            // body: JSON.stringify({
            //   "phoneNumber": "0123456789",
            //   "password": "123"
            // }),
            },
        );
    
        if (response.ok) {
            
            navigate("/auth/login");
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

return (
    <div>

        <h3 className="text-center text-xl mt-10">Tạo tài khoản</h3>

        <form onSubmit={handleResetPassword}  className="mt-2  px-7">
            <div className="mx-2 mb-2 border-b-2 py-4">
            
                <FontAwesomeIcon icon={faLock} className="mx-3" />
                <input
                    id="input-password"
                    placeholder="Gồm 2-40 kí tự"
                    className="mx-3 px-3 focus:outline-none"
                    onChange={(event) => {
                    setPassword(event.target.value);
                    }}
                ></input>

            </div>

            <div className="mx-2 mb-2 border-b-2 py-4">
            
                <FontAwesomeIcon icon={faLock} className="mx-3" />
                <input
                    id="input-password"
                    placeholder="Nhập lại mật khẩu"
                    className="mx-3 px-3 focus:outline-none"
                    onChange={(event) => {
                    setNewPassword(event.target.value);
                    }}
                ></input>

            </div>

            {flag && <div className="mx-2 mb-2 py-4">
                <span>
                    <p className="text-red-600" >Xác nhận mật khẩu không đúng</p>
                </span>
            </div>}

            

            

            <div className="mt-6 px-2">
                <button
                    className="w-full transform rounded-md bg-blue-400 py-2 tracking-wide text-white transition-colors duration-200"
                    type="submit"
                    // onClick={() => navigate('/auth/reset-password')}
                >
                    Xác nhận
                </button>
            </div>

            
        </form>


        
    </div>
)
}
