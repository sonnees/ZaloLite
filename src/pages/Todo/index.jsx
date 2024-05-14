import React from "react";

function Todo() {
  return (
    <div className="h-full w-full flex-1 flex-col">
      <div className="flex h-screen flex-col items-center justify-center">
        <img
          src="This-feature-is-under development2.png"
          alt="Under Development"
          className=" w-[300px] object-cover"
        />
        <p className="-mt-6 text-center text-xl text-gray-600">
          This feature is under development.
        </p>
      </div>
    </div>
  );
}

export default Todo;
