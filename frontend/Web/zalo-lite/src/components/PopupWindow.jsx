import React, { useEffect, useState } from 'react';

export default function PopupWindow ({ isOpen, onClose, data, phoneNumber }) {
    console.log(data);
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

                <p className="bg-gray-50 w-10 text-center cursor-pointer" onClick={onClose}>X</p>

              </div>
              
              <div className="p-6 m-3">
                {/* Your content here */}
                <p>Thông tin cá nhân:</p>
                <p>Bio: {data.userName}</p>
                <p>Giới tính: {data.gender?'Nam':'Nữ'}</p>
                <p>Ngày sinh: {}</p>
                <p>Điện thoại: {phoneNumber}</p>
                <p>Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này</p>
              </div>
              {/* Close button */}
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};