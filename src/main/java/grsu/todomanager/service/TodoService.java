package grsu.todomanager.service;

import grsu.todomanager.entity.todo.Todo;
import grsu.todomanager.repository.TodoRepository;
import grsu.todomanager.dto.TodoDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final ModelMapper mapper;
    private final TodoRepository todoRepository;

    public List<TodoDto> findAll() {
        return mapper.map(todoRepository.findAll(), new TypeToken<List<TodoDto>>() {
        }.getType());
    }

    public TodoDto save(TodoDto dto) {
        Todo todo = mapper.map(dto, Todo.class);
        return mapper.map(todoRepository.save(todo), TodoDto.class);
    }

    public void delete(Long id) {
        todoRepository.deleteById(id);
    }

    public void update(TodoDto dto) {
        Todo todo = mapper.map(dto, Todo.class);
        todoRepository.save(todo);
    }
}
