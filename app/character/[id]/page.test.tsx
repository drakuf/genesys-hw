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

const mockCharacter = {
  id: "1",
  name: "Rick Sanchez",
  image: "/rick.png",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2",
  ],
};

const mockEpisodes = [
  {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
  },
  {
    id: 2,
    name: "Lawnmower Dog",
    air_date: "December 9, 2013",
    episode: "S01E02",
  },
];

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
  });

  global.fetch = jest.fn((url): Promise<Response> => {
    if (url.toString().includes("/character/")) {
      return Promise.resolve({
        json: () => Promise.resolve(mockCharacter),
      }) as Promise<Response>;
    }
    if (url.toString().includes("/episode/")) {
      return Promise.resolve({
        json: () => Promise.resolve(mockEpisodes),
      }) as Promise<Response>;
    }
    return Promise.reject(new Error("not found"));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("CharacterPage", () => {
  it("fetches character data on load", async () => {
    await act(async () => {
      render(<CharacterPage params={{ id: "1" }} />);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
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
      expect(
        screen.getByText("S01E01: Pilot (December 2, 2013)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("S01E02: Lawnmower Dog (December 9, 2013)"),
      ).toBeInTheDocument();
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
