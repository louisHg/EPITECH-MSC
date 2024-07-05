defmodule ApiTimeManager.TeamMemberManager do

  import Ecto.Query, warn: false
  alias ApiTimeManager.Repo

  alias ApiTimeManager.TeamMemberManager.TeamMember

  def list_team_members do
    Repo.all(TeamMember)
  end

  def create_team_member(attrs \\ %{}) do
    %TeamMember{}
    |> TeamMember.changeset(attrs)
    |> Repo.insert()
  end

  def get_members_of_team(team_id) do
    query = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
            where: team_member.team_id == ^team_id
    Repo.all(query)
  end

  def get_team_member_by_id!(id), do: Repo.get!(TeamMember, id)

  def get_team_member_by_params(user_id, team_id) do
    query = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
            where: team_member.team_id == ^team_id
            and    team_member.user_id == ^user_id,
            select: team_member
    Repo.all(query)
  end

  def delete_team_member(team_member) do
    Repo.delete(team_member)
  end

  def delete_all_team_members(team_id) do
    query = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
            where: team_member.team_id == ^team_id
    Repo.delete_all(query)
  end

  def delete_user_from_all_team(user_id) do
    query = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
            where: team_member.user_id == ^user_id,
            select: team_member
    Repo.delete_all(query)
  end

  def has_team_in_common(user_id, manager_id) do

    query = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
            where: team_member.user_id == ^user_id,
            select: team_member.team_id
    first_result = Repo.all(query)

    query_2 = from team_member in ApiTimeManager.TeamMemberManager.TeamMember,
              where: team_member.user_id == ^manager_id,
              select: team_member.team_id
    second_result = Repo.all(query_2)

    in_common = false

    Enum.each(first_result, fn(team_member)->
      Enum.each(second_result, fn(manager_member)->
        if team_member.team_id == manager_member.team_id do
          in_common = true
        end
      end)
    end)
    in_common
  end

  def is_in_team(user_id, team_id) do
    user_length = length(get_team_member_by_params(user_id, team_id))
    in_team =
      if user_length == 1 do
        true
      else
        false
      end
  end

end
