defmodule ApiTimeManagerWeb.ClockControllerTest do
  use ApiTimeManagerWeb.ConnCase

  import ApiTimeManager.ClockManagerFixtures

  alias ApiTimeManager.ClockManager.Clock

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all clocks", %{conn: conn} do
      conn = get(conn, Routes.clock_path(conn, :getAllClocks))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create clock" do
    test "renders clock when data is valid", %{conn: conn} do
      conn = post(conn, Routes.clock_path(conn, :getClock))
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.clock_path(conn, :getClock, id))

      assert %{
               "id" => ^id,
               "status" => false
             } = json_response(conn, 200)["data"]
    end
  end

  describe "update clock" do
    setup [:create_clock]

    test "renders clock when data is valid", %{conn: conn, clock: %Clock{id: id} = clock} do
      conn = put(conn, Routes.clock_path(conn, :updateClock, clock))
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.clock_path(conn, :getClock, id))

      assert %{
               "id" => ^id,
               "status" => true,
             } = json_response(conn, 200)["data"]
    end
  end

  defp create_clock(_) do
    clock = clock_fixture()
    %{clock: clock}
  end
end
