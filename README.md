# BACK END
*[sonnees](https://github.com/sonnees)* <br>

![Spring Boot Badge](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff&style=for-the-badge)

<hr>

# Init
### Import module
Cần cấu hình các `*-service` và `*-server` để IDE hiểu folder nào là module của dự án microservice.  <br>
Đề xuất: `File > Project Structure > Modules > + > Import Module > select folder`
### Run Application
Chạy các file sau theo thứ tự: <br>
- `EurekaServerApplication.java` <br>
- `AccountServiceApplication.java` <br>
- `GatewayServiceApplication.java` <br>

## API & Data Transfer Object
### 1. Account 
#### 1.1 Kiểm tra số điện thoại đã được đăng ký trong hệ thống chưa
`Method GET` : http://localhost:8081/api/auth/check-uniqueness-phone-number/{phoneNumber} <br>
```
http://localhost:8081/api/v1/auth/check-uniqueness-phone-number/0123456789
```
`Received` :
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
`Method POST` : http://localhost:8081/api/v1/auth/register <br>
```
http://localhost:8081/api/v1/auth/register
```
`Body` :
```
{
    "phoneNumber":"0123456782",
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
HTTP 200 OK
"success"

# Thất bại
HTTP 409 Conflict
```

#### 1.3 Gửi yêu cầu cấp quyền
`Method GET` : http://localhost:8081/api/v1/auth/authenticate <br>
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
HTTP 200 OK
"{một mã token}"

# Thất bại: do số điện thoại không đúng hoặc là do password không đúng
HTTP 401 Unauthorized
```

#### 1.4 Gửi yêu cầu tạo mã qr (Máy tính, ...)
`Method GET` : http://localhost:8081/api/v1/auth/authenticate/qr-code <br>
```
http://localhost:8081/api/v1/auth/authenticate/qr-code
```
`Received` :
```
# Thành công
HTTP 200 OK
"{một mã base64Image}"

# Thất bại:
HTTP 404 
```

#### 1.5 Gửi yêu cầu lấy profile của account nào đó bằng số điện thoại
`Method GET + TOKEN ` : http://localhost:8081/api/v1/account/profile/{phoneNumber} <br>
```
http://localhost:8081/api/v1/account/profile/0123456788
```
`Received` :
```
# Thành công (có account):
HTTP 200 OK
** Trường hợp xem thông tin của người khác: Có thể bị ẩn các thông tin theo cài đặt của người dùng
*** Ẩn năm sinh: Năm sinh về mặc định là 1900. Khi hiển thị ở frontend thì để **, không hiện 1900
*** Ẩn ngày tháng năm sinh: năm sinh nhận được là null
{
    "userName": "Nguyen Thi Son",
    "gender": false,
    "birthday": null,
    "avatar": "https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png",
    "background": "https://giaiphapzalo.com/wp-content/uploads/2021/09/pagebg-1-1920x705.jpg"
}

# Thất bại (Không tìm thấy account):
HTTP 404 
```

#### 1.6 Gửi yêu cầu lấy thông tin của account bằng token
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

