# Fix PowerShell npm Execution Policy Error

## Quick Fix (Temporary - Current Session Only)

Run this in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Then run `npm run dev` normally.

---

## Permanent Fix (Recommended)

### Option 1: Use Command Prompt (cmd.exe) instead of PowerShell
- Open **Command Prompt** (cmd.exe) instead of PowerShell
- Navigate to your project: `cd C:\Users\yashu\Desktop\project1\backend`
- Run: `npm run dev`

### Option 2: Change PowerShell Execution Policy (Requires Admin)

1. **Open PowerShell as Administrator** (Right-click → Run as Administrator)

2. Run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

3. Type `Y` when prompted

4. Close and reopen PowerShell

---

## Alternative: Use npm.cmd directly

Instead of `npm run dev`, use:
```powershell
npm.cmd run dev
```

Or use the full path:
```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

---

## Current Status

✅ Backend server is running in the background using cmd.exe

To start frontend, open a new terminal and run:
```cmd
cd frontend
npm run dev
```

Or use PowerShell with bypass:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
cd frontend
npm run dev
```
