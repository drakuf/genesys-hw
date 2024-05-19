import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import Home from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

beforeEach(() => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: jest.fn((key) => {
      if (key === "page") return "1";
      if (key === "name") return "";
    }),
  });

  global.fetch = jest.fn(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              json: () =>
                Promise.resolve({
                  info: { next: null, prev: null },
                  results: [],
                }),
            }),
          100,
        ),
      ),
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Home", () => {
  it("renders search input", async () => {
    await act(async () => {
      render(<Home />);
    });

    const input = screen.getByPlaceholderText("Search by name");

    expect(input).toBeInTheDocument();
  });

  it("updates search value on input change", async () => {
    await act(async () => {
      render(<Home />);
    });

    const input = screen.getByPlaceholderText(
      "Search by name",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Rick" } });

    expect(input.value).toBe("Rick");
  });

  it("fetches data on load", async () => {
    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it("updates URL query params on search", async () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

    await act(async () => {
      render(<Home />);
    });

    const input = screen.getByPlaceholderText("Search by name");
    fireEvent.change(input, { target: { value: "Morty" } });

    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenCalledWith("/?page=1&name=Morty"),
    );
  });

  it("shows spinner while loading", async () => {
    await act(async () => {
      render(<Home />);
    });

    const spinner = screen.getByLabelText("spinner");

    expect(await spinner).toBeInTheDocument();
  });

  it("displays data table when data is loaded", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            info: { next: null, prev: null },
            results: [{ id: 1, name: "Rick Sanchez" }],
          }),
      }),
    ) as jest.Mock;

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() =>
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument(),
    );
  });
});
