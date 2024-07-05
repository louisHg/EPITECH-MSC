defmodule ApiTimeManager.Repo.Migrations.RemoveCreatorIdFromTeam do
  use Ecto.Migration

  def change do
    alter table(:teams) do
      remove :creator_id
    end
  end
end
