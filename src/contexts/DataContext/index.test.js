import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
  it("a call is executed on the events.json file", async () => {
    // Assurez-vous que le mock retourne une structure conforme à celle attendue par DataProvider
    api.loadData = jest.fn().mockReturnValue(Promise.resolve({
      events: [
        { id: 1, date: "2022-04-29T20:28:45.744Z", title: "Test Event", description: "This is a test" }
      ]
    }));
    const Component = () => {
      const { data } = useData();
      // Accédez à une propriété existante, ici 'title' d'un événement pour simplifier le test
      return <div>{data?.events[0]?.title}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
    const dataDisplayed = await screen.findByText("Test Event");
    expect(dataDisplayed).toBeInTheDocument();
  });

  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      const dataDisplayed = await screen.findByText("error on calling events");
      expect(dataDisplayed).toBeInTheDocument();
    });
  });

  it("api.loadData", () => {
    window.console.error = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ events: [{ id: 1, date: "2022-04-29T20:28:45.744Z", title: "Another Test Event", description: "This is another test" }] }),
    });
    const Component = () => {
      const { data } = useData();
      return <div>{data ? 'Data Loaded' : 'Loading...'}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
  });
});
