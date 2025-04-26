import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from '@testing-library/user-event'
import Blog from "./Blog";

test("renders blog title and author", () => {
  const blog = {
    id: "1",
    title: "Testing blog title",
    author: "Testing blog author",
    url: "http://example.com",
    likes: 10,
    user: {
      name: "John Tester",
    },
  };

  const mockUpdateLike = vi.fn();
  const mockDeleteBlog = vi.fn();

  const { container } = render(
    <Blog blog={blog} updateLike={mockUpdateLike} deleteBlog={mockDeleteBlog} />
  );

  const div = container.querySelector('.blogHeader')
  expect(div).toHaveTextContent("Testing blog title Testing blog author");
});

test("clicking button show blog's url and likes", async() => {
  const blog = {
    id: "1",
    title: "Testing blog title",
    author: "Testing blog author",
    url: "http://example.com",
    likes: 10,
    user: {
      name: "John Tester",
    },
  };

  const mockUpdateLike = vi.fn();
  const mockDeleteBlog = vi.fn();

  const { container } = render(
    <Blog blog={blog} updateLike={mockUpdateLike} deleteBlog={mockDeleteBlog} />
  );

  const user = userEvent.setup()
  const button = container.querySelector('.toggle-btn')
  await user.click(button)

  const div = container.querySelector('.blogDetail')
  expect(div).toHaveTextContent("http://example.com");
  expect(div).toHaveTextContent("likes 10");
});