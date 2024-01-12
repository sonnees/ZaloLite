import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
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
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden" >

        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">

          <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
            Sign in
          </h1>
          <form className="mt-6">
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              > 
                Email
              </label>
              <input
                type="email" 
                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <a
              href="#"
              className="text-xs text-purple-600 hover:underline"
            >
              Forget Password?
            </a>
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                onClick={() => navigate('/')}
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center text-gray-700">
            {" "}
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-purple-600 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}