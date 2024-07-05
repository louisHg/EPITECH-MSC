# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     ApiTimeManager.Repo.insert!(%ApiTimeManager.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias ApiTimeManager.Repo
alias ApiTimeManager.ClockManager.Clock
alias ApiTimeManager.WorkingTimesManager.WorkingTime
alias ApiTimeManager.UserManager.User

Repo.delete_all(Clock)
Repo.delete_all(WorkingTime)
Repo.delete_all(User)

_user1 = Repo.insert!(User.changeset(%User{}, %{password: Bcrypt.add_hash("test", [])[:password_hash], first_name: "manager", last_name: "manager", username: "manager", email: "manager@manager.com", role: "Manager"}))
_user2 = Repo.insert!(User.changeset(%User{}, %{password: Bcrypt.add_hash("test", [])[:password_hash], first_name: "admin", last_name: "admin", username: "admin", email: "admin@admin.com", role: "Admin"}))
_user3 = Repo.insert!(User.changeset(%User{}, %{password: Bcrypt.add_hash("test", [])[:password_hash], first_name: "Maxime", last_name: "Detaille", username: "Max1me", email: "dourworkumust@young.padawan", role: "Employee"}))
_user4 = Repo.insert!(User.changeset(%User{}, %{password: Bcrypt.add_hash("test", [])[:password_hash], first_name: "José", last_name: "NoWay", username: "NoWay", email: "J@S.E", role: "Employee"}))
_user5 = Repo.insert!(User.changeset(%User{}, %{password: Bcrypt.add_hash("test", [])[:password_hash], first_name: "test", last_name: "test", username: "test", email: "test@test.com", role: "Employee"}))
