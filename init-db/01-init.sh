#!/bin/bash
set -e

# This script runs when the database container is first created
echo "Initializing AJPS database..."

# The database and user are already created by the environment variables
# You can add additional initialization here if needed

echo "Database initialization completed."
