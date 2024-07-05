<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OrderController extends AbstractController
{
    /**
     * @Route("/api/orders", name="recover_orders", methods={"GET"})
     */
    public function getAllOrders(): Response
    {
        $response = new Response("recover all orders");
        return $response;
    }

    /**
     * @Route("/api/orders/{$orderId}", name="recover_one_order", methods={"GET"})
     */
    public function getOneOrders(): Response
    {
        $response = new Response("recover all orders");
        return $response;
    }
}
