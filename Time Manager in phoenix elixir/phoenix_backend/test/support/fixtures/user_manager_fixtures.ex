defmodule ApiTimeManager.UserManagerFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ApiTimeManager.UserManager` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        username: "some username"
      })
      |> ApiTimeManager.UserManager.create_user()

    user
  end
end
