defmodule ApiTimeManager.WorkingTimesManager.WorkingTime do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :end, :start, :user_id]}
  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "workingtimes" do
    field :end, :naive_datetime
    field :start, :naive_datetime
    belongs_to :user, ApiTimeManager.UserManager.User

    timestamps()
  end

  def changeset(working_time, attrs) do

    working_time
    |> cast(attrs, [:start, :end])
    |> validate_required([:start, :end])
  end
end
