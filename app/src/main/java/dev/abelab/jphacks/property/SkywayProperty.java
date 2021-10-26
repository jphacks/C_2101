package dev.abelab.jphacks.property;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.*;

@Data
@Configuration
@ConfigurationProperties("skyway")
public class SkywayProperty {

    /**
     * Secret key
     */
    String secret;

    /**
     * クレデンシャルの有効期限
     */
    Integer ttl;

}
