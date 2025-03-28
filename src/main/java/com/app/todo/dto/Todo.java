package com.app.todo.dto;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

/**
 * 애플리케이션에서 할 일 항목을 나타냅니다.
 */
public class Todo {
    private final String id;
    private String title;
    private String description;
    private boolean completed;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate dueDate;
    private String category;

    /**
     * 주어진 제목과 설명으로 새 할 일을 생성합니다.
     *
     * @param title       할 일의 제목
     * @param description 할 일의 설명
     */
    public Todo(String title, String description) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        this.dueDate = null; // 기본적으로 마감일 없음
        this.category = "일반"; // 기본 카테고리
    }

    /**
     * 주어진 제목, 설명, 마감일로 새 할 일을 생성합니다.
     *
     * @param title       할 일의 제목
     * @param description 할 일의 설명
     * @param dueDate     할 일의 마감일
     */
    public Todo(String title, String description, LocalDate dueDate) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        this.dueDate = dueDate;
        this.category = "일반"; // 기본 카테고리
    }

    /**
     * 주어진 제목, 설명, 마감일, 카테고리로 새 할 일을 생성합니다.
     *
     * @param title       할 일의 제목
     * @param description 할 일의 설명
     * @param dueDate     할 일의 마감일
     * @param category    할 일의 카테고리
     */
    public Todo(String title, String description, LocalDate dueDate, String category) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        this.dueDate = dueDate;
        this.category = category;
    }

    /**
     * JSON 직렬화/역직렬화를 위한 기본 생성자.
     */
    public Todo() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        this.dueDate = null; // 기본적으로 마감일 없음
        this.category = "일반"; // 기본 카테고리
    }

    // Getter와 Setter 메서드

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
        this.updatedAt = LocalDateTime.now();
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        String dueDateStr = dueDate != null ? String.format(" (마감일: %s)", dueDate) : "";
        return String.format("[%s] [%s] %s - %s%s",
            completed ? "✓" : " ",
            category,
            title,
            description,
            dueDateStr);
    }
}
