# Troubleshooting Guide - DevOnboard

## Python 3.14 Compatibility Issue

### Problem
```
TypeError: Metaclasses with custom tp_new are not supported.
```

This error occurs because Python 3.14 is too new and has breaking changes that aren't compatible with the current version of Google's protobuf library.

### Solution Options

#### Option 1: Downgrade to Python 3.11 or 3.12 (Recommended)

1. **Download Python 3.12**:
   - Go to https://www.python.org/downloads/
   - Download Python 3.12.x (latest stable)
   - Install it

2. **Create new virtual environment**:
   ```powershell
   cd backend
   # Remove old venv
   Remove-Item -Recurse -Force venv
   
   # Create new venv with Python 3.12
   py -3.12 -m venv venv
   
   # Activate
   venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Run the app**:
   ```powershell
   python app.py
   ```

#### Option 2: Use Specific Protobuf Version

If you must use Python 3.14, try installing a compatible protobuf version:

```powershell
cd backend
venv\Scripts\activate
pip install --upgrade protobuf==4.25.1
pip install --upgrade google-generativeai
python app.py
```

#### Option 3: Use Python 3.11 from Microsoft Store

1. Open Microsoft Store
2. Search for "Python 3.11"
3. Install it
4. Follow Option 1 steps above, using `py -3.11` instead

### Verification

After fixing, you should see:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

## Other Common Issues

### Issue: "GOOGLE_API_KEY is required"

**Solution**: Make sure you have a `.env` file in the backend directory:
```powershell
cd backend
copy .env.example .env
```

The `.env` file should contain:
```
GOOGLE_API_KEY=AIzaSyCavHwMS2a8j33jiIxqIAOKUlLsC3vEepo
```

### Issue: "Failed to clone repository"

**Solution**: Make sure Git is installed:
```powershell
git --version
```

If not installed, download from https://git-scm.com/

### Issue: Frontend "Failed to fetch"

**Solution**: 
1. Make sure backend is running on port 5000
2. Check `frontend/.env` has correct API URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Issue: npm vulnerabilities

The 2 moderate vulnerabilities in npm packages are normal. To fix:
```powershell
cd frontend
npm audit fix
```

Or for breaking changes:
```powershell
npm audit fix --force
```

### Issue: Port already in use

**Backend (Port 5000)**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 5173)**:
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F
```

## Quick Fixes

### Reset Everything

If nothing works, start fresh:

```powershell
# Backend
cd backend
Remove-Item -Recurse -Force venv
py -3.12 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Check Python Version

```powershell
python --version
```

Should show Python 3.11.x or 3.12.x (NOT 3.14)

### Check Node Version

```powershell
node --version
```

Should show v18.x or higher

## Still Having Issues?

1. Check all terminals are in the correct directory
2. Make sure virtual environment is activated (you should see `(venv)` in terminal)
3. Check `.env` files exist in both backend and frontend
4. Make sure ports 5000 and 5173 are not in use
5. Try restarting your computer

## Success Checklist

- [ ] Python 3.11 or 3.12 installed (NOT 3.14)
- [ ] Virtual environment created and activated
- [ ] All dependencies installed without errors
- [ ] `.env` file exists with Google API key
- [ ] Backend starts without errors on port 5000
- [ ] Frontend starts without errors on port 5173
- [ ] Can access http://localhost:5173 in browser

## Contact

If you're still stuck, check:
- README.md for setup instructions
- ARCHITECTURE.md for system design
- BACKEND_CODE.md for backend details