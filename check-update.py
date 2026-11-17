import asyncio, json
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  context=await browser.new_context(viewport={'width':1440,'height':900},permissions=['clipboard-read','clipboard-write'])
  page=await context.new_page(); errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:4200',wait_until='networkidle')
  assert await page.locator('header .nav-cta').count()==0
  assert await page.locator('header nav a').all_text_contents()==['The System','Simulator','Engineering & Schematic','References & Datasheets','Contact Team']
  assert await page.locator('header img').get_attribute('src')=='/images/university-header.png'
  await page.screenshot(path='/home/user/gardening-buddy/updated-header.png')
  assert await page.locator('#engineering img').count()==1
  assert await page.locator('#engineering img').get_attribute('src')=='/images/schematic.svg'
  assert await page.locator('#engineering [role=tab]').count()==0
  assert await page.locator('img[src*="prototype"],img[src*="pcb"],img[src*="enclosure"],img[src*="studio-schematic"]').count()==0
  assert await page.locator('.hardware-card').count()==8
  table=page.locator('.engineering-nets')
  assert await table.locator('tbody tr').count()==11
  for name,count in [('Power Rail',3),('100 kHz I²C',2),('High-Speed SPI',5),('Soil ADC',1),('All nets',11)]:
   await table.get_by_role('button',name=name).click()
   assert await table.locator('tbody tr').count()==count
  await page.locator('#engineering').screenshot(path='/home/user/gardening-buddy/updated-engineering.png')
  await page.get_by_role('button',name='Explore drawing',exact=True).click()
  await page.get_by_role('button',name='Zoom in',exact=True).click()
  assert '125%' in await page.locator('.lightbox-head').inner_text()
  pan=page.locator('.pan-area');box=await pan.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+80,y+50);await page.mouse.up()
  assert '80px' in await page.locator('.pan-area img').get_attribute('style')
  await page.get_by_role('button',name='Reset zoom and pan').click()
  assert '100%' in await page.locator('.lightbox-head').inner_text()
  await page.keyboard.press('Escape');assert await page.locator('dialog').count()==0
  assert await page.locator('main #references').count()==1
  assert await page.locator('main #team').count()==1
  assert await page.locator('footer #team').count()==0
  assert await page.locator('.bibliography details[open]').count()==11
  assert await page.locator('.datasheet-grid a').count()==9
  assert await page.locator('.contact-card').count()==4
  emails=['bader.alrayes.2026@uni.strath.ac.uk','hamza.abdelhadi.2026@uni.strath.ac.uk','ahmed.habib.2026@uni.strath.ac.uk','ahmed.younes.2026@uni.strath.ac.uk']
  for i,email in enumerate(emails):
   card=page.locator('.contact-card').nth(i)
   assert await card.locator('.contact-actions a').get_attribute('href')=='mailto:'+email
   await card.get_by_role('button',name='Copy email').click()
   assert await page.evaluate('navigator.clipboard.readText()')==email
   assert await card.locator('.copy-status').inner_text()=='Email copied'
  await page.locator('#team').screenshot(path='/home/user/gardening-buddy/updated-contacts.png')
  overflow=[]
  for width,height in [(1440,900),(390,844),(360,780)]:
   await page.set_viewport_size({'width':width,'height':height})
   overflow.append({'width':width,'overflow':await page.evaluate('document.documentElement.scrollWidth>innerWidth')})
   if width==390:
    await page.evaluate('window.scrollTo(0,0)');await page.screenshot(path='/home/user/gardening-buddy/updated-mobile.png')
    await page.get_by_role('button',name='Open navigation').click()
    await page.get_by_role('link',name='Contact Team',exact=True).click()
    assert await page.get_by_role('button',name='Open navigation').count()==1
    await page.locator('#team').screenshot(path='/home/user/gardening-buddy/updated-mobile-contacts.png')
  assert not errors and not any(v['overflow'] for v in overflow)
  print(json.dumps({'runtime_errors':errors,'viewports':overflow,'tests':'five header links, transparent university logo, schematic-only viewer with zoom/pan/reset/Escape, all net filters, 8 native hardware cards, 11 open reference findings, 9 datasheets, main-body contacts, four verified clipboard + mailto controls, mobile navigation passed'}))
  await browser.close()

asyncio.run(main())