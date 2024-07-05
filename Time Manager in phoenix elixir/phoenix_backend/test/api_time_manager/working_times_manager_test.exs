defmodule ApiTimeManager.WorkingTimesManagerTest do
  use ApiTimeManager.DataCase

  alias ApiTimeManager.WorkingTimesManager

  describe "workingtimes" do
    alias ApiTimeManager.WorkingTimesManager.WorkingTime

    import ApiTimeManager.WorkingTimesManagerFixtures

    @invalid_attrs %{end: nil, start: nil}

    test "list_workingtimes/0 returns all workingtimes" do
      working_time = working_time_fixture()
      assert WorkingTimesManager.list_working_times() == [working_time]
    end

    test "get_working_time!/1 returns the working_time with given id" do
      working_time = working_time_fixture()
      assert WorkingTimesManager.get_working_time!(working_time.id) == working_time
    end

    test "create_working_time/1 with valid data creates a working_time" do
      valid_attrs = %{end: ~N[2022-10-24 08:03:00], start: ~N[2022-10-24 08:03:00]}

      assert {:ok, %WorkingTime{} = working_time} = WorkingTimesManager.create_working_time(valid_attrs)
      assert working_time.end == ~N[2022-10-24 08:03:00]
      assert working_time.start == ~N[2022-10-24 08:03:00]
    end

    test "create_working_time/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = WorkingTimesManager.create_working_time(@invalid_attrs)
    end

    test "update_working_time/2 with valid data updates the working_time" do
      working_time = working_time_fixture()
      update_attrs = %{end: ~N[2022-10-25 08:03:00], start: ~N[2022-10-25 08:03:00]}

      assert {:ok, %WorkingTime{} = working_time} = WorkingTimesManager.update_working_time(working_time, update_attrs)
      assert working_time.end == ~N[2022-10-25 08:03:00]
      assert working_time.start == ~N[2022-10-25 08:03:00]
    end

    test "update_working_time/2 with invalid data returns error changeset" do
      working_time = working_time_fixture()
      assert {:error, %Ecto.Changeset{}} = WorkingTimesManager.update_working_time(working_time, @invalid_attrs)
      assert working_time == WorkingTimesManager.get_working_time!(working_time.id)
    end

    test "delete_working_time/1 deletes the working_time" do
      working_time = working_time_fixture()
      assert {:ok, %WorkingTime{}} = WorkingTimesManager.delete_working_time(working_time)
      assert_raise Ecto.NoResultsError, fn -> WorkingTimesManager.get_working_time!(working_time.id) end
    end

    test "change_working_time/1 returns a working_time changeset" do
      working_time = working_time_fixture()
      assert %Ecto.Changeset{} = WorkingTimesManager.change_working_time(working_time)
    end
  end
end
