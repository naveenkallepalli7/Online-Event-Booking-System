# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 – Build
#   Uses the official Maven image with Java 17 to compile and package the app.
#   The resulting fat JAR is copied to the next stage so the builder tools
#   (Maven, JDK source files, etc.) are NOT included in the final image.
# ─────────────────────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set a working directory inside the container
WORKDIR /app

# Copy dependency manifests first – Docker layer-caching means Maven only
# re-downloads dependencies when pom.xml actually changes.
COPY pom.xml .

# Download all dependencies (offline cache layer)
RUN mvn dependency:go-offline -B

# Copy the full source tree
COPY src ./src

# Package the application, skipping tests (tests can run in CI separately)
RUN mvn package -DskipTests -B


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 – Runtime
#   Uses a slim JRE-only image (no compiler, no Maven) to keep the final
#   image as small and secure as possible.
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime

# Install a minimal set of tools used for health-checking
RUN apk add --no-cache curl

# Create a non-root user for security best-practice
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Create a directory for H2 database storage and set permissions
RUN mkdir /app/data && chown appuser:appgroup /app/data

# Copy only the fat JAR from the builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Give ownership to the non-root user
RUN chown appuser:appgroup app.jar

USER appuser

# The port your Spring Boot app listens on (default 8080)
EXPOSE 8080

# ─────────────────────────────────────────────────────────────────────────────
# JVM tuning flags:
#   -XX:+UseContainerSupport          → respect cgroup CPU/memory limits
#   -XX:MaxRAMPercentage=75.0         → use up to 75 % of container RAM for heap
#   -Djava.security.egd=...urandom    → faster startup (avoids /dev/random block)
#
# PostgreSQL environment variables (pass via -e or docker-compose / k8s secrets):
#   DB_URL        → jdbc:postgresql://<host>:<port>/<dbname>
#   DB_USERNAME   → postgres DB user
#   DB_PASSWORD   → postgres DB password
#   JWT_SECRET    → HS256 signing key (min 32 chars)
# ─────────────────────────────────────────────────────────────────────────────
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
