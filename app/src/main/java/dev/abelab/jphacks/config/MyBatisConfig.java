package dev.abelab.jphacks.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@MapperScan("dev.abelab.jphacks.db.mapper")
@Configuration
public class MyBatisConfig {
}
