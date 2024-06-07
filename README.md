# BACK END
*[sonnees](https://github.com/sonnees)* <br>

![arch](https://github.com/sonnees/ZaloLite/assets/110987763/6355f4e8-975e-4242-a387-b97881806fcd)

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
Xem chi tiết tại enpoint `/swagger-index`
### Liên quan đến tài khoản


# FRONT END WEB
<img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052" alt="run-in-android" height="12" width="20"> [Run in web](https://youtu.be/HcMB9w4fMNo)

`APP RUN`
```
npx expo start --port 3005
```
`WEB INIT`
```
npm i
npm run dev
```
`Login` :
```
http://localhost:5173/auth/login
```



# FRONT END APP
```
npx expo start --port 3005
```

