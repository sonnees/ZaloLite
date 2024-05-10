import { faAnglesLeft, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [flag, setFlag] = useState(false);

    const handleCheckPhoneNumber = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://${process.env.HOST}:8080/api/v1/auth/check-uniqueness-phone-number/` + phoneNumber);
            const data = response.status;
            console.log(data);
            if (data==409) {
                navigate("/auth/reset-password", {state:{phoneNumber:phoneNumber}});
            } else {
                setFlag(true);
            }

            
        } catch (error) {
          // Xử lý lỗi khi gọi API
          navigate("/");
          console.error("Error calling API:", error);
        }
    };

  return (
    <div>

        <h3 className="text-center mt-10">Nhập số điện thoại của bạn</h3>

        <form onSubmit={handleCheckPhoneNumber} className="mt-2  px-7">
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

            {flag && <div className="mx-2 mb-2 py-4">
                <span>
                    <p className="text-red-600" >Số điện thoại không tồn tại</p>
                </span>
            </div>}

            

            <div className="mt-6 px-2">
                <button
                    className="w-full transform rounded-md bg-blue-400 py-2 tracking-wide text-white transition-colors duration-200"
                    type="submit"
                    // onClick={() => navigate('/auth/reset-password')}
                >
                    Tiếp tục
                </button>
            </div>

            
        </form>

        <p className="mx-10 my-4 font-light text-gray-700">
            <a
              onClick={() => navigate('/auth/login')}
              className="text-black-100 font-normal text-xs hover:underline"
            >
              <FontAwesomeIcon icon={faAnglesLeft} /> Quay lại
            </a>
            
        </p>

        
    </div>
  )
}
