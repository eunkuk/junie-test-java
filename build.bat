@echo off
echo Building Todo Application with Gradle...

:: Check if Gradle wrapper exists
if not exist gradlew.bat (
    echo Gradle wrapper not found.
    echo Please ensure you are in the correct directory.
    exit /b 1
)

:: Build the application with Gradle
call gradlew.bat clean build

if %errorlevel% neq 0 (
    echo Gradle build failed!
    exit /b %errorlevel%
)

echo Build successful!
echo.
echo To run the application, use: run.bat
echo Or use: java -jar build\libs\todo-app-0.0.1-SNAPSHOT.jar
