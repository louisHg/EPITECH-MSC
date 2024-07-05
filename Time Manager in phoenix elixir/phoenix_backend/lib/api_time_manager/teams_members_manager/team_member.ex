defmodule ApiTimeManager.TeamMemberManager.TeamMember do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :team_id, :user_id]}
  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "teams_members" do
    field :team_id, :binary_id
    field :user_id, :binary_id

    timestamps()
  end

  def changeset(working_time, attrs) do

    working_time
    |> cast(attrs, [:team_id, :user_id])
    |> validate_required([:team_id, :user_id])
  end
end
