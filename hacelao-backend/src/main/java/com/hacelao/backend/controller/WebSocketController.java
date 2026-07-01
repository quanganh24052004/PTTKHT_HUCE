package com.hacelao.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    // Tablet sends new order notification to Kitchen
    @MessageMapping("/order.new")
    @SendTo("/topic/kitchen")
    public String newOrderNotification(String message) {
        return message; // Can be a JSON string describing the new order
    }

    // Kitchen sends order status update to Tablet
    @MessageMapping("/order.status")
    @SendTo("/topic/tablet")
    public String orderStatusNotification(String message) {
        return message; // Can be a JSON string describing the order status
    }

    @MessageMapping("/menu.update")
    @SendTo("/topic/tablet")
    public String updateMenu(String message) {
        return message;
    }

    @MessageMapping("/table.event")
    @SendTo("/topic/tablet")
    public String tableEvent(String message) {
        return message;
    }
}
