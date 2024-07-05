defmodule ApiTimeManager.AccessDecorator do

  use Decorator.Define, [role_access: 1, team_access: 0, id_access: 0]

  def role_access(role_list, body, %{args: [conn, _params]}) do
    quote do
      if Enum.member?(unquote(role_list) ,unquote(conn).assigns.current_user.role) do
        unquote(body)
      else
        unquote(conn)
        |> send_resp(401, "You don't have the permission to do that")
        |> halt()
      end
    end
  end

  def team_access(body, %{args: [conn, params]}) do
    quote do
      if unquote(conn).assigns.current_user.id == unquote(params)["user_id"]
      or unquote(conn).assigns.current_user.role == "Admin"
      or unquote(conn).assigns.current_user.role == "Manager"
      and ApiTimeManager.TeamMemberManager.is_in_team(unquote(conn).assigns.current_user.id, unquote(params)["team_id"])
      or unquote(conn).assigns.current_user.role == "Manager"
      and ApiTimeManager.TeamMemberManager.has_team_in_common(unquote(params)["user_id"], unquote(conn).assigns.current_user.id)
      do
        unquote(body)
      else
        unquote(conn)
        |> send_resp(401, "You don't have the permission to do that")
        |> halt()
      end
    end
  end

  def id_access(body, %{args: [conn, params]}) do
    quote do
      if unquote(conn).assigns.current_user.id == unquote(params)["id"] or unquote(conn).assigns.current_user.role == "Admin" do
        unquote(body)
      else
        unquote(conn)
        |> send_resp(401, "You don't have the permission to do that")
        |> halt()
      end
    end
  end

end
