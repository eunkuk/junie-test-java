package com.app.todo;

import com.app.todo.dto.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 할 일 작업을 위한 REST 컨트롤러.
 */
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    /**
     * 모든 할 일을 가져옵니다.
     *
     * @return 모든 할 일 목록
     */
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }

    /**
     * 미완료된 할 일을 가져옵니다.
     *
     * @return 미완료된 할 일 목록
     */
    @GetMapping("/incomplete")
    public List<Todo> getIncompleteTodos() {
        return todoService.getIncompleteTodos();
    }

    /**
     * 완료된 할 일을 가져옵니다.
     *
     * @return 완료된 할 일 목록
     */
    @GetMapping("/completed")
    public List<Todo> getCompletedTodos() {
        return todoService.getCompletedTodos();
    }

    /**
     * 특정 카테고리의 할 일을 가져옵니다.
     *
     * @param category 필터링할 카테고리
     * @return 해당 카테고리의 할 일 목록
     */
    @GetMapping("/category/{category}")
    public List<Todo> getTodosByCategory(@PathVariable String category) {
        return todoService.getTodosByCategory(category);
    }

    /**
     * 모든 카테고리 목록을 가져옵니다.
     *
     * @return 중복 없는 모든 카테고리 목록
     */
    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return todoService.getAllCategories();
    }

    /**
     * ID로 특정 할 일을 가져옵니다.
     *
     * @param id 할 일의 ID
     * @return 할 일 또는 찾을 수 없는 경우 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable String id) {
        Todo todo = todoService.getTodo(id);
        if (todo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(todo, HttpStatus.OK);
    }

    /**
     * 새 할 일을 생성합니다.
     *
     * @param todoData 제목, 설명, 선택적으로 마감일과 카테고리를 포함하는 맵
     * @return 생성된 할 일
     */
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Map<String, Object> todoData) {
        String title = (String) todoData.get("title");
        String description = todoData.get("description") != null ? (String) todoData.get("description") : "";
        String dueDateStr = todoData.get("dueDate") != null ? (String) todoData.get("dueDate") : null;
        String category = todoData.get("category") != null ? (String) todoData.get("category") : "일반";

        if (title == null || title.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Todo todo;
        if (dueDateStr != null && !dueDateStr.isEmpty()) {
            try {
                LocalDate dueDate = LocalDate.parse(dueDateStr);
                todo = todoService.addTodo(title, description, dueDate);
                todo.setCategory(category);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            todo = todoService.addTodo(title, description);
            todo.setCategory(category);
        }

        return new ResponseEntity<>(todo, HttpStatus.CREATED);
    }

    /**
     * 기존 할 일을 업데이트합니다.
     *
     * @param id 업데이트할 할 일의 ID
     * @param todoData 제목, 설명, 완료 상태, 선택적으로 마감일과 카테고리를 포함하는 맵
     * @return 업데이트된 할 일 또는 찾을 수 없는 경우 404
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable String id, @RequestBody Map<String, Object> todoData) {
        Todo existingTodo = todoService.getTodo(id);
        if (existingTodo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        String title = todoData.get("title") != null ? (String) todoData.get("title") : existingTodo.getTitle();
        String description = todoData.get("description") != null ? (String) todoData.get("description") : existingTodo.getDescription();
        boolean completed = todoData.get("completed") != null ? (boolean) todoData.get("completed") : existingTodo.isCompleted();
        String category = todoData.get("category") != null ? (String) todoData.get("category") : existingTodo.getCategory();

        LocalDate dueDate = existingTodo.getDueDate();
        if (todoData.containsKey("dueDate")) {
            String dueDateStr = (String) todoData.get("dueDate");
            if (dueDateStr != null && !dueDateStr.isEmpty()) {
                try {
                    dueDate = LocalDate.parse(dueDateStr);
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } else {
                dueDate = null; // 빈 문자열이 제공된 경우 마감일 지우기
            }
        }

        Todo updatedTodo = todoService.updateTodo(id, title, description, completed, dueDate);
        updatedTodo.setCategory(category);
        return new ResponseEntity<>(updatedTodo, HttpStatus.OK);
    }

    /**
     * 할 일을 완료로 표시합니다.
     *
     * @param id 완료로 표시할 할 일의 ID
     * @return 업데이트된 할 일 또는 찾을 수 없는 경우 404
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Todo> completeTodo(@PathVariable String id) {
        Todo todo = todoService.completeTodo(id);
        if (todo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(todo, HttpStatus.OK);
    }

    /**
     * 할 일을 삭제합니다.
     *
     * @param id 삭제할 할 일의 ID
     * @return 성공 시 204 No Content, 찾을 수 없는 경우 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        boolean deleted = todoService.deleteTodo(id);
        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
