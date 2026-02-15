# 🍽️ Bill Splitter

A simple, intuitive web app to split restaurant bills among friends based on what each person ordered. Works great on both desktop and mobile!

## 🌐 Live Demo

**[https://kevinjoseph61.github.io/bill-splitter/](https://kevinjoseph61.github.io/bill-splitter/)**

## ✨ Features

- **📸 Bill Scanner** - Upload, paste, or capture a photo of your bill and auto-detect dishes using OCR
- **✂️ Smart Cropping** - Crop to just the items section for better accuracy
- **📷 Camera Capture** - Take a photo directly from your device camera
- **📋 Clipboard Paste** - Just press Ctrl+V to paste a screenshot
- **Mobile-Friendly** - Tap-to-assign interface optimized for touch screens
- **Drag & Drop** - Drag dishes onto people on desktop
- **Automatic Splitting** - Shared dishes automatically split costs equally
- **Cashback Support** - Enter percentage (e.g., `10%`) or fixed amount
- **Real-time Calculations** - See each person's share update instantly
- **Copy Summary** - One-click copy for easy sharing on WhatsApp/messages
- **Responsive Design** - Adapts seamlessly to any screen size
- **100% Private** - All processing happens in your browser, no data sent to servers

## 🚀 How to Use

1. Enter restaurant details:
   - Restaurant name (optional)
   - Total amount (optional)
   - **Discounted(Final) Amount** *(required)* - The actual amount to be split
   - Cashback (optional) - Use `%` for percentage or enter fixed amount
2. **(Optional) Scan your bill:**
   - **Upload**: Click "📁 Upload Image" button
   - **Camera**: Click "📷 Take Photo" to capture with your camera
   - **Paste**: Press **Ctrl+V** to paste from clipboard
   - **Drag & Drop**: Drop an image onto the upload area
   - **Crop** the image to select just the items area for better accuracy
   - Click "✂️ Crop & Scan" or "🔍 Scan Full Image"
   - Edit detected items if needed, then add them
3. Add the people splitting the bill
4. Add dishes manually OR use the scanner
5. **Assign dishes to people:**
   - 📱 **Mobile**: Tap a dish → Select people in the popup
   - 🖥️ **Desktop**: Drag dishes and drop onto people
6. For shared dishes, assign the same dish to multiple people
7. View the summary and click **Copy Summary** to share

## 📸 Bill Scanner Tips

- Use a **clear, well-lit photo** for best results
- **Crop to just the items section** - this significantly improves accuracy
- **Printed receipts** work better than handwritten bills
- The scanner **automatically removes quantities** from item names (e.g., "Pizza 2" → "Pizza")
- You can **edit detected items** before adding them
- Works offline after initial page load

## 🛠️ Tech Stack

- Pure HTML, CSS, and JavaScript
- [Tesseract.js](https://tesseract.projectnaptha.com/) for in-browser OCR
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/) for image cropping
- No server required - everything runs locally in your browser
- Works as a static site (hosted on GitHub Pages)
