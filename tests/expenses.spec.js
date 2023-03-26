// @ts-check
const { test, expect } = require('@playwright/test');

test('adds a single expense', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  // Add a new expense: "Ice Cream", cost: 20, date: 2023-01-05, category: Groceries
  await page.type('#expenseInput', 'Ice Cream');
  await page.type('#costInput', '20');
  await page.fill('#dateInput', '2023-01-05');
  await page.selectOption('#categoryInput', 'Groceries');
  await page.click('#addExpenseButton');

  // expect an expense: "Ice Cream", cost: 20, date: 2023-01-05, category: Groceries
  let expense = await page.locator('#expenseRow19').textContent();
  await expect(expense).toEqual('Ice Cream');
  let date = await page.locator('#dateRow19').textContent();
  await expect(date).toEqual('2023-01-05');
  let category = await page.locator('#categoryRow19').textContent();
  await expect(category).toEqual('Groceries');
  let cost = await page.locator('#costRow19').textContent();
  await expect(cost).toEqual('20 kr');
});

test('test filter by category functionality', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  // Select the "Entertainment" category filter
  await page.selectOption('#categoryFilter', 'Entertainment');

  // expect all visible expenses to be in the "Entertainment" category
  let rowsCount = await page.locator('.tBodyRow').count();
  let rowsContainsEntertainmentCount = await page.locator('.tBodyRow', { hasText: 'Entertainment' }).count();

  let allEntertainment = true;
  if (rowsCount != rowsContainsEntertainmentCount) {
    allEntertainment = false;
  }

  await expect(allEntertainment).toEqual(true);
});

test('test filter by date functionality', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  // Tick the "Date Span" checkbox
  await page.check('#dateSpanCheckbox');

  // Set date from 2022-05-01 to 2022-05-31
  await page.fill('#dateStartFilter', '2022-05-01');
  await page.fill('#dateEndFilter', '2022-05-31');

  // expect all visible expenses to have be in may
  let rowsCount = await page.locator('.tBodyRow').count();
  let rowsInMay = await page.locator('.tBodyRow', { hasText: '2022-05-' }).count();

  let allInMay = true;
  if (rowsCount != rowsInMay) {
    allInMay = false;
  }

  await expect(allInMay).toEqual(true);
});