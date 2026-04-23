import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Using a realistic user agent
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        # Inject script to hook fetch and XHR before page loads
        hook_script = """
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || "";
            if (url.includes('.m3u8') || url.includes('.flv') || url.includes('player_live_api.php')) {
                console.log('HOOK FETCH:', url);
            }
            return originalFetch.apply(this, args);
        };
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('.m3u8') || url.includes('.flv') || url.includes('player_live_api.php')) {
                console.log('HOOK XHR:', url);
            }
            return originalXhrOpen.apply(this, arguments);
        };
        """
        await page.add_init_script(hook_script)
        
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("request", lambda req: print(f"REQ: {req.url}") if ".m3u8" in req.url or "player_live_api.php" in req.url else None)
        
        try:
            await page.goto("https://play.onlive.vn/blvhoangluan/124467", wait_until="networkidle", timeout=15000)
        except Exception:
            pass
            
        await asyncio.sleep(5)
        await browser.close()

asyncio.run(main())
