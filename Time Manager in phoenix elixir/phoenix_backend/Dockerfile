# Use an official Elixir runtime as a parent image.
FROM elixir:latest

RUN apt-get update && \
  apt-get install -y postgresql-client

# Create app directory and copy the Elixir projects into it.
RUN mkdir /app
COPY . /app
WORKDIR /app

# Install Hex package manager.
RUN mix local.hex --force

# Install dependencies
RUN mix deps.get

# Mac fix
RUN mix local.rebar --force

# Compile the project.
RUN mix do compile

CMD ["/app/entrypoint.sh"]