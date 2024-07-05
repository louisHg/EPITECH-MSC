defmodule ApiTimeManagerWeb.UserController do
  use ApiTimeManagerWeb, :controller
  use ApiTimeManager.AccessDecorator

  alias ApiTimeManager.UserManager
  alias ApiTimeManager.UserManager.User
  alias ApiTimeManager.WorkingTimesManager
  alias ApiTimeManager.ClockManager
  alias ApiTimeManager.TeamMemberManager

  action_fallback ApiTimeManagerWeb.FallbackController

  def getUserByID(conn, %{"id" => id}) do
    user = UserManager.get_user_by_id!(id)
    json(conn, user)
  end


  def getUserByParams(conn, %{"email" => email, "username" => username}) do
    user = UserManager.get_user_by_params!(email, username)
    json(conn, user)
  end

  @decorate id_access()
  def updateUser(conn, %{"id" => id, "user" => user_params}) do
    user = UserManager.get_user_by_id!(id)

    with {:ok, %User{} = user} <- UserManager.update_user(user, user_params) do
      json(conn, user)
    end
  end

  @decorate id_access()
  def deleteUser(conn, %{"id" => id}) do
    user = UserManager.get_user_by_id!(id)
    clock = ClockManager.get_clock(id)
    WorkingTimesManager.delete_all_user_working_time(id)
    TeamMemberManager.delete_user_from_all_team(id)
    ClockManager.delete_clock(clock)

    with {:ok, %User{}} <- UserManager.delete_user(user) do
      json(conn, "User succesfully deleted")
    end
  end

  @decorate role_access(["Admin"])
  def getAllUsers(conn, _params) do
    users = UserManager.list_users()
    json(conn, users)
  end

  @decorate role_access(["Admin"])
  def changeUserRole(conn, %{"id" => id, "role" => new_role}) do

    user = UserManager.get_user_by_id!(id)

    if Enum.member?(["Employee", "Manager"], new_role) do
      {:ok, updated_user} = UserManager.update_user(user, %{"role" => new_role})
      json(conn, updated_user)
    else
      json(conn, %{error: "This role does not exist"})
    end
  end

  @decorate team_access()
  def user_presence(conn, %{"user_id" => user_id, "startDate" => startDate, "endDate" => endDate}) do
    working_time = ApiTimeManagerWeb.WorkingTimeController.findRange(user_id, startDate, endDate)

    {sum, average} = if length(working_time) != 0 do
      sum = Enum.reduce(working_time, 0, fn(x, acc) ->
        acc + NaiveDateTime.diff(x.end, x.start)
      end)

      average = div(sum, length(working_time))
      {sum, average}
    else
      {0,0}
    end


    resp = %{
      "user_id" => user_id,
      "startDate" => startDate,
      "endDate" => endDate,
      "working_time" => working_time,
      "average_per_day" => average,
      "total_worked" => sum
    }
    json(conn, resp)
  end
end
