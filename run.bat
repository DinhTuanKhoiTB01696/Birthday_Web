@echo off
:: Chuyen thu muc lam viec ve thu muc chua file bat nay
cd /d "%~dp0"
:: Thiet lap font UTF-8 de hien thi tot hon
chcp 65001 > nul
title Khoi dong "Mot Vu Tru Nho Danh Cho An"

echo =======================================================
echo     KHOI DONG DU AN: MOT VU TRU NHO DANH CHO AN
echo =======================================================
echo.

:: Kiem tra thu muc node_modules
if exist node_modules goto START_SERVER

echo [INFO] Thu muc node_modules chua ton tai. Dang tien hanh cai dat dependencies...
echo [INFO] Qua trinh nay co the mat it phut. Vui long cho...
echo.

call npm install
if errorlevel 1 goto INSTALL_FAILED

echo.
echo [SUCCESS] Da cai dat xong dependencies thanh cong!
echo.
goto START_SERVER

:INSTALL_FAILED
echo.
echo [ERROR] Cai dat dependencies that bai! Vui long dam bao ban da cai dat Node.js.
echo.
pause
exit /b 1

:START_SERVER
echo [INFO] Dang khoi dong server phat trien (Vite)...
echo [INFO] Sau khi khoi dong, hay click vao link http://localhost:3000 de trai nghiem!
echo.
echo =======================================================
echo.

call npm run dev
if errorlevel 1 goto DEV_FAILED
goto END

:DEV_FAILED
echo.
echo [ERROR] Khong the khoi dong server phat trien. Vui long kiem tra lai.
echo.
pause
exit /b 1

:END
pause
