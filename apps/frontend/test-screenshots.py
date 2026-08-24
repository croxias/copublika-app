from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    # Test join-batch page
    page.goto("http://localhost:3000/join-batch")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="D:/Data - Alieja Web/join-batch-screenshot.png", full_page=True)
    print("join-batch screenshot saved")
    
    # Test register page
    page.goto("http://localhost:3000/register")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="D:/Data - Alieja Web/register-screenshot.png", full_page=True)
    print("register screenshot saved")
    
    browser.close()
