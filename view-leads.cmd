@echo off
cd /d "%~dp0"
node --env-file-if-exists=.env scripts/leads.cjs --open
pause
