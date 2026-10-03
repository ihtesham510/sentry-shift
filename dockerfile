FROM oven/bun:latest AS frontend-builder

WORKDIR /app/web

COPY web/bun.lock web/package.json ./

RUN bun install

COPY web/ ./

RUN bun run build


FROM rust:1.90-slim AS backend-builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
  pkg-config \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./

RUN mkdir src && echo "fn main(){}" > src/main.rs

RUN cargo build --release
RUN rm -rf src

COPY src ./src
RUN touch src/main.rs
RUN cargo build --release


FROM debian:bookworm-slim AS runtime

RUN apt-get update && apt-get install -y \
  ca-certificates \
  libssl3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-builder /app/target/release/test-rust /app/server
COPY --from=frontend-builder /app/web/dist /app/web/dist

EXPOSE 3000

CMD ["/app/server"]
