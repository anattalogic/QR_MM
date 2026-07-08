Perfect! Here's a **professional `README.md`** file you can directly copy and paste into your repository. It explains the purpose, setup, usage, and configuration options.

---

## 📄 `README.md` – Copy this content

```markdown
# 🖼️ QR Code Merchant Name Overlay

This repository automatically fixes exported QR code images by overlaying the **Burmese merchant name** in **bright yellow text** on a dark background, covering the original blue background and text.

> **Problem solved:** When exporting QR codes from the system, the merchant name (Burmese text) on the image is often garbled or missing. This tool takes your Excel file, downloads each QR image, extracts the merchant name from the filename, and overlays it cleanly.

---

## 🚀 How It Works

1. You upload your Excel file (`.xlsx`, `.xlsb`, or `.csv`) containing a column with QR code image URLs.
2. A **GitHub Action** runs automatically (or manually) on GitHub's servers.
3. The script:
   - Reads the Excel file.
   - Finds the QR code column (looks for `QR Code`, `QR`, or `Image`).
   - Extracts the merchant name either from a **"Merchant Business Name"** column OR from the filename between `qr_` and `.png`.
   - Downloads each QR image directly (no CORS issues).
   - Overlays the name in **yellow text** on a dark semi-transparent bar at the bottom 25% of the image.
   - Packages all processed images into a ZIP file.
4. You download the ZIP from the **Actions** tab.

---

## 📂 Repository Structure

```
your-repo/
├── .github/
│   └── workflows/
│       └── process.yml      # GitHub Action workflow
├── overlay.js               # Main processing script
├── package.json             # Node.js dependencies
├── Merchant_V.xlsx          # ⚠️ Your Excel file (rename to match)
└── README.md                # This file
```

---

## 🛠️ Setup Instructions

### 1. Fork or Create this Repository

- Create a new repository on GitHub (or use this one).
- Add the following files (already included in this repo):
  - `.github/workflows/process.yml`
  - `overlay.js`
  - `package.json`

### 2. Upload Your Excel File

- Upload your Excel file to the **root directory** of the repository.
- **Important:** The script expects the file to be named `Merchant_V.xlsx` by default.
- If your file has a different name, edit `INPUT_FILE` in `overlay.js`:

```javascript
const INPUT_FILE = 'YourFileName.xlsx';   // Change this line
```

### 3. Commit and Push

- Commit the changes. The GitHub Action will **automatically trigger**.

---

## ▶️ How to Run the Workflow

### Automatic Run
- The workflow runs automatically on every push to the `main` branch.

### Manual Run
1. Go to the **Actions** tab in your repository.
2. Click on the **"Process QR Codes"** workflow on the left.
3. Click the **"Run workflow"** dropdown button.
4. Click the green **"Run workflow"** button.

---

## 📥 Downloading the Results

1. After the workflow completes, go to the **Actions** tab.
2. Click on the specific workflow run.
3. Scroll down to the **Artifacts** section.
4. Click **`updated-qr-codes`** to download the ZIP file containing all processed QR images.

---

## ⚙️ Configuration Options

All settings can be tweaked directly in `overlay.js`:

| Setting | Location in `overlay.js` | Description |
| :------ | :----------------------- | :---------- |
| **Input file name** | `const INPUT_FILE = 'Merchant_V.xlsx';` | Change to match your Excel file name. |
| **Overlay height** | `const rectHeight = Math.floor(height * 0.25);` | Change `0.25` (25%) to cover more (e.g., `0.30`) or less (e.g., `0.20`) of the bottom. |
| **Text color** | `fill="#FFD700"` | Change to any hex color (e.g., `#FFFFFF` for white). |
| **Background color** | `fill="rgba(0, 0, 0, 0.7)"` | Change opacity (0.7) or color. |
| **Font size** | `const fontSize = Math.min(rectHeight * 0.5, 40);` | Adjust the max font size (currently 40px). |

---

## 📋 Column Detection

The script automatically looks for these columns (case‑insensitive):

- **QR Code column**: searches for `QR Code`, `QR`, or `Image`.
- **Merchant Name column** (optional): searches for `Merchant Business Name` or `Owner Name`.

If a **Merchant Name column** is missing, the script **extracts the name from the QR URL filename** – specifically the part between `qr_` and `.png`.

**Example URL:**
```
.../qr_%E1%80%A1%E1%80%B1%E1%80%AC%E1%80%84%E1%80%BA... .png
```
✅ Extracted name: `အောင်ချမ်းသာ စတိုး` (decoded from URL encoding)

---

## 🧪 Supported File Formats

- `.xlsx` (Excel)
- `.xlsb` (Excel Binary)
- `.csv` (Comma Separated Values)

---

## ⚠️ Troubleshooting

| Issue | Solution |
| :---- | :------- |
| **Workflow fails** | Check the **Actions** tab logs. Most common issue: the Excel file name doesn't match `INPUT_FILE`. |
| **All images fail (0 successes)** | Ensure the QR column exists and contains valid S3 URLs. Check the logs for specific errors (e.g., network timeouts). |
| **Burmese text not rendering** | The script uses `sharp` with SVG and includes fallback fonts (`Noto Sans Myanmar`, `Pyidaungsu`). If issues persist, try adjusting the font family in the SVG `<text>` tag. |
| **Text is cut off** | Increase the bottom coverage: change `0.25` to `0.30` in `overlay.js`. |

---

## 📦 Dependencies

- [xlsx](https://www.npmjs.com/package/xlsx) – Read Excel files.
- [axios](https://www.npmjs.com/package/axios) – Download images.
- [sharp](https://www.npmjs.com/package/sharp) – High‑performance image processing.
- [archiver](https://www.npmjs.com/package/archiver) – Create ZIP files.

All are installed automatically during the GitHub Action run.

---

## 📝 License

This project is for internal/temporary use – feel free to adapt it as needed.

---

## 🙋 Need Help?

If you encounter any issues, check the **Actions** tab logs for detailed error messages. You can also open an issue in this repository.
```

---

## 📥 How to Add It

1. In your GitHub repository, click **Add file** → **Create new file**.
2. Name the file exactly `README.md`.
3. **Paste the entire content above** into the editor.
4. Click **Commit new file** at the bottom.

Now your repository has a clear, professional README that explains everything! 🚀
