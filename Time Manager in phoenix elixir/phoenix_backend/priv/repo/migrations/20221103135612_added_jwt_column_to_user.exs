defmodule ApiTimeManager.Repo.Migrations.AddedJwtColumnToUser do
  use Ecto.Migration

  def change do
    alter table("users") do
      add :jwt, :string
    end
  end
end
