import { Cloudinary } from '@cloudinary/url-gen';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PopupWindow ({ isOpen, onClose, data, phoneNumber, token }) {
  if(!data){
    return null;
  }
  const [loadAvt, setLoadAvt] = useState(data.avatar);
  const inputFileRef = useRef(null);
  const navigate = useNavigate();
  const cloudinary = new Cloudinary({cloud: {cloudName: 'du73a0oen'}});

  console.log(data);
  console.log(phoneNumber);
  const dateTime = new Date(data.birthday);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'bsqsytxl');
    try {
      let newAvatar = '';
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/du73a0oen/image/upload",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formData,
        },
      )
      .then(response=>response.json())
      .then(data=>newAvatar=data.secure_url);

      console.log(newAvatar);
      

      

      const jsonAvt = {field: newAvatar}

      const res = await fetch(
        "http://localhost:8081/api/v1/account/change-avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonAvt),
        },
      )

      if (res.ok) {
        setLoadAvt(newAvatar)
      }

      

      
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleAvatarClick = () => {
    inputFileRef.current.click();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
              {/* Content of the popup */}

              <div className='flex items-center p-4'>
                <p className='flex-grow'>Thông tin tài khoản</p>

                <p className="bg-gray-50 w-10 text-center cursor-pointer" onClick={()=> {onClose(); navigate("/app", {state: { avt: loadAvt, token: token, phoneNumber:phoneNumber }})}}>X</p>

              </div>


              <div className="relative bg-cover bg-center bg-no-repeat p-4 h-44 mb-20" style={{backgroundImage: `url(${data.background})`}}>
                <div className="absolute top-48 left-4 transform -translate-y-1/2">
                  {/* =============================================== */}
                  <input ref={inputFileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
                  <img className="w-20 h-20 rounded-full border-4 border-white" onClick={handleAvatarClick} src={loadAvt} alt="Avatar" />

                </div>
                <div className="absolute top-52 left-4 transform -translate-y-1/2  pl-28">
                  <h2 className=" text-lg font-semibold">{data.userName}</h2>
                  {/* <p className=" text-sm">Lorem ipsum dolor sit amet</p> */}
                </div>
              </div>


              <hr className='bg-slate-200 h-1.5'/>
              
              <div className='m-3'>
                <p className='font-semibold'>Thông tin cá nhân</p>

                <div className='border-b border-gray-200'>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Bio</p>
                    <p className='w-72 text-left text-gray-700'>{data.userName}</p>
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Giới tính</p>
                    <p className='w-72 text-left text-gray-700'>{data.gender ? 'Nam' : 'Nữ'}</p>
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Ngày sinh</p>
                    <p className='w-72 text-left text-gray-700'> {dateTime.getDate()} tháng {dateTime.getMonth()+1}, {dateTime.getFullYear()}</p>
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Điện thoại</p>
                    <p className='w-72 text-left text-gray-700'>{phoneNumber}</p>
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số<br/> này</p>
                  </div>
                </div>

                <div className="mt-6 px-2">
                    <button
                        className="w-full transform rounded-md bg-white py-2 font-semibold tracking-wide text-black transition-colors duration-200"
                        type="submit"
                        // onClick={() => navigate('/auth/reset-password')}
                    >
                      <FontAwesomeIcon className='mx-1' icon={faPenToSquare} />
                      Cập nhật
                    </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};