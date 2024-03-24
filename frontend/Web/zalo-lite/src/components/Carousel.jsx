import React, { useState, useEffect } from "react";

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);

  const previousSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setAutoSlide(false); // Tạm ngưng auto slide khi chuyển slide bằng nút previous
      if (current === 0) setCurrent(slides.length - 1);
      else setCurrent(current - 1);
      setTimeout(() => {
        setAutoSlide(true); // Kích hoạt lại auto slide sau một khoảng thời gian
      }, 1000); // Sau 1 giây
    }
  };

  const nextSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setAutoSlide(false); // Tạm ngưng auto slide khi chuyển slide bằng nút next
      if (current === slides.length - 1) setCurrent(0);
      else setCurrent(current + 1);
      setTimeout(() => {
        setAutoSlide(true); // Kích hoạt lại auto slide sau một khoảng thời gian
      }, 1000); // Sau 1 giây
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoSlide && !isSliding) {
        // Kiểm tra autoSlide và không đang trong quá trình chuyển slide mới gọi nextSlide
        nextSlide();
      }
    }, 1000);

    const transitionEnd = () => {
      setIsSliding(false);
    };

    document.addEventListener("transitionend", transitionEnd);

    return () => {
      clearInterval(interval);
      document.removeEventListener("transitionend", transitionEnd);
    };
  }, [autoSlide, current, isSliding]); // useEffect được gọi lại khi autoSlide, current hoặc isSliding thay đổi

  return (
    <div className="relative overflow-hidden pb-10">
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((s, index) => (
          <div
            key={index}
            style={{ scrollSnapAlign: "start", minWidth: "100%" }}
          >
            <div
              className={`duration-40 flex items-center`}
            >
              <div className="flex w-full flex-col items-center justify-center">
                <img src={s.img} alt="" className="w-[380px]" />
                <div className="mb-[10px] mt-5">
                  <span className="text-lg font-medium text-[#005AE0]">
                    {s.caption}
                  </span>
                </div>
                <div>
                  <span
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: s.detail }}
                  />
                </div>
                <div>
                  <span className="mt-[10px] text-[13px] text-[#005AE0]">
                    {s.other}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-between px-10 text-3xl text-white ">
        <button onClick={previousSlide}>
          <img src="/public/arrow-left.svg" alt="" className="w-7" />
        </button>
        <button onClick={nextSlide}>
          <img src="/public/arrow-right.svg" alt="" className="w-7" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0  flex w-full justify-center gap-3 py-4">
        {slides.map((s, i) => (
          <div
            onClick={() => setCurrent(i)}
            key={"circle" + i}
            className={`h-2 w-2 cursor-pointer rounded-full  ${
              i === current ? "bg-[#0068FF]" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
