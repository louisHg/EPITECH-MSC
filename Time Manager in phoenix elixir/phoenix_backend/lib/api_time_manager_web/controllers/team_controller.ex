defmodule ApiTimeManagerWeb.TeamController do
  use ApiTimeManagerWeb, :controller
  use ApiTimeManager.AccessDecorator

  alias ApiTimeManager.TeamManager
  alias ApiTimeManager.TeamMemberManager

  action_fallback ApiTimeManagerWeb.FallbackController

  @decorate team_access()
  def get_team_by_id(conn, %{"team_id" => id}) do
    team = %{
      "team_data" => TeamManager.get_team_by_id!(id),
      "team_members" => TeamMemberManager.get_members_of_team(id)
    }
    json(conn, team)
  end

  @decorate role_access(["Admin"])
  def get_all_teams(conn, _params) do
    teams = TeamManager.list_team()
    json(conn, teams)
  end

  @decorate team_access()
  def add_user_to_team(conn, %{"user_id" => user_id, "team_id" => team_id}) do

    team_member = %{
      "user_id" => user_id,
      "team_id" => team_id
    }

    TeamMemberManager.create_team_member(team_member)
    team = %{
      "team_data" => TeamManager.get_team_by_id!(team_id),
      "team_members" => TeamMemberManager.get_members_of_team(team_id)
    }
    json(conn, team)
  end

  @decorate team_access()
  def delete_user_from_team(conn, %{"user_id" => user_id, "team_id" => team_id}) do
    team_member = TeamMemberManager.get_team_member_by_params(user_id, team_id)
    TeamMemberManager.delete_team_member(Enum.at(team_member, 0))

    team = %{
      "team_data" => TeamManager.get_team_by_id!(team_id),
      "team_members" => TeamMemberManager.get_members_of_team(team_id)
    }
    json(conn, team)
  end

  @decorate role_access(["Admin", "Manager"])
  def create_team(conn, %{"team" => team_params}) do
    new_team = %{
      "name" => team_params["name"],
    }
    {:ok, team } = TeamManager.create_team(new_team)
    if conn.assigns.current_user.role == "Manager" do
      team_member = %{
        "team_id" => team.id,
        "user_id" => conn.assigns.current_user.id
      }
      TeamMemberManager.create_team_member(team_member)
    end

    team = %{
      "team_data" => TeamManager.get_team_by_id!(team.id),
      "team_members" => TeamMemberManager.get_members_of_team(team.id)
    }
    json(conn, team)
  end

  @decorate team_access()
  def delete_team(conn, %{"id" => team_id}) do
    TeamMemberManager.delete_all_team_members(team_id)
    team = TeamManager.get_team_by_id!(team_id)
    TeamManager.delete_team(team)

    json(conn, "Team succesfully deleted")
  end

  @decorate team_access()
  def get_team_average_presence_in_interval(conn, %{"team_id" => team_id, "startDate" => startDate, "endDate" => endDate}) do
    {:ok, start_date} = NaiveDateTime.from_iso8601(startDate)
    {:ok, end_date} = NaiveDateTime.from_iso8601(endDate)
    team_presence = TeamManager.get_team_presence(team_id, startDate, endDate)

    {sum, average} = if length(team_presence) != 0 do

      sum = Enum.reduce(team_presence, 0, fn(x, acc) ->
        acc + NaiveDateTime.diff(x.end, x.start)
      end)

      average = div(sum, length(team_presence))

      {sum, average}
    else
      {0, 0}
    end

    resp = %{
      "team_id" => team_id,
      "startDate" => startDate,
      "endDate" => endDate,
      "working_time" => team_presence,
      "average_per_day" => average,
      "total_worked" => sum
    }
    json(conn, resp)
  end

end
