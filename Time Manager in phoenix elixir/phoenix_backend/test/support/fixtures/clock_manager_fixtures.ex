defmodule ApiTimeManager.ClockManagerFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ApiTimeManager.ClockManager` context.
  """

  @doc """
  Generate a clock.
  """
  def clock_fixture(attrs \\ %{}) do
    {:ok, clock} =
      attrs
      |> Enum.into(%{
        status: true,
        time: ~N[2022-10-24 08:02:00]
      })
      |> ApiTimeManager.ClockManager.create_clock()

    clock
  end
end
