defmodule ApiTimeManager.WorkingTimesManagerFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ApiTimeManager.WorkingTimesManager` context.
  """

  @doc """
  Generate a working_time.
  """
  def working_time_fixture(attrs \\ %{}) do
    {:ok, working_time} =
      attrs
      |> Enum.into(%{
        end: ~N[2022-10-24 08:03:00],
        start: ~N[2022-10-24 08:03:00]
      })
      |> ApiTimeManager.WorkingTimesManager.create_working_time()

    working_time
  end
end
