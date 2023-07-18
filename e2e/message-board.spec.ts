import test, { expect, Page } from '@playwright/test';
import {
  createComment,
  createPost,
  login,
  setupE2eTest,
  signUp,
} from './utils';

const testUserEmail = 'test@test.io';
const testUserPassword = 'test123456';
const testUserName = 'test';

test.describe('Message Board', () => {
  test.beforeEach(setupE2eTest);

  test.beforeEach(async ({ page }) => {
    page.goto('http://localhost:1337/');
  });

  test.describe('user not signed in', () => {
    test('can see message board, but cannot interact', async ({ page }) => {
      const messageBoardLink = page.locator('a', { hasText: 'Message Board' });
      await messageBoardLink.click();
      const messageBoardSignIn = page.locator(`[data-e2e="message-board-login"]`);
      const createPostForm = page.locator(`[data-e2e="create-post-form"]`);
      await expect(messageBoardSignIn).toHaveCount(1);
      await expect(createPostForm).toHaveCount(0);
    });
  });

  test('can see posts on the message board, but cannot interact', async ({ browser, page }) => {
    const otherUser = await browser.newPage();
    otherUser.goto('http://localhost:1337');
    await signUp(otherUser, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(otherUser, 'test post', 'test contents');
    await post.click();
    await createComment(otherUser, 'test comment');
    page.goto('http://localhost:1337');
    const messageBoardSignIn = page.locator(`[data-e2e="message-board-login"]`);
    const createPostForm = page.locator(`[data-e2e="create-post-form"]`);
    await expect(messageBoardSignIn).toHaveCount(1);
    await expect(createPostForm).toHaveCount(0);

    const postViaNotLoggedInUser = page.locator('h3', { hasText: 'test post' });
    await postViaNotLoggedInUser
    const postContent = page.locator(`[data-e2e="post-content"]`, { hasText: 'test contents' });
    await expect(postContent).toHaveCount(1);
    const commentContent = page.locator(`[data-e2e="comment-content"]`, { hasText: 'test comment' });
    await expect(commentContent).toHaveCount(1);

    const commentForm = page.locator(`[data-e2e="create-comment-form"]`);
    await expect(commentForm).toHaveCount(0);

    const upvotes = page.locator(`[data-e2e="upvote"]`);
    await expect(upvotes).toHaveCount(2);
    const downvotes = page.locator(`[data-e2e="downvote"]`);
    await expect(downvotes).toHaveCount(2);

    const replyButton = page.locator(`button`, { hasText: "Reply" });
    await expect(replyButton).toHaveCount(1);
    await expect(replyButton).toBeDisabled();

    for (let i = 0; i < 2; i++) {
      await expect(upvotes.nth(i)).toBeDisabled();
      await expect(downvotes.nth(i)).toBeDisabled();
    }
  });

  test("signing up from the message board sends you back to the message board", async ({
    page,
  }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const messageBoardTitle = page.locator("h2", {
      hasText: "Message Board",
    });
    await expect(messageBoardTitle).toHaveCount(1);

    const createPostForm = page.locator(`[data-e2e="create-post-form"]`);
    await expect(createPostForm).toHaveCount(1);
  });

  test("logging in from a post message board sends you back to that post", async ({
    page,
  }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(page, "test post", "test contents");
    const logoutButton = page
      .locator("button", { hasText: "Logout" })
      .first();
    await logoutButton.click();
    await post.click();
    const postContent = page.locator(`[data-e2e="post-content"]`, {
      hasText: "test contents",
    });
    await expect(postContent).toHaveCount(1);

    const postUrl = page.url();
    await login(
      page,
      testUserEmail,
      testUserPassword,
      testUserName,
      `[data-e2e="message-board-login"] button`
    );
    expect(page.url()).toBe(postUrl);
    await expect(postContent).toHaveCount(1);
  });
});
