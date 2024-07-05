defmodule ApiTimeManager.UserManager.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :email, :username, :first_name, :last_name, :role]}
  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :email, :string
    field :username, :string
    field :first_name, :string
    field :last_name, :string
    field :password, :string
    has_one :clocks, ApiTimeManager.ClockManager.Clock
    has_many :workingtimes, ApiTimeManager.WorkingTimesManager.WorkingTime
    field :role, :string
    field :jwt, :string

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [ :username, :email, :first_name, :last_name, :password, :role, :jwt])
    |> validate_required([ :username, :email, :first_name, :last_name, :password, :role])
    |> validate_format(:email, ~r/([[:alnum:]]|\.)+@[[:alnum:]]+\.[[:alnum:]]+/)
    |> unique_constraint([:email])
  end
end
