#!/bin/bash
set -e

# Socio OS: Weekly Report Generator
# Triggers the Socio-Track agent to generate performance reports for all active merchants.

echo "📊 Generating Weekly Performance Reports..."

# Ensure Hermes CLI is installed
if ! command -v hermes &> /dev/null
then
    echo "❌ Error: 'hermes' command could not be found."
    exit 1
fi

# Run the Socio-Track agent task
echo "Triggering Socio-Track via Hermes..."
hermes bot run Socio-Track --task "Generate weekly performance report for all active merchants. Calculate Net New Revenue and Expansion Revenue. Email reports to merchants via Resend."

echo "✅ Weekly reports generated and queued for delivery."
