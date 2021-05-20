package ssafy.backend.afterglow.controller;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ssafy.backend.afterglow.domain.User;
import ssafy.backend.afterglow.repository.UserRepository;
import ssafy.backend.afterglow.service.UserService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Value("${kakao_rest_api_key}")
    private String kakao_rest_api_key;

    @GetMapping("/customLogin")
    public ResponseEntity<User> login(HttpServletRequest request,
                                      HttpServletResponse response) throws IOException {
        User user = userService.login(request, response);
        return new ResponseEntity(user, HttpStatus.valueOf(response.getStatus()));
    }

    @PostMapping("/change/travelingState")
    public ResponseEntity<Object> changeUserTravelingState(@RequestParam("status") String status,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) throws IOException {
        userService.findUserByToken(request,response)
                .ifPresent(user -> {
                    user.setUsrTravelingState(status);
                    userRepository.save(user);
                });
        return ResponseEntity.ok(status);
    }


}
