package dev.abelab.jphacks.api.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.*;
import dev.abelab.jphacks.annotation.Authenticated;
import dev.abelab.jphacks.db.entity.User;

/**
 * Rest controller auth advice
 */
@RequiredArgsConstructor
@RestControllerAdvice(annotations = Authenticated.class)
public class RestControllerAuthAdvice {

    @ModelAttribute("LoginUser")
    public User addJwt(@RequestHeader(name = HttpHeaders.AUTHORIZATION, required = true) final String credentials) {
        return null;
    }

}
