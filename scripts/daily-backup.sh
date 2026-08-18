#!/bin/bash
set -e

# Socio OS: Daily Backup Script
# Archives agent memory, CRM configs, and merchant data.

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
ARCHIVE_NAME="socio-backup-$TIMESTAMP.tar.gz"

echo "📦 Starting Socio OS Daily Backup at $TIMESTAMP"

mkdir -p "$BACKUP_DIR"

# Ensure we don't back up previous backups
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" \
  --exclude="./backups" \
  --exclude="node_modules" \
  --exclude=".git" \
  .

echo "✅ Backup created: $BACKUP_DIR/$ARCHIVE_NAME"
echo "☁️ (Optional) Add AWS CLI command here to sync to S3: aws s3 cp $BACKUP_DIR/$ARCHIVE_NAME s3://socio-backups/"
