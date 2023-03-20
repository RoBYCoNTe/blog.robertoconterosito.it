---
author: "Roberto Conte Rosito"
title: "Setup Spring Boot with JPA and MySQL"
date: "2023-03-20"
description: "This guide will help you through the process of configuring Spring Boot with JPA and MySQL"
tags: [
	"spring-boot",
  "jpa",
  "mysql",
  "notes"
]
---

_Welcome back to my dev notes!_

Few things that I've to remember next time I need to setup a Spring Boot project with JPA and MySQL:

- Add the following dependencies to your `pom.xml`:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
</dependency>
```

- Add the following properties to your `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_name
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- Create your model using `@Entity` and `@Id` annotations:

```java
@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String email;
  private String password;
  // getters and setters
}
```

- Create your repository extending `JpaRepository` adding `@Repository` annotation:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {}
```

Now you are ready to `@Autowired` your repository and use it in your services/controllers.

That's all for today, see you next time!
