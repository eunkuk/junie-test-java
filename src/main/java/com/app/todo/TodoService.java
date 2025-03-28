package com.app.todo;

import com.app.todo.dto.Todo;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 할 일 항목을 관리하는 서비스 클래스.
 */
@Service
public class TodoService {
    private final Map<String, Todo> todos;

    /**
     * 새 TodoService를 생성합니다.
     */
    public TodoService() {
        this.todos = new HashMap<>();
    }

    /**
     * 주어진 제목과 설명으로 새 할 일을 추가합니다.
     *
     * @param title       할 일의 제목
     * @param description 할 일의 설명
     * @return 생성된 할 일
     */
    public Todo addTodo(String title, String description) {
        Todo todo = new Todo(title, description);
        todos.put(todo.getId(), todo);
        return todo;
    }

    /**
     * 주어진 제목, 설명, 마감일로 새 할 일을 추가합니다.
     *
     * @param title       할 일의 제목
     * @param description 할 일의 설명
     * @param dueDate     할 일의 마감일
     * @return 생성된 할 일
     */
    public Todo addTodo(String title, String description, LocalDate dueDate) {
        Todo todo = new Todo(title, description, dueDate);
        todos.put(todo.getId(), todo);
        return todo;
    }

    /**
     * 기존 할 일을 업데이트합니다.
     *
     * @param id          업데이트할 할 일의 ID
     * @param title       새 제목
     * @param description 새 설명
     * @param completed   새 완료 상태
     * @return 업데이트된 할 일, 찾을 수 없는 경우 null
     */
    public Todo updateTodo(String id, String title, String description, boolean completed) {
        return updateTodo(id, title, description, completed, null);
    }

    /**
     * 기존 할 일을 업데이트합니다.
     *
     * @param id          업데이트할 할 일의 ID
     * @param title       새 제목
     * @param description 새 설명
     * @param completed   새 완료 상태
     * @param dueDate     새 마감일
     * @return 업데이트된 할 일, 찾을 수 없는 경우 null
     */
    public Todo updateTodo(String id, String title, String description, boolean completed, LocalDate dueDate) {
        Todo todo = todos.get(id);
        if (todo == null) {
            return null;
        }

        todo.setTitle(title);
        todo.setDescription(description);
        todo.setCompleted(completed);
        todo.setDueDate(dueDate);

        return todo;
    }

    /**
     * 할 일을 완료로 표시합니다.
     *
     * @param id 완료로 표시할 할 일의 ID
     * @return 업데이트된 할 일, 찾을 수 없는 경우 null
     */
    public Todo completeTodo(String id) {
        Todo todo = todos.get(id);
        if (todo == null) {
            return null;
        }

        todo.setCompleted(true);
        return todo;
    }

    /**
     * 할 일을 삭제합니다.
     *
     * @param id 삭제할 할 일의 ID
     * @return 할 일이 삭제되었으면 true, 찾을 수 없는 경우 false
     */
    public boolean deleteTodo(String id) {
        return todos.remove(id) != null;
    }

    /**
     * ID로 할 일을 가져옵니다.
     *
     * @param id 가져올 할 일의 ID
     * @return 할 일, 찾을 수 없는 경우 null
     */
    public Todo getTodo(String id) {
        return todos.get(id);
    }

    /**
     * 모든 할 일을 가져옵니다.
     *
     * @return 모든 할 일 목록
     */
    public List<Todo> getAllTodos() {
        return new ArrayList<>(todos.values());
    }

    /**
     * 완료된 모든 할 일을 가져옵니다.
     *
     * @return 완료된 모든 할 일 목록
     */
    public List<Todo> getCompletedTodos() {
        List<Todo> completedTodos = new ArrayList<>();
        for (Todo todo : todos.values()) {
            if (todo.isCompleted()) {
                completedTodos.add(todo);
            }
        }
        return completedTodos;
    }

    /**
     * 미완료된 모든 할 일을 가져옵니다.
     *
     * @return 미완료된 모든 할 일 목록
     */
    public List<Todo> getIncompleteTodos() {
        List<Todo> incompleteTodos = new ArrayList<>();
        for (Todo todo : todos.values()) {
            if (!todo.isCompleted()) {
                incompleteTodos.add(todo);
            }
        }
        return incompleteTodos;
    }

    /**
     * 특정 카테고리의 모든 할 일을 가져옵니다.
     *
     * @param category 필터링할 카테고리
     * @return 해당 카테고리의 모든 할 일 목록
     */
    public List<Todo> getTodosByCategory(String category) {
        List<Todo> categoryTodos = new ArrayList<>();
        for (Todo todo : todos.values()) {
            if (todo.getCategory().equals(category)) {
                categoryTodos.add(todo);
            }
        }
        return categoryTodos;
    }

    /**
     * 모든 카테고리 목록을 가져옵니다.
     *
     * @return 중복 없는 모든 카테고리 목록
     */
    public List<String> getAllCategories() {
        List<String> categories = new ArrayList<>();
        for (Todo todo : todos.values()) {
            String category = todo.getCategory();
            if (!categories.contains(category)) {
                categories.add(category);
            }
        }
        return categories;
    }
}
