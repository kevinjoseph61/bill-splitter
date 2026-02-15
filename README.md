# 🍽️ Bill Splitter

A simple, intuitive web app to split restaurant bills among friends based on what each person ordered. Works great on both desktop and mobile!

## 🌐 Live Demo

**[https://kevinjoseph61.github.io/bill-splitter/](https://kevinjoseph61.github.io/bill-splitter/)**

## ✨ Features

- **📸 Bill Scanner** - Upload a photo of your bill and auto-detect dishes using OCR
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
   - Upload or take a photo of your receipt
   - Click "Scan Bill" to auto-detect items
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
- **Printed receipts** work better than handwritten bills
- You can **edit detected items** before adding them
- Works offline after initial page load
- Best to crop the required items only from the bills so the OCR would function better

## 🛠️ Tech Stack

- Pure HTML, CSS, and JavaScript
- [Tesseract.js](https://tesseract.projectnaptha.com/) for in-browser OCR
- No server required - everything runs locally in your browser
- Works as a static site (hosted on GitHub Pages)
