package grsu.todomanager.dto;

import grsu.todomanager.entity.todo.TodoStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TodoDto {

    private Long id;
    private String name;
    private TodoStatus status;
}
