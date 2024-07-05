defmodule ApiTimeManager.WorkingTimesManager do

  import Ecto.Query, warn: false
  alias ApiTimeManager.Repo

  alias ApiTimeManager.WorkingTimesManager.WorkingTime
  alias ApiTimeManager.UserManager.User

  def list_working_times do
    Repo.all(WorkingTime)
  end

  def get_working_time!(id) do
    Repo.get_by!(WorkingTime, id: id)
  end

  def get_working_time(id) do
    Repo.get_by(WorkingTime, id: id)
  end

  def get_working_time(user_id, id) do
    Repo.get_by(WorkingTime, user_id: user_id, id: id)
  end

  def get_working_time_by_startDate(id, startDate) do
    query = from working_time in WorkingTime,
            where: working_time.start >= ^startDate
            and working_time.user_id == ^id,
            select: working_time
    Repo.all(query)
  end

  def get_working_time_by_endDate(id, endDate) do
    query = from working_time in WorkingTime,
            where: working_time.start <= ^endDate
            and working_time.user_id == ^id,
            select: working_time
    Repo.all(query)
  end

  def get_working_time_by_interval(id, startDate ,endDate) do
    query = from working_time in WorkingTime,
            where: working_time.start <= ^endDate
            and working_time.start >= ^startDate
            and working_time.user_id == ^id,
            select: working_time
    Repo.all(query)
  end


  def get_working_time_of_user(user_id) do

    query = from working_time in WorkingTime,
            where: working_time.user_id == ^user_id
    Repo.all(query)
  end

  def delete_all_user_working_time(user_id) do
    query = from working_time in WorkingTime,
            where: working_time.user_id == ^user_id,
            select: working_time
    Repo.delete_all(query)
  end

  def gen_association(user_id, attrs) do
    user = Repo.get(User, user_id)

    assoc = Ecto.build_assoc(user, :workingtimes, attrs)
    Repo.insert(assoc)
  end

  def create_working_time(attrs \\ %{}) do
    %WorkingTime{}
    |> WorkingTime.changeset(attrs)
    |> Repo.insert()
  end

  def update_working_time(%WorkingTime{} = working_time, attrs) do
    working_time
    |> WorkingTime.changeset(attrs)
    |> Repo.update()
  end

  def delete_working_time(%WorkingTime{} = working_time) do
    Repo.delete(working_time)
  end

  def change_working_time(%WorkingTime{} = working_time, attrs \\ %{}) do
    WorkingTime.changeset(working_time, attrs)
  end
end
