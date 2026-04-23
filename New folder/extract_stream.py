import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        async def handle_response(response):
            if "player_live_api.php" in response.url or "station" in response.url:
                try:
                    text = await response.text()
                    print(f"URL: {response.url}")
                    print(f"Response: {text}")
                except Exception:
                    pass
        
        page.on("response", handle_response)
        
        try:
            await page.goto("https://play.onlive.vn/blvhoangluan/124467", wait_until="networkidle", timeout=10000)
        except Exception as e:
            pass
            
        await asyncio.sleep(2)
        await browser.close()

asyncio.run(main())
