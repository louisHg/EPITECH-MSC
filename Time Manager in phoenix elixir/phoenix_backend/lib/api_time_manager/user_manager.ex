defmodule ApiTimeManager.UserManager do

  import Ecto.Query, warn: false
  alias ApiTimeManager.Repo

  alias ApiTimeManager.UserManager.User

  def list_users do
    Repo.all(User)
  end

  def get_user!(id), do: Repo.get(User, id)

  def get_user_by_id!(id), do: Repo.get(User, id)

  def get_user_by_id(id), do: Repo.get(User, id)

  def get_user_by_params!(email, username), do: Repo.get_by(User, email: email, username: username)

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end
end
