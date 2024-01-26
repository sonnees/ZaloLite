# BACK END
*[sonnees](https://github.com/sonnees)* <br>

![Spring Boot Badge](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff&style=for-the-badge)

<hr>

## API & Data Transfer Object
### 1. Account
#### 1.1 Kiểm tra số điện thoại đã được đăng ký trong hệ thống chưa
Link api: http://localhost:8081/api/account/check-uniqueness-phone-number/{phoneNumber} <br>
Gửi:
```
http://localhost:8081/api/account/check-uniqueness-phone-number/0123456789
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
Link api: http://localhost:8081/api/account/create <br>
Gửi:
```
http://localhost:8081/api/account/create
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
# Nếu tạo tài khoản thành công
HTTP 200 OK
"success"

# Nếu tạo tài khoản thất bại
HTTP 409 Conflict

```
