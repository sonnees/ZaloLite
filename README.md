# BACK END
*[sonnees](https://github.com/sonnees)* <br>

![Spring Boot Badge](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff&style=for-the-badge)

<hr>

<<<<<<< HEAD
## API & Data Transfer Object
### 1. Account
```
ZaloLite\backend\account-service\src\main\java\com\zalolite\accountservice\AccountServiceApplication.java
```
  
#### 1.1 Kiểm tra số điện thoại đã được đăng ký trong hệ thống chưa
Link api: http://localhost:8081/api/auth/check-uniqueness-phone-number/{phoneNumber} <br>
Gửi:
```
http://localhost:8081/api/v1/auth/check-uniqueness-phone-number/0123456789
```
  
Nhận:
```
# Nếu không tồn tại tài khoản đã đăng ký bằng số điện thoại đó
HTTP 200 OK

# Nếu tồn tại tài khoản đã đăng ký bằng số điện thoại đó
HTTP 409 Conflict
{
  "userName":"Nguyen Van Son",
  "gender":null,
  "birthday":null,
  "avatar":null,
  "background":null
}
```
#### 1.2 Gửi yêu cầu tạo tài khoản
Link api: http://localhost:8081/api/v1/auth/register <br>
Gửi:
```
http://localhost:8081/api/v1/auth/register
```
Với body:
=======

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
>>>>>>> master
```
{
    "phoneNumber":"0123456789",
    "password":"123",
    "userName":"Son nees",
    "gender":"true",
<<<<<<< HEAD
    "birthday":"2024-01-26"
}
```  
Nhận:
```
# Thành công
HTTP 200 OK
"success"

# Thất bại
HTTP 409 Conflict
```

#### 1.3 Gửi yêu cầu cấp quyền
Link api: http://localhost:8081/api/v1/auth/authenticate <br>
Gửi:
```
http://localhost:8081/api/v1/auth/authenticate
```
Với body:
=======
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
>>>>>>> master
```
{
    "phoneNumber":"0123456789",
    "password":"123"
}
```  
<<<<<<< HEAD
Nhận:
```
# Thành công
HTTP 200 OK
"{một mã token}"

# Thất bại: do số điện thoại không đúng hoặc là do password không đúng
HTTP 401 Unauthorized
```

#### 1.4 Gửi yêu cầu tạo mã qr (Máy tính, ...)
Link api: http://localhost:8081/api/v1/auth/authenticate/qr-code <br>
Gửi:
```
http://localhost:8081/api/v1/auth/authenticate/qr-code
```

Nhận:
```
# Thành công
HTTP 200 OK
=======
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
>>>>>>> master
"{một mã base64Image}"

# Thất bại:
HTTP 404 
```
<<<<<<< HEAD

#### 1.5 Gửi yêu cầu lấy profile của account nào đó bằng số điện thoại
Link api: http://localhost:8081/api/v1/account/profile/{phoneNumber} <br>
Gửi kèm token:
```
http://localhost:8081/api/v1/account/profile/0123456788
```

Nhận:
=======
</details>

<details>
  <summary>👇 Gửi yêu cầu lấy profile của account nào đó bằng số điện thoại </summary> 
  <hr>
  
`Method GET + TOKEN ` : http://localhost:8081/api/v1/account/profile/{phoneNumber} <br>
```
http://localhost:8081/api/v1/account/profile/0000000000
```
`Received` :
>>>>>>> master
```
# Thành công (có account):
HTTP 200 OK
** Trường hợp xem thông tin của người khác: Có thể bị ẩn các thông tin theo cài đặt của người dùng
*** Ẩn năm sinh: Năm sinh về mặc định là 1900. Khi hiển thị ở frontend thì để **, không hiện 1900
*** Ẩn ngày tháng năm sinh: năm sinh nhận được là null
{
<<<<<<< HEAD
    "userName": "Nguyen Thi Son",
    "gender": false,
    "birthday": null,
    "avatar": "https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png",
    "background": "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
}

# Thất bại (Không tìm thấy account):
HTTP 404 
```

=======
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


>>>>>>> master
