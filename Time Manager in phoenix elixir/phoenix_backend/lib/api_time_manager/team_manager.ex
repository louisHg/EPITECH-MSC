defmodule ApiTimeManager.TeamManager do

  import Ecto.Query, warn: false
  alias ApiTimeManager.Repo

  alias ApiTimeManager.TeamManager.Team

  def list_team do
    Repo.all(Team)
  end

  def get_team_by_id!(id), do: Repo.get(Team, id)

  def create_team(attrs \\ %{}) do
    %Team{}
    |> Team.changeset(attrs)
    |> Repo.insert()
  end

  def update_team(%Team{} = team, attrs) do
    team
    |> Team.changeset(attrs)
    |> Repo.update()
  end

  def delete_team(%Team{} = team) do
    Repo.delete(team)
  end

  def get_team_presence(team_id, start_period, end_periode) do

    query = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
            join: working_time in ApiTimeManager.WorkingTimesManager.WorkingTime,
            on: working_time.user_id == team_member.user_id,
            where: team_member.team_id == ^team_id
            and working_time.start <= ^end_periode
            and working_time.start >= ^start_period,
            select: working_time

    Repo.all(query)
  end
end
