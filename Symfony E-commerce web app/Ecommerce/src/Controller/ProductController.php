<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    /**
     * @Route("/api/products", name="list_product", methods={"GET"})
     */
    public function listProduct(): Response
    {
        $response = new Response("List Product");
        return $response;
    }

    /**
     * @Route("/api/products/{$productId}", name="single_product", methods={"GET"})
     */
    public function specificProduct($productId): Response
    {
        $response = new Response("specific product");
        return $response;
    }
    /**
     * @Route("/api/products", name="add_product", methods={"POST"})
     */
    public function addProduct(Resquest $request): Response
    {
        $response = new Response("added product");
        return $response;
    }

    /**
     * @Route("/api/products/{productId}", name="modify_delete_product", methods={"PATCH, DELETE"})
     */
    public function modify_deleteProduct(Resquest $request, $productId): Response
    {
        $response = new Response("modify delete product");
        return $response;
    }

    /**
     * @Route("/api/products/carts/{productId}", name="add_modify_cart", methods={"POST,PATCH"})
     */
    public function add_modifyCart(Resquest $request, $productId): Response
    {
        $response = new Response("modify delete product");
        return $response;
    }
    /**
     * @Route("/api/products/carts/{productId}", name="delete_from_cart", methods={"DELETE"})
     */
    public function deleteFromCart(Resquest $request, $productId): Response
    {
        $response = new Response("modify delete product");
        return $response;
    }

    /**
     * @Route("/api/carts", name="get_cart", methods={"GET"})
     */
    public function getShoppingcart(): Response
    {
        $response = new Response("get Shopping Cart");
        return $response;
    }

    /**
     * @Route("/api/carts/validate", name="validate_cart", methods={"POST"})
     */
    public function validateCart(): Response
    {
        $response = new Response("Validate Cart");
        return $response;
    }


}
