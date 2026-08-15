import { test, expect } from '@playwright/test';
import path from 'path';

const BUN = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255
};

const MAIN = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424
};

test.describe('Конструктор бургера', () => {
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

    await page.routeFromHAR(path.join(__dirname, 'hars', 'api.har'), {
      url: '**/api/**',
      update: false
    });

    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await expect(page.getByText('Соберите бургер')).toBeVisible({
      timeout: 30000
    });
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: BUN.name });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const constructorSection = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      constructorSection.getByText(`${BUN.name} (верх)`, { exact: true })
    ).toBeVisible();

    await expect(
      constructorSection.getByText(`${BUN.name} (низ)`, { exact: true })
    ).toBeVisible();

    const mainCard = page.locator('li').filter({ hasText: MAIN.name });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructorSection.getByText(MAIN.name, { exact: true })
    ).toBeVisible();
  });

  test.describe('Модальное окно ингредиента', () => {
    test.beforeEach(async ({ page }) => {
      const bunCard = page.locator('li').filter({ hasText: BUN.name });
      await bunCard.locator('a').click();

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible({ timeout: 30000 });
    });

    test('отображает данные ингредиента', async ({ page }) => {
      const modal = page
        .locator('div')
        .filter({
          has: page.getByRole('heading', { name: 'Детали ингредиента' })
        })
        .first();

      await expect(modal.getByText('Калории, ккал')).toBeVisible();
      await expect(
        modal.getByText(String(BUN.calories), { exact: true })
      ).toBeVisible();
      await expect(modal.getByText('Белки, г')).toBeVisible();
      await expect(
        modal.getByText(String(BUN.proteins), { exact: true })
      ).toBeVisible();
      await expect(modal.getByText('Жиры, г')).toBeVisible();
      await expect(
        modal.getByText(String(BUN.fat), { exact: true })
      ).toBeVisible();
      await expect(modal.getByText('Углеводы, г')).toBeVisible();
      await expect(
        modal.getByText(String(BUN.carbohydrates), { exact: true })
      ).toBeVisible();
    });

    test('закрывается по клику на крестик', async ({ page }) => {
      const modal = page
        .locator('div')
        .filter({
          has: page.getByRole('heading', { name: 'Детали ингредиента' })
        })
        .first();

      await modal.locator('button').first().click();

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).not.toBeVisible();
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      await page.mouse.click(10, 10);

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).not.toBeVisible();
    });

    test('закрывается по Escape', async ({ page }) => {
      await page.keyboard.press('Escape');

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).not.toBeVisible();
    });
  });

  test('создание заказа', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: BUN.name });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.locator('li').filter({ hasText: MAIN.name });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Ждем появления номера заказа
    await expect(page.getByText('12345', { exact: true })).toBeVisible({
      timeout: 30000
    });

    // Находим модалку заказа через уникальный номер внутри неё
    const orderModal = page
      .locator('div')
      .filter({ has: page.getByText('12345', { exact: true }) })
      .first();

    await expect(orderModal.getByText('12345', { exact: true })).toBeVisible();

    await page.keyboard.press('Escape');

    const constructorSection = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      constructorSection.getByText('Выберите булки', { exact: true }).first()
    ).toBeVisible();

    await expect(
      constructorSection.getByText('Выберите начинку', { exact: true }).first()
    ).toBeVisible();
  });
});
