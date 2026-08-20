import os
import subprocess
import time

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_DIR = r"c:\Users\Darshan\Campus---Connect"
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "assets", "screenshots")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

pages = [
    ("home.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/index.html", "1440,900"),
    ("login.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/login.html", "1440,900"),
    ("portal.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/portal.html", "1440,900"),
    ("roles_student.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/roles.html?role=student", "1440,900"),
    ("roles_admin.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/roles.html?role=admin", "1440,900"),
    ("roles_technician.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/roles.html?role=technician", "1440,900"),
    ("roles_faculty.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/roles.html?role=faculty", "1440,900"),
    ("feed.png", f"file:///{BASE_DIR.replace(chr(92), '/')}/feed.html", "1440,900"),
]

for filename, url, window_size in pages:
    out_file = os.path.join(SCREENSHOTS_DIR, filename)
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={window_size}",
        "--hide-scrollbars",
        "--virtual-time-budget=2000",
        f"--screenshot={out_file}",
        url
    ]
    print(f"Capturing {filename} from {url}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
        print(f"  -> Successfully captured {filename} ({os.path.getsize(out_file)} bytes)")
    else:
        print(f"  -> Failed or empty {filename}: {res.stderr}")

print("\nAll screenshot captures completed.")
