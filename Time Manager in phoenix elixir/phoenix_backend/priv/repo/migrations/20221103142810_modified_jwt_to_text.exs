defmodule ApiTimeManager.Repo.Migrations.ModifiedJwtToText do
  use Ecto.Migration

  def change do
    alter table("users") do
      modify :jwt, :text
    end
  end
end
