# MacBook Setup Guide

This guide helps you run Musu PDF when moving to a macOS laptop.

## 1) Install Required Tools

Use Homebrew.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew update
```

Install runtimes:

```bash
brew install node@20
brew install openjdk@21
brew install maven
brew install python@3.11
brew install tesseract
brew install libreoffice
brew install redis
brew install mongodb-community
```

Optional but recommended:

```bash
brew install --cask docker
```

## 2) Configure Shell Paths

Add to your shell profile (zsh default on macOS):

```bash
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/opt/homebrew/opt/openjdk@21/include"' >> ~/.zshrc
source ~/.zshrc
```

## 3) Verify Install

```bash
node -v
npm -v
java -version
mvn -version
python3 --version
pip3 --version
redis-server --version
mongod --version
tesseract --version
libreoffice --version
```

## 4) Start Project Quickly (Recommended)

From project root:

```bash
scripts/start-local-memory.sh
```

This runs:
- Frontend on 5173
- Backend on 8080 in memory job mode

Stop services:

```bash
scripts/stop-local.sh
```

## 5) Full Mode With Mongo + Worker

Start Mongo and Redis:

```bash
brew services start mongodb-community
brew services start redis
```

Create and activate worker venv:

```bash
cd worker
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

Start full stack helper:

```bash
scripts/start-local-full.sh
```

## 6) Known Differences on macOS

- Shell is usually `zsh`, not `bash`.
- Homebrew prefix is `/opt/homebrew` on Apple Silicon.
- If Python packages fail to build, install Xcode Command Line Tools:

```bash
xcode-select --install
```

## 7) Troubleshooting

Port already in use:

```bash
lsof -i :5173
lsof -i :8080
lsof -i :8090
```

Then stop offending process:

```bash
kill -9 <PID>
```

Worker not found by backend:
- Verify worker runs on `http://localhost:8090`.
- Verify `WORKER_BASE_URL` if overridden.

Mongo connection error:
- Verify service is running:

```bash
brew services list | grep mongo
```

Memory mode fallback:
- If Mongo is unavailable, use `scripts/start-local-memory.sh`.
- Job metadata is non-persistent in this mode.
