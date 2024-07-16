package sg.edu.nus.iss.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {

  @MessageMapping("/chat")
  @SendTo("/topic/household")
  public Message greeting(Message message) throws Exception {
    System.out.println(message.toString());
    return message;
  }

}
