@echo off
echo Running Todo Application...

:: Check if the JAR file exists
if not exist build\libs\todo-app-0.0.1-SNAPSHOT.jar (
    echo JAR file not found. Please build the application first using build.bat
    exit /b 1
)

:: Run the Spring Boot application
echo Starting Spring Boot application...
echo The application will be available at http://localhost:8080
echo Press Ctrl+C to stop the application
echo.
java -jar build\libs\todo-app-0.0.1-SNAPSHOT.jar
