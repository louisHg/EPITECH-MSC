defmodule ApiTimeManagerWeb.AuthController do

  use ApiTimeManagerWeb, :controller

  alias ApiTimeManager.UserManager
  alias ApiTimeManager.UserManager.User
  alias ApiTimeManagerWeb.ClockController
  alias ApiTimeManagerWeb.ClockManager.Clock

  action_fallback ApiTimeManagerWeb.FallbackController

  def register(conn, %{"user" => user_params}) do
    new_user = %{
      "username" => user_params["username"],
      "email" => user_params["email"],
      "first_name" => user_params["first_name"],
      "last_name" => user_params["last_name"],
      "password" => Bcrypt.add_hash(user_params["password"], [])[:password_hash],
      "role" => "Employee"
    }

    with {:ok, %User{} = user} <- UserManager.create_user(new_user) do
      ClockController.createClock(user.id)
      json(conn, user)
    else
      {:error, error}->
        {problem_atom, description} = Enum.at(error.errors, 0)

        resp = %{
          "error" => "register_error",
          "origin" => problem_atom,
          "description" => elem(description, 0)
        }

        conn
        |> Plug.Conn.put_status(409)
        |> json(resp)
    end
  end

  def login(conn, %{"email"=> email, "password" => password}) do

    user = UserManager.get_user_by_email(email)
    verified = Bcrypt.verify_pass(password, user.password)

    if verified do

      signer = Joken.Signer.create(
        "HS256",
        "B6ZHpfl2dZPEiZxBaAvFv92+qLPQLalMCBb3DEfv0PMPcBUnefdVCfrK1bKRq0Sw"
      )
      csrf_token = Plug.CSRFProtection.get_csrf_token()

      extra_claims = %{
        user_id: user.id,
        csrf: csrf_token
      }

      {:ok, token,_claims} = ApiTimeManager.Token.generate_and_sign(extra_claims, signer)
      UserManager.update_user(user, %{"jwt" => token})

      res = %{
        "status" => "ok",
        "jwt" => token,
        "user" => user

      }
      json(conn, res)

    else
      res = %{
        "status" => "identification_error",
        "error" => "Wrong email or password",
      }
      json(conn, res)
    end
  end
end
