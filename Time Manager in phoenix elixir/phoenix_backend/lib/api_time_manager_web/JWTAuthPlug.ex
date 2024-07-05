defmodule ApiTimeManagerWeb.JWTAuthPlug do
  import Plug.Conn

  alias ApiTimeManager.UserManager

  def init(opts), do: opts

  def call(conn, _) do
    bearer_token = get_req_header(conn, "authorization")
    |> List.first()

    if bearer_token == nil do
      send_resp(conn, 401, "No Authorization Token")
      halt(conn)
    else
      token = bearer_token
      |> String.split(" ")
      |> List.last()

      signer = Joken.Signer.create(
        "HS256",
        "B6ZHpfl2dZPEiZxBaAvFv92+qLPQLalMCBb3DEfv0PMPcBUnefdVCfrK1bKRq0Sw"
      )

      {:ok, %{"user_id" => user_id, "csrf" => csrf_token}} = ApiTimeManager.Token.verify_and_validate(token, signer)
      user = UserManager.get_user_by_id!(user_id)
      {:ok, %{"csrf" => saved_csrf_token}} = ApiTimeManager.Token.verify_and_validate(user.jwt, signer)

      if csrf_token == saved_csrf_token do
        conn
        |> assign(:current_user, user)
      else
        send_resp(conn, 401, "No Valid Token")
        halt(conn)
      end
    end
  end
end
