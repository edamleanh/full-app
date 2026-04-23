import asyncio
from playwright.async_api import async_playwright
import json

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Twitch might block headless, use a realistic user agent
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        urls = []
        
        # Intercept network requests
        page.on("request", lambda request: urls.append(request.url) if ".m3u8" in request.url else None)
        
        try:
            await page.goto("https://www.twitch.tv/bachdat002", wait_until="networkidle", timeout=15000)
        except Exception as e:
            pass
            
        await asyncio.sleep(5)
        
        with open('twitch_urls.json', 'w') as f:
            json.dump({"requests": urls}, f, indent=2)
            
        await browser.close()
        
        for u in urls:
            print("Found:", u)

asyncio.run(main())
