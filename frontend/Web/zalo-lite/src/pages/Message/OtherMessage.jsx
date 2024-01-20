function OtherMessage() {
  return (
    <div className="h-screen w-full overflow-auto">
      <div className="flex w-full items-center pr-2">
        <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center border text-sm text-[#7589A3] duration-200 md:min-w-[322px]">
          <div className="">
            <h1>This is other message</h1>
            <p className="text-red-900">Xin chao</p>
            <p className="text-justify">
              Lorem ipsum dolor sit, amet consecteture adipisicing elit. Magni
              vel nam incidunt corrupti laudantium et ea amet vitae, molestias
              inventore neque nesciunt ipsam nihil, omnis adipisci labore ipsa!
              Assumenda, obcaecati!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherMessage;
