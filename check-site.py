import asyncio,json
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  page=await browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:4200',wait_until='networkidle')
  await page.screenshot(path='/home/user/gardening-buddy/desktop-preview.png')
  await page.get_by_role('button',name='Explore the hardware',exact=True).click()
  await page.get_by_role('button',name='Shared I²C',exact=True).click()
  await page.get_by_role('button',name='U1: ESP32-C3 SuperMini. Open component details.').click()
  assert await page.get_by_role('region',name='Component details').is_visible()
  await page.screenshot(path='/home/user/gardening-buddy/exploded-preview.png')
  await page.get_by_role('button',name='Close component details').click()
  await page.get_by_role('button',name='Reassemble',exact=True).click()
  await page.evaluate('window.scrollTo(0,1400)')
  await page.wait_for_function("document.querySelector('.stage-kicker').textContent.includes('LIVE NET MAP')")
  await page.evaluate('window.scrollTo(0,0)')
  await page.wait_for_function("document.querySelector('.stage-kicker').textContent.includes('ASSEMBLED')")
  await page.get_by_role('button',name='Snake plant').click()
  assert await page.locator('.mood-chip.sad').count()==1
  await page.locator('#soil').fill('30')
  assert await page.locator('.mood-chip.happy').count()==1
  await page.get_by_role('button',name='Peace lily').click()
  assert await page.locator('.mood-chip.neutral').count()==1
  await page.get_by_role('button',name='Sweet basil').click()
  assert await page.locator('.mood-chip.happy').count()==1
  await page.locator('#simulator').screenshot(path='/home/user/gardening-buddy/simulator-preview.png')
  await page.get_by_role('tab',name='03 / Carrier PCB').click()
  await page.get_by_role('button',name='Explore drawing',exact=True).click()
  await page.get_by_role('button',name='Zoom in',exact=True).click()
  assert '125%' in await page.locator('.lightbox-head').inner_text()
  await page.keyboard.press('Escape')
  assert await page.get_by_role('dialog').count()==0
  assert await page.locator('.team-grid a[href^="mailto:"]').count()==4
  assert await page.locator('.bibliography details').count()==11
  assert await page.locator('.datasheet-grid a').count()==9
  desktop_overflow=await page.evaluate('document.documentElement.scrollWidth>innerWidth')
  await page.set_viewport_size({'width':390,'height':844})
  await page.evaluate('window.scrollTo(0,0)')
  await page.wait_for_function("document.querySelector('.stage-kicker').textContent.includes('ASSEMBLED')")
  await page.screenshot(path='/home/user/gardening-buddy/mobile-preview.png')
  mobile_overflow=await page.evaluate('document.documentElement.scrollWidth>innerWidth')
  await page.get_by_role('button',name='Open navigation').click()
  assert await page.get_by_role('link',name='Engineering',exact=True).is_visible()
  await page.get_by_role('link',name='Engineering',exact=True).click()
  assert await page.get_by_role('button',name='Open navigation').count()==1
  await page.screenshot(path='/home/user/gardening-buddy/mobile-full.png',full_page=True)
  print(json.dumps({'runtime_errors':errors,'desktop_horizontal_overflow':desktop_overflow,'mobile_horizontal_overflow':mobile_overflow,'tests':'scroll, reassembly, module hotspot, bus filter, simulator moods + sliders, gallery tabs, zoom + Escape, team and reference counts, mobile navigation passed'}))
  await browser.close()

asyncio.run(main())