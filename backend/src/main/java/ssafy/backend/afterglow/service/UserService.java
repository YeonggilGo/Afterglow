package ssafy.backend.afterglow.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import ssafy.backend.afterglow.domain.User;
import ssafy.backend.afterglow.repository.UserRepository;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.security.Principal;
import java.util.*;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Value("${kakao_rest_api_key}")
    private String kakao_rest_api_key;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return (UserDetails) userRepository.findByUsername(username)
                .orElse(null);
    }

    public User login(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> cookies = getCookies(request, response);
        String userInfo = getUserInfo(cookies.get("access_token"));
        User tempUser = customUserBuilder(userInfo);
        return saveOrUpdate(tempUser);
    }

    public Optional<User> findUserByToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> cookies = getCookies(request, response);
        String userInfo = getUserInfo(cookies.get("access_token"));
        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(userInfo);
        JsonObject kakao_account = element.getAsJsonObject().get("kakao_account").getAsJsonObject();
        String email = kakao_account.getAsJsonObject().get("email").getAsString();
        Optional<User> user = userRepository.findByUsrEmail(email);
        return user;
    }

    private User saveOrUpdate(User tempUser) {
        User user = userRepository.findByUsrEmail(tempUser.getUsrEmail())
                .map(entity -> entity.update(tempUser.getUsrEmail()))
                .orElse(tempUser);

        return userRepository.save(user);
    }

    public Map<String, String> getCookies(HttpServletRequest request,
                                          HttpServletResponse response) throws IOException {
        Map<String, String> cookies = new HashMap<>();
        Arrays.stream(request.getCookies())
                .forEach(cookie -> cookies.put(cookie.getName(), cookie.getValue()));

        String reqURL = "https://kapi.kakao.com/v1/user/access_token_info";
        URL url = new URL(reqURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + (String) cookies.get("access_token"));
        int responseCode = conn.getResponseCode();
        if (responseCode == 401) {
            String reqRenewalURL = "https://kapi.kakao.com/oauth/token";
            URL renewalURL = new URL(reqRenewalURL);
            HttpURLConnection renewalConn = (HttpURLConnection) renewalURL.openConnection();
            renewalConn.setRequestMethod("POST");
            renewalConn.setRequestProperty("grant_type", "refresh_token");
            renewalConn.setRequestProperty("client_id", kakao_rest_api_key);
            renewalConn.setRequestProperty("refresh_token", (String) cookies.get("refresh_token"));
            System.out.println("client_id : " + kakao_rest_api_key);
            System.out.println("refresh_token : " + (String) cookies.get("refresh_token"));

            int renewalResponseCode = renewalConn.getResponseCode();
            BufferedReader br = new BufferedReader(new InputStreamReader(renewalConn.getInputStream()));
            String line = "";
            String res = "";
            while ((line = br.readLine()) != null) {
                res += line;
            }
            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(res);
            System.out.println(element);
            cookies.replace("access_token", element.getAsJsonObject().get("access_token").getAsString());
            cookies.replace("refresh_token", element.getAsJsonObject().get("refresh_token").getAsString());
            response.addCookie(new Cookie("access_token", (String) cookies.get("access_token")));
            response.addCookie(new Cookie("refresh_token", (String) cookies.get("refresh_token")));
            response.setStatus(201);
        }
        return cookies;
    }

    public String getUserInfo(String access_token) throws IOException {
        String reqURL = "https://kapi.kakao.com/v2/user/me";
        URL url = new URL(reqURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + access_token);
        int responseCode = conn.getResponseCode();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line = "";
        String result = "";
        while ((line = br.readLine()) != null) {
            result += line;
        }
        return result;
    }

    public User customUserBuilder(String userInfo) {
        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(userInfo);
        JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
        JsonObject kakao_account = element.getAsJsonObject().get("kakao_account").getAsJsonObject();

        String username = properties.getAsJsonObject().get("nickname").getAsString();
        String email = kakao_account.getAsJsonObject().get("email").getAsString();
        String profile_img = null;
        if (properties.getAsJsonObject().keySet().contains("profile_image") && properties.getAsJsonObject().get("profile_image") != null) {
            profile_img = properties.getAsJsonObject().get("profile_image").getAsString();
        }
        String gender = null;
        if (properties.getAsJsonObject().keySet().contains("gender") && properties.getAsJsonObject().get("gender") != null) {
            gender = properties.getAsJsonObject().get("gender").getAsString();
        }
        String age_range = null;
        if (properties.getAsJsonObject().keySet().contains("age_range") && properties.getAsJsonObject().get("age_range") != null) {
            age_range = properties.getAsJsonObject().get("age_range").getAsString();
        }

        User tempUser = User.builder()
                .username(username)
                .usrEmail(email)
                .usrGender(gender)
                .usrAgeRange(age_range)
                .usrProfileImg(profile_img)
                .roles(Collections.singletonList("ROLE_USER"))
                .build();
        saveOrUpdate(tempUser);
        return tempUser;
    }

}
