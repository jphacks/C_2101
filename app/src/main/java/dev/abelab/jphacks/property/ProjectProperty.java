package dev.abelab.jphacks.property;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.*;

@Data
@Configuration
@ConfigurationProperties("project")
public class ProjectProperty {

    /**
     * protocol
     */
    String protocol;

    /**
     * host name
     */
    String hostname;

}
