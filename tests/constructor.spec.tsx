import { test, expect } from '@playwright/test';

const BUN = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  __v: 0
};

const MAIN = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  __v: 0
};

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.route('**/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [BUN, MAIN] })
    });
  });

  await page.route('**/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Test burger',
          order: { number: 12345 }
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@test.com', name: 'Test User' }
      })
    });
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
});

test('добавление ингредиента из списка в конструктор', async ({ page }) => {
  await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(BUN.name)).toBeVisible();

  // Добавляем булку
  await page.evaluate((name) => {
    Array.from(document.querySelectorAll('li')).forEach((item) => {
      if (item.textContent?.includes(name)) {
        const btn = item.querySelector('button');
        if (btn) (btn as HTMLElement).click();
      }
    });
  }, BUN.name);
  await page.waitForTimeout(500);

  await expect(page.getByText(`${BUN.name} (верх)`)).toBeVisible();
  await expect(page.getByText(`${BUN.name} (низ)`)).toBeVisible();

  // Добавляем начинку
  await page.evaluate((name) => {
    Array.from(document.querySelectorAll('li')).forEach((item) => {
      if (item.textContent?.includes(name)) {
        const btn = item.querySelector('button');
        if (btn) (btn as HTMLElement).click();
      }
    });
  }, MAIN.name);
  await page.waitForTimeout(500);

  // Проверяем начинку в конструкторе (span внутри constructor-element)
  await expect(page.locator('span').filter({ hasText: MAIN.name }).first()).toBeVisible();
});

test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
  await expect(page.getByText(BUN.name)).toBeVisible({ timeout: 10000 });

  // Кликаем по ссылке ингредиента
  await page.evaluate((name) => {
    Array.from(document.querySelectorAll('a')).forEach((link) => {
      if (link.textContent?.includes(name)) {
        (link as HTMLElement).click();
      }
    });
  }, BUN.name);
  await page.waitForTimeout(1000);

  // Проверяем модалку
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Калории, ккал')).toBeVisible();

  // Закрываем по Escape
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
});

test('создание заказа', async ({ page }) => {
  await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(BUN.name)).toBeVisible();

  // Добавляем булку
  await page.evaluate((name) => {
    Array.from(document.querySelectorAll('li')).forEach((item) => {
      if (item.textContent?.includes(name)) {
        const btn = item.querySelector('button');
        if (btn) (btn as HTMLElement).click();
      }
    });
  }, BUN.name);
  await page.waitForTimeout(500);

  // Добавляем начинку
  await page.evaluate((name) => {
    Array.from(document.querySelectorAll('li')).forEach((item) => {
      if (item.textContent?.includes(name)) {
        const btn = item.querySelector('button');
        if (btn) (btn as HTMLElement).click();
      }
    });
  }, MAIN.name);
  await page.waitForTimeout(500);

  // Оформляем заказ
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).forEach((btn) => {
      if (btn.textContent?.includes('Оформить заказ')) {
        (btn as HTMLElement).click();
      }
    });
  });
  await page.waitForTimeout(500);

  // Ждем модалку с номером заказа
  await expect(page.getByText('12345')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('идентификатор заказа')).toBeVisible();

  // Закрываем по Escape
  await page.keyboard.press('Escape');

  // Проверяем очистку конструктора
  await expect(page.getByText('Выберите булки').first()).toBeVisible();
  await expect(page.getByText('Выберите начинку')).toBeVisible();
});