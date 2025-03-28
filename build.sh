#!/bin/bash
echo "Building Todo Application with Gradle..."

# Check if Gradle wrapper exists
if [ ! -f "./gradlew" ]; then
    echo "Gradle wrapper not found."
    echo "Please ensure you are in the correct directory."
    exit 1
fi

# Make the Gradle wrapper executable
chmod +x ./gradlew

# Build the application with Gradle
./gradlew clean build

if [ $? -ne 0 ]; then
    echo "Gradle build failed!"
    exit 1
fi

echo "Build successful!"
echo
echo "To run the application, use: ./run.sh"
echo "Or use: java -jar build/libs/todo-app-0.0.1-SNAPSHOT.jar"

# Make the scripts executable
chmod +x build.sh
chmod +x run.sh
chmod +x gradlew
