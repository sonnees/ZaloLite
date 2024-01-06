
const MainHome = () => (
  <div class="flex flex-wrap bg-gray-100 w-full h-screen">
      <div class="w-[64px] flex p-3 bg-[#0091ff] pt-[32px]">
        <nav className="nav__tabs flx flx-col flx-sp-btw ">
          <ul>
            <li>
              <img src="https://s120-ava-talk.zadn.vn/2/5/a/5/6/120/5ded83a5856f6d2af9fce6eac4b8d6d2.jpg" class="border rounded-[50%]" alt="avatar" />
            </li>
            <li>
              <img src="/message.png" class="w-[30px] h-[30px]" alt="avatar" />
            </li>
            <li>
              <img src="/contact-book.png" class="w-[30px] h-[30px]" alt="avatar" />
            </li>
            <li>
              <img src="/checkbox.png" class="w-[30px] h-[30px]" alt="avatar" />
            </li>
          </ul>
        </nav>
      </div>

    <div class="w-8/12">
      <div class="p-4 text-gray-500">
        Content here...
      </div>
    </div>
  </div>
);

export default MainHome;
