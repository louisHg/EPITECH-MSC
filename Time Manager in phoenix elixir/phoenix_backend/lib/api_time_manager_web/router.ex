defmodule ApiTimeManagerWeb.Router do
  use ApiTimeManagerWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug ApiTimeManagerWeb.JWTAuthPlug
  end

  pipeline :cors do
    plug CORSPlug
  end

  scope "/auth", ApiTimeManagerWeb do
    pipe_through :cors
    get "/login", AuthController, :login
    post "/register", AuthController, :register
  end

  scope "/api", ApiTimeManagerWeb do
    pipe_through :api
    pipe_through :cors

    scope "/users" do
      get "/all", UserController, :getAllUsers
      put "/:id/update-role", UserController, :changeUserRole
      get "/:id", UserController, :getUserByID
      get "", UserController, :getUserByParams
      put "/:id", UserController, :updateUser
      delete "/:id", UserController, :deleteUser
    end

    scope "/teams" do
      get "/all", TeamController, :get_all_teams
      get "/:team_id", TeamController, :get_team_by_id
      post "", TeamController, :create_team
      post "/add_user", TeamController, :add_user_to_team
      delete "/remove_user", TeamController, :delete_user_from_team
      delete "/:id", TeamController, :delete_team
    end

    scope "/workingtimes" do
      get "/all", WorkingTimeController, :getAllWorkingTimes
      get "/:user_id", WorkingTimeController, :getWorkingTimeInRange
      get "/:user_id/:id", WorkingTimeController, :getOneWorkingTime
      post "/:user_id", WorkingTimeController, :addWorkingTime
      put "/:id", WorkingTimeController, :updateWorkingTime
      delete "/:id", WorkingTimeController, :deleteWorkingTime
    end

    scope "/clocks" do
      get "/all", ClockController, :getAllClocks
      get "/:user_id", ClockController, :getClock
      post "/:user_id", ClockController, :updateClock
    end

    scope "/stats" do
      get "/team/:team_id", TeamController, :get_team_average_presence_in_interval
      get "/user/:user_id", UserController, :user_presence
    end
  end
end
