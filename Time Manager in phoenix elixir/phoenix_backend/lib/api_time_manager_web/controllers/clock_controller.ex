defmodule ApiTimeManagerWeb.ClockController do
  use ApiTimeManagerWeb, :controller

  alias ApiTimeManager.WorkingTimesManager
  alias ApiTimeManager.ClockManager
  alias ApiTimeManager.ClockManager.Clock

  action_fallback ApiTimeManagerWeb.FallbackController

  def getAllClocks(conn, _params) do
    clocks = ClockManager.list_clocks()

    json(conn, clocks)
  end

  def reverseClock(prevClock, user_id) do
    prev = prevClock.time
    right_about_now = NaiveDateTime.local_now

    if prevClock.status do
      new_working_time = %{
        start: prev,
        end: right_about_now
      }

      WorkingTimesManager.gen_association(user_id, new_working_time)
    end

    new_fields = %{
      "time" => right_about_now,
      "status" => !prevClock.status
    }

    with {:ok, %Clock{} = clock} <- ClockManager.update_clock(prevClock, new_fields) do
      clock
    end
  end

  def createClock(user_id) do
    clock_fields = %{
      time: NaiveDateTime.local_now,
      status: false
    }
    with {:ok, %Clock{} = clock} <- ClockManager.gen_association(user_id, clock_fields) do
      clock
    end
  end

  def checkClock(user_id) do
    case ClockManager.get_clock(user_id) do
      nil -> createClock(user_id)
      clock -> clock
    end
  end

  def getClock(conn, %{"user_id" => user_id}) do
    clock = checkClock(user_id)

    json(conn, clock)
  end

  def updateClock(conn, %{"user_id" => user_id}) do
    clock = checkClock(user_id)

    json(conn, reverseClock(clock, user_id))
  end
end
