package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity(name = "User")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("usr_id")
    private Long usrId;

    @Column(unique = true, nullable = false)
    @JsonProperty("usr_email")
    private String usrEmail;

    @Column(unique = true)
    @JsonProperty("usr_nickname")
    private String username;

    @JsonProperty("usr_password")
    private String password;
    
    @JsonProperty("usr_profile_img")
    private String usrProfileImg;

    @JsonProperty("usr_gender")
    private String usrGender;

    @JsonProperty("usr_age_range")
    private String usrAgeRange;

    @Column(nullable = false)
    @JsonProperty("usr_traveling_state")
    private String usrTravelingState = "rest";

    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    @ElementCollection(fetch = FetchType.EAGER)
    @JsonProperty("usr_roles")
    private List<String> roles = new ArrayList<>();

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }


    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }

    @Builder
    public User(Long usrId, String usrEmail, String username, String password, List<String> roles, String usrGender, String usrAgeRange, String usrProfileImg) {
        this.usrId = usrId;
        this.usrEmail = usrEmail;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.usrGender = usrGender;
        this.usrAgeRange = usrAgeRange;
        this.usrProfileImg = usrProfileImg;
    }

    public User update(String usrEmail) {
        this.usrEmail = usrEmail;
        return this;
    }

    @PrePersist
    public void prePersist() {
        this.password = this.password == null ? "1" : this.password;
    }
}