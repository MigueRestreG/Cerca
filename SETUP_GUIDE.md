# Cerca - Setup Guide for Android & iOS Development

## 🚨 Current Issues

Your development environment is missing:
- ❌ Android SDK
- ❌ Android Debug Bridge (adb)
- ❌ ANDROID_HOME environment variable
- ❌ iOS development tools (on Windows, iOS can only be tested via Expo Go or EAS Build)

---

## 🤖 Android Development Setup

### Step 1: Install Android Studio

1. **Download Android Studio**
   - Go to https://developer.android.com/studio
   - Download and install Android Studio

2. **Run Android Studio**
   - Open Android Studio
   - It will guide you to install Android SDK
   - Install the following components:
     - Android SDK Platform (latest version)
     - Android SDK Platform Tools
     - Android Emulator
     - Intel HAXM (if using Intel processor)

3. **Note the Android SDK Location**
   - During setup, note where Android SDK is installed
   - Default location: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`

### Step 2: Configure Environment Variables

1. **Open Environment Variables**
   - Press `Win + X` → Click "System"
   - Click "Advanced system settings"
   - Click "Environment Variables" button
   - Click "New" under "User variables"

2. **Add ANDROID_HOME Variable**
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
   - Click OK

3. **Update PATH Variable**
   - Select "Path" in User variables
   - Click "Edit"
   - Click "New"
   - Add: `%ANDROID_HOME%\platform-tools`
   - Click OK, OK, OK

4. **Restart Your Terminal**
   - Close and reopen PowerShell
   - Restart VS Code

### Step 3: Verify Android Setup

```powershell
# Verify ANDROID_HOME is set
$env:ANDROID_HOME

# Verify adb is accessible
adb version

# Verify sdkmanager is accessible
sdkmanager --list_installed
```

### Step 4: Create/Start Android Emulator

**Option A: Using Android Studio UI**
1. Open Android Studio
2. Go to AVD Manager (Tools → Device Manager)
3. Create a new Virtual Device
4. Start the emulator

**Option B: Using Command Line**
```powershell
# List available emulators
emulator -list-avds

# Start an emulator (replace "Pixel_5_API_30" with your emulator name)
emulator -avd Pixel_5_API_30
```

### Step 5: Build and Run on Android

```powershell
cd "c:\Users\migue\OneDrive\Documents\Riwi\Cerca"

# Start development server
npm run dev

# In another terminal, run on Android
npm run android
```

---

## 🍎 iOS Development Setup

### ⚠️ Note for Windows Users

iOS development **requires macOS**. On Windows, you have two options:

#### Option 1: Use Expo Go (Quickest - No Mac Needed)
```powershell
npm run dev
```
- Scan QR code on your iPhone with Expo Go app
- No setup required!

#### Option 2: Use EAS Build (Cloud Build - No Mac Needed)
```powershell
npm install -g eas-cli
eas login
eas build --platform ios
```
- Builds on Expo's servers
- Returns a `.ipa` file you can test via TestFlight

#### Option 3: Use a Mac (Full Setup)
If you have access to a Mac:

1. **Install Xcode**
   ```bash
   xcode-select --install
   ```

2. **Install iOS dependencies**
   ```bash
   brew install cocoapods
   ```

3. **Run on iOS**
   ```bash
   npm run ios
   ```

---

## 🚀 Complete Development Workflow

### Quickest Start (Using Expo Go)

```powershell
# Terminal 1: Start dev server
cd "c:\Users\migue\OneDrive\Documents\Riwi\Cerca"
npm install
npm run dev

# Terminal 2 (after emulator starts): Run on Android
npm run android

# On iPhone: 
# 1. Download Expo Go from App Store
# 2. Scan QR code from dev server
# 3. App loads in Expo Go
```

### Full Development Setup (After Installing Tools)

```powershell
# Start Android Emulator first
emulator -avd Pixel_5_API_30

# Terminal 1: Development server
npm run dev

# Terminal 2: Build for Android
npm run android

# On iOS: Scan QR code in Expo Go (or use Mac + npm run ios)
```

---

## 🔧 Troubleshooting

### "Failed to resolve Android SDK path"
**Solution:**
```powershell
# Set ANDROID_HOME in current session
$env:ANDROID_HOME = "C:\Users\[YourUsername]\AppData\Local\Android\Sdk"
```

### "adb" command not found
**Solution:**
- Add `%ANDROID_HOME%\platform-tools` to PATH environment variable
- Restart terminal

### Android Emulator won't start
**Solutions:**
- Check if Hyper-V is enabled in Windows
- Try using AVD Manager in Android Studio
- Ensure you have enough disk space (emulator needs ~5GB)

### Port already in use
```powershell
# Find process using port 8081
Get-NetTCPConnection -LocalPort 8081

# Kill the process (if needed)
Stop-Process -Id [PID] -Force
```

### npm install fails
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install
```

---

## 📋 Checklist

- [ ] Android Studio installed
- [ ] Android SDK installed (via Android Studio)
- [ ] `ANDROID_HOME` environment variable set
- [ ] `%ANDROID_HOME%\platform-tools` added to PATH
- [ ] Terminal restarted
- [ ] `adb version` works
- [ ] Android Emulator created/running
- [ ] `npm install` successful
- [ ] `npm run dev` starts dev server
- [ ] `npm run android` builds for Android

---

## 🎯 Next Steps

1. **Complete the Setup**
   - Follow steps above for Android setup
   - Create Android Emulator

2. **Verify Installation**
   - Run `npm run dev`
   - Start Android Emulator
   - Run `npm run android`

3. **Start Development**
   - Edit files in `src/` or `app/` directories
   - Changes reload automatically (Fast Refresh)

4. **iOS Testing**
   - Use Expo Go on iPhone (easiest)
   - Or use Mac with Xcode (full setup)
   - Or use EAS Build for cloud builds

---

## 📚 Resources

- [Android Studio Download](https://developer.android.com/studio)
- [Android SDK Setup](https://developer.android.com/docs/quality-guidelines/core-app-quality)
- [Expo Setup Documentation](https://docs.expo.dev/get-started/installation/)
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

**Status: Ready to Build** ✅ (After completing the checklist above)
