package grsu.todomanager.controller;

import grsu.todomanager.service.TodoService;
import grsu.todomanager.dto.TodoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoDto>> getTodos() {
        return ResponseEntity.ok(todoService.findAll());
    }

    @PostMapping
    public ResponseEntity<TodoDto> saveTodo(@RequestBody TodoDto dto) {
        return ResponseEntity.ok(todoService.save(dto));
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.delete(id);
    }

    @PutMapping
    public void updateTodo(@RequestBody TodoDto dto) {
        todoService.update(dto);
    }
}
