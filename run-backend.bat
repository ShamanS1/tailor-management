@echo off

REM Start Customer Service
start cmd /k "cd Backend\customer && npm start"

REM Start Tailor Service
start cmd /k "cd Backend\tailor && npm start"

REM Start Order Service
start cmd /k "cd Backend\order && npm start"

REM Start Measurement Service
start cmd /k "cd Backend\measurement && npm start"

REM Start Review Service
start cmd /k "cd Backend\review && npm start"

REM Start User Service
start cmd /k "cd Backend\user && npm start"

REM Start API Gateway
start cmd /k "cd Backend\apigateway && npm start"

echo All backend services started.
pause