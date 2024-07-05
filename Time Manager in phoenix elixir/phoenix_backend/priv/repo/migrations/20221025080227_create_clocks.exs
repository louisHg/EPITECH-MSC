defmodule ApiTimeManager.Repo.Migrations.CreateClocks do
  use Ecto.Migration

  def change do
    create table(:clocks, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :time, :naive_datetime
      add :status, :boolean, default: false, null: false

      timestamps()
    end
  end
end
