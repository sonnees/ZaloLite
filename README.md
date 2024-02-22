# BACK END
*[sonnees](https://github.com/sonnees)* <br>

![Spring Boot Badge](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff&style=for-the-badge)

<hr>

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
```
{
    "phoneNumber":"0123456789",
    "password":"123",
    "userName":"Son nees",
    "gender":"true",
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
```
{
    "phoneNumber":"0123456789",
    "password":"123"
}
```  
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
"{một mã base64Image}"

# Thất bại:
HTTP 404 
```

