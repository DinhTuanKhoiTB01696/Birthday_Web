@echo off
:: Thiết lập font chữ hiển thị UTF-8 để không bị lỗi tiếng Việt trong CMD
chcp 65001 > nul
title Khởi động "Một Vũ Trụ Nhỏ Dành Cho Ân"

echo =======================================================
echo     KHỞI ĐỘNG DỰ ÁN: MỘT VŨ TRỤ NHỎ DÀNH CHO ÂN
echo =======================================================
echo.

:: Kiểm tra thư mục node_modules
if not exist node_modules (
    echo [INFO] Thư mục node_modules chưa tồn tại. Đang tiến hành cài đặt dependencies...
    echo [INFO] Quá trình này có thể mất ít phút. Vui lòng chờ...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Cài đặt dependencies thất bại! Vui lòng đảm bảo bạn đã cài đặt Node.js.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Đã cài đặt xong dependencies thành công!
    echo.
) else (
    echo [INFO] Thư mục node_modules đã tồn tại. Bỏ qua bước cài đặt.
    echo.
)

echo [INFO] Đang khởi động server phát triển (Vite)...
echo [INFO] Sau khi khởi động, hãy click vào link http://localhost:3000 để trải nghiệm!
echo.
echo =======================================================
echo.

:: Chạy server Vite
call npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Không thể khởi động server phát triển. Vui lòng kiểm tra lại.
    echo.
    pause
    exit /b 1
)

pause
