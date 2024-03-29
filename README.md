# BACK END
*[sonnees](https://github.com/sonnees)* <br>

![Spring Boot Badge](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff&style=for-the-badge)

<hr>


# Init
### Import module
Cần cấu hình các `*-service` và `*-server` để IDE hiểu folder nào là module của dự án microservice.  <br>
Đề xuất: `File > Project Structure > Modules > + > Import Module > select folder`

### Config Mongodb
Cần chạy service tại `port 27017` 

### Run Application
Chạy các file sau theo thứ tự: <br>
- `EurekaServerApplication.java` <br>
- `AccountServiceApplication.java` <br>
- `ChatServiceApplication.java` <br>
- `GatewayServiceApplication.java` <br>

## API & Data Transfer Object
### Liên quan đến tài khoản

<details>
  <summary>👇 Gửi yêu cầu kiểm tra số điện thoại </summary> <br>

`Method GET` : http://localhost:8081/api/auth/check-uniqueness-phone-number/{phoneNumber} <br>
```
http://localhost:8081/api/v1/auth/check-uniqueness-phone-number/0000000000
```
`Received` :
```
# Nếu không tồn tại tài khoản đã đăng ký bằng số điện thoại đó
HTTP 200

# Nếu tồn tại tài khoản đã đăng ký bằng số điện thoại đó
HTTP 409
{
    "userID": null,
    "userName": "Tú Anh",
    "gender": null,
    "birthday": null,
    "avatar": null,
    "background": null
}
```
</details>

<details>
  <summary>👇 Gửi yêu cầu tạo tài khoản </summary> 
  <hr>
  
`Method POST` : http://localhost:8081/api/v1/auth/register <br>
```
http://localhost:8081/api/v1/auth/register
```
`Body` :
```
{
    "phoneNumber":"0123456789",
    "password":"123",
    "userName":"Son nees",
    "gender":"true",
    "birthday":"2024-01-26",
    "role":"USER"
}
```  
`Received` :

```
# Thành công
HTTP 200
"success"

# Thất bại
HTTP 409
```

</details>

<details>
  <summary>👇 Gửi yêu cầu cấp quyền </summary> 
  <hr> 
  
`Method POST` : http://localhost:8081/api/v1/auth/authenticate <br>
```
http://localhost:8081/api/v1/auth/authenticate
```
`Body` :
```
{
    "phoneNumber":"0123456789",
    "password":"123"
}
```  
`Received` :
```
# Thành công
HTTP 200
"{một mã token}"

# Thất bại: do số điện thoại không đúng hoặc là do password không đúng
HTTP 401
```
</details>

<details>
  <summary>👇 Gửi yêu cầu tạo mã qr (Máy tính, ...) </summary> 
  <hr>

`Method GET` : http://localhost:8081/api/v1/auth/authenticate/qr-code <br>
```
http://localhost:8081/api/v1/auth/authenticate/qr-code
```
`Received` :
```
# Thành công
HTTP 200
"{một mã base64Image}"

# Thất bại:
HTTP 404 
```
</details>

<details>
  <summary>👇 Gửi yêu cầu lấy profile của account nào đó bằng số điện thoại </summary> 
  <hr>
  
`Method GET + TOKEN ` : http://localhost:8081/api/v1/account/profile/{phoneNumber} <br>
```
http://localhost:8081/api/v1/account/profile/0000000000
```
`Received` :
```
# Thành công (có account):
HTTP 200 OK
** Trường hợp xem thông tin của người khác: Có thể bị ẩn các thông tin theo cài đặt của người dùng
*** Ẩn năm sinh: Năm sinh về mặc định là 1900. Khi hiển thị ở frontend thì để **, không hiện 1900
*** Ẩn ngày tháng năm sinh: năm sinh nhận được là null
{
    "userID": "49a9768c-a2a8-4290-9653-5291b9718db1",
    "userName": "Tú Anh",
    "gender": true,
    "birthday": "2024-03-08T10:54:01.442+00:00",
    "avatar": "https://zalolite.s3.amazonaws.com/nam1.jpg",
    "background": "https://zalolite.s3.amazonaws.com/background1.jpg"
}

# Thất bại (Không tìm thấy account):
HTTP 404|500
```
</details>

<details>
  <summary>👇 Gửi yêu cầu lấy toàn bộ thông tin của tài khoản </summary> 
  <hr>

`Method GET + TOKEN` : http://localhost:8081/api/v1/account/info <br>
```
http://localhost:8081/api/v1/account/info
```

`Received` :
```
# Thành công (có account):
HTTP 200 OK
{info account}

# Thất bại (Không tìm thấy account từ token hoặc token lỗi):
HTTP 403
```
</details>

### Liên quan đến chat

<details>
  <summary>👇 Gửi yêu lấy toàn bộ thông tin của user </summary> <br>

`Method GET + TOKEN` : http://localhost:8082/api/v1/user/info/{userId} <br>
```
http://localhost:8082/api/v1/user/info/49a9768c-a2a8-4290-9653-5291b9718db1
```
`Received` :
```
# Failed
HTTP 401 Error token
HTTP 500 Error processing JSON

# Success
HTTP 200
{user-info}
```
</details>

<details>
  <summary>👇 Lấy list các tin nhắn củ hơn theo id chat [X đến Y, xếp theo thời gian tăng dần] </summary> <br>

`Method GET + TOKEN` : http://localhost:8082/api/v1/chat/x-to-y <br>
```
http://localhost:8082/api/v1/chat/x-to-y?id=49a9768c-a2a8-4290-9653-5291b9718db1&x=10&y=20
```
`Received` :
```
# Failed
# Success
HTTP 200
{danh sách chatActivity}
```
</details>


# FRONT END
`WEB INIT`
```
npm i
npm run dev
```
`Login` :
```
http://localhost:5173/auth/login
```


