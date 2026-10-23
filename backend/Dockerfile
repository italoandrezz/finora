FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
COPY src src
RUN --mount=type=cache,target=/root/.m2 ./mvnw -B -ntp -DskipTests package

FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl && addgroup -S finora && adduser -S finora -G finora
WORKDIR /app
COPY --from=build /workspace/target/finora-0.0.1-SNAPSHOT.jar app.jar
USER finora
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
