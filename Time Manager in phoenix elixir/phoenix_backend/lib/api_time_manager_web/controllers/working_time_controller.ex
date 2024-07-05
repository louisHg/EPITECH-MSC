defmodule ApiTimeManagerWeb.WorkingTimeController do
  use ApiTimeManagerWeb, :controller
  use ApiTimeManager.AccessDecorator

  alias ApiTimeManager.WorkingTimesManager
  alias ApiTimeManager.WorkingTimesManager.WorkingTime

  action_fallback ApiTimeManagerWeb.FallbackController

  def getAllWorkingTimes(conn, _params) do
    working_times = WorkingTimesManager.list_working_times()

    json(conn, working_times)
  end

  def addWorkingTime(conn, %{"working_time" => working_time_params, "user_id" => user_id}) do

    {:ok, start_date} = NaiveDateTime.from_iso8601(working_time_params["start"])
    {:ok, end_date} = NaiveDateTime.from_iso8601(working_time_params["end"])

    new_map = %{
      start: start_date,
      end: end_date
    }


    with {:ok, %WorkingTime{} = working_time} <- WorkingTimesManager.gen_association(user_id, new_map) do
      json(conn, working_time)
    end
  end


  @decorate team_access()
  def getOneWorkingTime(conn, %{"user_id" => user_id, "id" => id}) do
    working_time = WorkingTimesManager.get_working_time(user_id, id)
    json(conn, working_time)
  end

  def findRange(user_id, startDate, endDate) do
    cond do
      byte_size(startDate) == 0 and byte_size(endDate) == 0 ->
        WorkingTimesManager.get_working_time_of_user(user_id)
      byte_size(startDate) == 0 ->
        WorkingTimesManager.get_working_time_by_endDate(user_id, endDate)
      byte_size(endDate) == 0 ->
        WorkingTimesManager.get_working_time_by_startDate(user_id, startDate)
      true ->
        WorkingTimesManager.get_working_time_by_interval(user_id, startDate, endDate)
    end
  end
  
  @decorate team_access()
  def getWorkingTimeInRange(conn, %{"user_id" => user_id, "start" => startDate, "end" => endDate}) do
    working_time = findRange(user_id, startDate, endDate)
    json(conn, working_time)
  end

  @decorate id_access()
  def updateWorkingTime(conn, %{"id" => id, "working_time" => working_time_params}) do
    working_time = WorkingTimesManager.get_working_time(id)

    with {:ok, %WorkingTime{} = working_time} <- WorkingTimesManager.update_working_time(working_time, working_time_params) do
      json(conn, working_time)
    end
  end
  
  @decorate id_access()
  def deleteWorkingTime(conn, %{"id" => id}) do
    working_time = WorkingTimesManager.get_working_time(id)

    with {:ok, %WorkingTime{}} <- WorkingTimesManager.delete_working_time(working_time) do
      json(conn, working_time)
    end
  end
end
