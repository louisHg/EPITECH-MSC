defmodule ApiTimeManager.Repo.Migrations.AddUserRelations do
  use Ecto.Migration

  def change do
    alter table(:workingtimes) do
      add :user_id, references(:users, column: :id, type: :binary_id)
      #add :user, references(:users, colum: :id, type: :binary_id)
    end
    alter table(:clocks) do
      add :user_id, references(:users, column: :id, type: :binary_id)
      #add :user, references(:users, column: :id, type: :binary_id)
    end
  end
end
