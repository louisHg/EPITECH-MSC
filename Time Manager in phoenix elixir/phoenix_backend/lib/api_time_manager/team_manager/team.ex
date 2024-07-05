defmodule ApiTimeManager.TeamManager.Team do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name]}
  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "teams" do
    field :name, :string

    timestamps()
  end

  def changeset(working_time, attrs) do

    working_time
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
