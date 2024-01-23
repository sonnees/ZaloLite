import { faLock, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QR_Test from './../../assets/QR_Test.png';

export default function Login() {
  const [isSelectQR, setIsSelectQR] = useState(true)
  const navigate = useNavigate();
  return (
    <div className='w-full'>
      <div className="absolute inset-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 654" preserveAspectRatio="xMinYMin slice">

          <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff"/>
          <path fill="#e8f3ff" d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z"/>
          <path fill="#e8f3ff" d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z"/>
          <path fill="#aad6ff" d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z"/>
          <path fill="#d0e4fc"  d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z"/>

        </svg>

      </div>
      <div className="relative flex flex-col overflow-hidden" >

        <div className=''>
          <h1 className='text-center text-6xl text-blue-600 font-semibold p-3 mt-10'>Zalo</h1>
          <h2 className='text-center font-normal'>Đăng nhập tài khoản Zalo</h2>
          <h2 className='text-center font-normal'>để kết nối với ứng dụng Zalo Web</h2>
        </div>

        <div className=" w-full pb-6 mx-auto my-5 bg-white rounded-md shadow-md lg:max-w-96">

          {!isSelectQR ? (
            <>
              <ul className='flex border-b-2 py-3'>
                <li className='text-center flex-1 font-thin' onClick={()=>setIsSelectQR(true)} >VỚI MÃ QR</li> 
                <span className='font-thin text-slate-300'>|</span>
                <li className='text-center flex-1 font-semibold'>VỚI SỐ ĐIỆN THOẠI</li>
              </ul>

              <form className="mt-2  px-6">
                <div className="mb-2 mx-2 py-4 border-b-2">
                  <FontAwesomeIcon icon={faMobileScreen} className='mx-3'/>
                  <select id="contryOption" className='text-center mx-3'>
                    <option value="">+84</option>
                    <option value="option1">+1</option>
                    <option value="option2">+2</option>
                    <option value="option3">+3</option>
                  </select>

                  <input id="input-phone" placeholder="Số điện thoại" className='px-3'></input>
                </div>

                <div className="mb-2 mx-2 py-4 border-b-2">
                  <FontAwesomeIcon icon={faLock}  className='mx-3'/>
                  <input id="input-password" placeholder="Mật khẩu" className='mx-3 px-3'></input>
                </div>
                
                <div className="mt-6">
                  <button className="w-full py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-400 rounded-md"
                    onClick={() => navigate('/')}
                  >
                    Đăng nhập với mật khẩu
                  </button>
                </div>

                <div className="mt-4">
                  <button className="w-full py-2 tracking-wide text-blue-400 transition-colors duration-200 transform bg-white-700 border-2 rounded-md"
                    onClick={() => navigate('/')}
                  >
                    Đăng nhập với bằng thiết bị di động
                  </button>
                </div>
              </form>

                

              <p className="mt-8 text-xs font-light text-center text-gray-700">
                
                <a
                  href="#"
                  className="font-medium text-black-100 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </p>
            </>  
              ) : (
            <>
              <ul className='flex border-b-2 py-3'>
                <li className='text-center flex-1 font-semibold' >VỚI MÃ QR</li> 
                <span className='font-thin text-slate-300'>|</span>
                <li className='text-center flex-1 font-thin'  onClick={()=>setIsSelectQR(false)}>VỚI SỐ ĐIỆN THOẠI</li>
              </ul>

              <div className='flex flex-col items-center m-6 mx-16 border-2 rounded-lg' >
                <img src={QR_Test} alt='QR' style={{width:230, height:230, borderRadius: 5, margin:10}} />

                <p className="text-base text-center font-normal text-blue-600 w-60"> 
                  Chỉ dùng để đăng nhập
                </p>

                <p className="text-base text-center font-normal text-black-600 w-60"> 
                  Zalo trên máy tính
                </p>
              </div>

                

              <p className="mb-6 text-xs text-center font-medium text-gray-600"> 
                Sử dụng ứng dụng Zalo để quét mã QR
              </p>
            </>
          )}
  
        </div>

        <div className='m-3'>
          <p className='text-center text-blue-600 text-xs m-12'> 
            <a className='font-semibold' href="#">Tiếng Việt</a> <span> </span>
            <a className='font-thin' href="#">English </a>
          </p>
        </div>


      </div>
    </div>
  );
}