package grsu.todomanager.entity.todo;

import grsu.todomanager.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@Entity
public class Todo extends BaseEntity {

    private String name;

    @Enumerated(value = EnumType.STRING)
    private TodoStatus status;
}
