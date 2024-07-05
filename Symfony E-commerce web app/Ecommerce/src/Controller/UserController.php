<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/api/register", name="register_user", methods={"POST"})
     */
    public function register(): Response
    {
        $response = new Response("register");
        return $response;
    }

    /**
     * @Route("/api/login", name="login_user", methods={"POST"})
     */
    public function login(): Response
    {
        echo "Testing?";
        $user = $this->getUser();
        return $this->json([
            'username'=> $user -> getUsername(),
            'roles'=> $user -> getRoles()
        ]);
    }

    /**
     * @Route("/api/users", name="display_user", methods={"GET"})
     */
    public function display_user(): Response
    {
        $response = new Response("display_user");
        return $response;
    }

    /**
     * @Route("/api/users", name="update_user", methods={"PATCH"})
     */
    public function update_user(): Response
    {
        $response = new Response("update_user");
        return $response;
    }
}
