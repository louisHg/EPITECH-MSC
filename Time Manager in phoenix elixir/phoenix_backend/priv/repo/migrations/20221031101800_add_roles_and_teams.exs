defmodule ApiTimeManager.Repo.Migrations.AddRolesAndTeams do
  use Ecto.Migration

  def change do
    alter table("users") do
      add :role, :string
    end

    create table(:teams, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string
      add :creator_id, references(:users, colum: :id, type: :binary_id)

      timestamps()
    end

    create table(:teams_members, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :team_id, references(:teams, colum: :id, type: :binary_id)
      add :user_id, references(:users, colum: :id, type: :binary_id)

      timestamps()
    end

  end
end
