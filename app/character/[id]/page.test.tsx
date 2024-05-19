import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import CharacterPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          id: "1",
          name: "Rick Sanchez",
          image: "/rick.png",
          episode: ["S01E01", "S01E02"],
        }),
    }),
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("CharacterPage", () => {
  it("fetches character data on load", async () => {
    await act(async () => {
      render(<CharacterPage params={{ id: "1" }} />);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument(),
    );
  });

  it("navigates to home page on back button click", async () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

    await act(async () => {
      render(<CharacterPage params={{ id: "1" }} />);
    });

    const backButton = screen.getByText("BACK TO THE HOME PAGE");
    fireEvent.click(backButton);

    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });

  it("displays character episodes", async () => {
    await act(async () => {
      render(<CharacterPage params={{ id: "1" }} />);
    });

    await waitFor(() => {
      expect(screen.getByText("S01E01")).toBeInTheDocument();
      expect(screen.getByText("S01E02")).toBeInTheDocument();
    });
  });

  it("shows image with correct alt text", async () => {
    await act(async () => {
      render(<CharacterPage params={{ id: "1" }} />);
    });

    const image = screen.getByAltText("Rick Sanchez");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("/_next/image?url=%2Frick.png"),
    );
  });
});
