# Database Setup Guide

## MongoDB Installation Options

### Option 1: Local MongoDB (Recommended for Development)

#### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh
```

#### Windows
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a service

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (free tier M0)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string
7. Update `.env` file with your connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

### Option 3: Docker (Quick Setup)

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Connection string for Docker
MONGO_URI=mongodb://admin:password@localhost:27017/team-task-manager?authSource=admin
```

## Verify Connection

After setting up MongoDB, test the connection:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database Name: team-task-manager
🚀 Server running in development mode on port 5000
```

## Troubleshooting

### Connection Refused
- Make sure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check if port 27017 is available: `lsof -i :27017`

### Authentication Failed
- Verify your username and password in the connection string
- For Atlas, ensure your IP is whitelisted

### Database Not Found
- MongoDB will automatically create the database on first write operation
- No need to manually create the database
