import { render, screen } from "@testing-library/react";
import { vi } from "vitest"; // karena kamu pakai `vi.fn()`
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
