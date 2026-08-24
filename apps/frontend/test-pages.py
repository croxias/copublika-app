from playwright.sync_api import sync_playwright
import os

output_dir = r"D:\Data - Alieja Web\app-copublika\apps\frontend\screenshots"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    # Test join-batch page
    try:
        page.goto("http://localhost:3000/join-batch", wait_until="networkidle", timeout=15000)
        page.wait_for_load_state("networkidle")
        page.screenshot(path=os.path.join(output_dir, "join-batch.png"), full_page=True)
        print("join-batch screenshot saved")
    except Exception as e:
        print(f"join-batch error: {e}")
    
    # Test register page
    try:
        page.goto("http://localhost:3000/register", wait_until="networkidle", timeout=15000)
        page.wait_for_load_state("networkidle")
        page.screenshot(path=os.path.join(output_dir, "register.png"), full_page=True)
        print("register screenshot saved")
    except Exception as e:
        print(f"register error: {e}")
    
    browser.close()
