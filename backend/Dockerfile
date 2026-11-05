FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw -v >/dev/null 2>&1 || true
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /opt/app
COPY --from=build /app/target/backend-0.1.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
