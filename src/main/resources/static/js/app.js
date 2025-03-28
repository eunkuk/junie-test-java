// TodoService 클래스 - API 호출 처리
class TodoService {
    constructor() {
        // 서버가 8080 포트에서 실행 중인지 확인하고 전체 URL 사용
        const baseUrl = window.location.origin; // 예: http://localhost:8080
        this.apiUrl = `${baseUrl}/api/todos`;
    }

    // 모든 할 일 가져오기
    async getAllTodos() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            // 응답이 배열이 아닌 경우 빈 배열 반환
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('할 일 가져오기 오류:', error);
            return [];
        }
    }

    // 미완료 할 일 가져오기
    async getIncompleteTodos() {
        try {
            const response = await fetch(`${this.apiUrl}/incomplete`);
            const data = await response.json();
            // 응답이 배열이 아닌 경우 빈 배열 반환
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('미완료 할 일 가져오기 오류:', error);
            return [];
        }
    }

    // 완료된 할 일 가져오기
    async getCompletedTodos() {
        try {
            const response = await fetch(`${this.apiUrl}/completed`);
            const data = await response.json();
            // 응답이 배열이 아닌 경우 빈 배열 반환
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('완료된 할 일 가져오기 오류:', error);
            return [];
        }
    }

    // 특정 카테고리의 할 일 가져오기
    async getTodosByCategory(category) {
        try {
            const response = await fetch(`${this.apiUrl}/category/${encodeURIComponent(category)}`);
            const data = await response.json();
            // 응답이 배열이 아닌 경우 빈 배열 반환
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('카테고리별 할 일 가져오기 오류:', error);
            return [];
        }
    }

    // 모든 카테고리 가져오기
    async getAllCategories() {
        try {
            const response = await fetch(`${this.apiUrl}/categories`);
            return await response.json();
        } catch (error) {
            console.error('카테고리 가져오기 오류:', error);
            return [];
        }
    }

    // 새 할 일 추가하기
    async addTodo(title, description, dueDate = null, category = "일반") {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, dueDate, category })
            });
            return await response.json();
        } catch (error) {
            console.error('할 일 추가 오류:', error);
            return null;
        }
    }

    // 할 일 업데이트하기
    async updateTodo(id, title, description, completed, dueDate = null, category = "일반") {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, completed, dueDate, category })
            });
            return await response.json();
        } catch (error) {
            console.error('할 일 업데이트 오류:', error);
            return null;
        }
    }

    // 할 일을 완료로 표시하기
    async completeTodo(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}/complete`, {
                method: 'PATCH'
            });
            return await response.json();
        } catch (error) {
            console.error('할 일 완료 표시 오류:', error);
            return null;
        }
    }

    // 할 일 삭제하기
    async deleteTodo(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });
            return response.status === 204;
        } catch (error) {
            console.error('할 일 삭제 오류:', error);
            return false;
        }
    }
}

// TodoApp 클래스 - UI 관리
class TodoApp {
    constructor() {
        this.todoService = new TodoService();
        this.currentFilter = 'all';
        this.currentView = 'list';
        this.currentDate = new Date();

        // DOM 요소
        this.todoForm = document.getElementById('todo-form');
        this.todosContainer = document.getElementById('todos-container');
        this.todoTemplate = document.getElementById('todo-template');
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.closeModalBtn = document.querySelector('.close');

        // 뷰 컨테이너
        this.listViewContainer = document.getElementById('list-view-container');
        this.calendarViewContainer = document.getElementById('calendar-view-container');

        // 달력 요소
        this.calendarBody = document.getElementById('calendar-body');
        this.currentMonthElement = document.getElementById('current-month');
        this.prevMonthBtn = document.getElementById('prev-month');
        this.nextMonthBtn = document.getElementById('next-month');

        // 필터 버튼
        this.allTodosBtn = document.getElementById('all-todos');
        this.incompleteTodosBtn = document.getElementById('incomplete-todos');
        this.completedTodosBtn = document.getElementById('completed-todos');

        // 뷰 버튼
        this.listViewBtn = document.getElementById('list-view');
        this.calendarViewBtn = document.getElementById('calendar-view');

        this.init();
    }

    // 앱 초기화
    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.updateCalendarHeader();
        this.setDefaultDateValues();
    }

    // 날짜 입력 필드에 오늘 날짜를 기본값으로 설정
    setDefaultDateValues() {
        const today = new Date().toISOString().split('T')[0];

        // 메인 폼의 날짜 입력 필드
        const dueDateInput = document.getElementById('dueDate');
        if (dueDateInput && !dueDateInput.value) {
            dueDateInput.value = today;
        }

        // 수정 모달의 날짜 입력 필드 (모달이 열릴 때 설정됨)
        const editDueDateInput = document.getElementById('edit-dueDate');
        if (editDueDateInput) {
            // 값이 설정되지 않은 경우에만 기본값 설정
            if (!editDueDateInput.value) {
                editDueDateInput.value = today;
            }
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 폼 제출
        this.todoForm.addEventListener('submit', this.handleAddTodo.bind(this));

        // 필터 버튼
        this.allTodosBtn.addEventListener('click', () => this.setFilter('all'));
        this.incompleteTodosBtn.addEventListener('click', () => this.setFilter('incomplete'));
        this.completedTodosBtn.addEventListener('click', () => this.setFilter('completed'));

        // 뷰 버튼
        this.listViewBtn.addEventListener('click', () => this.setView('list'));
        this.calendarViewBtn.addEventListener('click', () => this.setView('calendar'));

        // 달력 네비게이션
        this.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));

        // 수정 모달
        this.editForm.addEventListener('submit', this.handleUpdateTodo.bind(this));
        this.closeModalBtn.addEventListener('click', () => this.editModal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target === this.editModal) {
                this.editModal.style.display = 'none';
            }
        });
    }

    // 뷰 설정 (목록 또는 달력)
    setView(view) {
        this.currentView = view;

        // 활성 버튼 업데이트
        this.listViewBtn.classList.remove('active');
        this.calendarViewBtn.classList.remove('active');

        if (view === 'list') {
            this.listViewBtn.classList.add('active');
            this.listViewContainer.style.display = 'block';
            this.calendarViewContainer.style.display = 'none';
        } else {
            this.calendarViewBtn.classList.add('active');
            this.listViewContainer.style.display = 'none';
            this.calendarViewContainer.style.display = 'block';
            this.renderCalendar();
        }
    }

    // 달력 월 이동
    navigateMonth(change) {
        this.currentDate.setMonth(this.currentDate.getMonth() + change);
        this.updateCalendarHeader();
        this.renderCalendar();
    }

    // 달력 헤더 업데이트 (현재 월 표시)
    updateCalendarHeader() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        this.currentMonthElement.textContent = `${year}년 ${month}월`;
    }

    // 현재 필터에 따라 할 일 로드
    async loadTodos() {
        this.todosContainer.innerHTML = '<div class="loading">로딩 중...</div>';

        let todos;
        switch (this.currentFilter) {
            case 'incomplete':
                todos = await this.todoService.getIncompleteTodos();
                break;
            case 'completed':
                todos = await this.todoService.getCompletedTodos();
                break;
            default:
                todos = await this.todoService.getAllTodos();
        }

        this.renderTodos(todos);

        // 달력 뷰가 활성화된 경우 달력도 업데이트
        if (this.currentView === 'calendar') {
            this.renderCalendar();
        }
    }

    // 달력 렌더링
    async renderCalendar() {
        // 로딩 표시
        this.calendarBody.innerHTML = '<div class="loading">달력 로딩 중...</div>';

        // 모든 할 일 가져오기
        const todos = await this.todoService.getAllTodos();

        // 현재 월의 첫 날과 마지막 날 계산
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 달력 그리드 생성
        const startingDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)
        const daysInMonth = lastDay.getDate();

        // 이전 달의 마지막 날짜들 계산
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        // 달력 HTML 생성
        let calendarHTML = '';

        // 날짜별로 할 일 그룹화
        const todosByDate = {};
        todos.forEach(todo => {
            if (todo.dueDate) {
                if (!todosByDate[todo.dueDate]) {
                    todosByDate[todo.dueDate] = [];
                }
                todosByDate[todo.dueDate].push(todo);
            }
        });

        // 이전 달의 날짜들 추가
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(year, month - 1, day);
            const dateStr = this.formatDateForCalendar(date);

            calendarHTML += `
                <div class="calendar-day other-month" data-date="${dateStr}">
                    <div class="calendar-day-number">${day}</div>
                    <div class="calendar-day-todos">
                        ${this.renderTodosForDate(todosByDate, dateStr)}
                    </div>
                </div>
            `;
        }

        // 현재 달의 날짜들 추가
        const today = new Date();
        const todayDateStr = today.toISOString().split('T')[0];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDateForCalendar(date);
            const isToday = dateStr === todayDateStr;

            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <div class="calendar-day-number">${day}</div>
                    <div class="calendar-day-todos">
                        ${this.renderTodosForDate(todosByDate, dateStr)}
                    </div>
                </div>
            `;
        }

        // 다음 달의 날짜들 추가 (6주 달력을 만들기 위해)
        const totalCells = 42; // 6주 x 7일
        const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);

        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day);
            const dateStr = this.formatDateForCalendar(date);

            calendarHTML += `
                <div class="calendar-day other-month" data-date="${dateStr}">
                    <div class="calendar-day-number">${day}</div>
                    <div class="calendar-day-todos">
                        ${this.renderTodosForDate(todosByDate, dateStr)}
                    </div>
                </div>
            `;
        }

        this.calendarBody.innerHTML = calendarHTML;

        // 할 일 항목에 클릭 이벤트 추가
        document.querySelectorAll('.calendar-todo-item').forEach(item => {
            item.addEventListener('click', () => {
                const todoId = item.dataset.id;
                const todo = todos.find(t => t.id === todoId);
                if (todo) {
                    this.openEditModal(todo);
                }
            });
        });
    }

    // 특정 날짜의 할 일 렌더링
    renderTodosForDate(todosByDate, dateStr) {
        if (!todosByDate[dateStr] || todosByDate[dateStr].length === 0) {
            return '';
        }

        let todosHTML = '';
        const maxTodosToShow = 3; // 날짜 칸에 표시할 최대 할 일 수
        const todos = todosByDate[dateStr];

        // 할 일 정렬: 미완료 먼저, 그 다음 완료된 할 일
        todos.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return 0;
        });

        // 최대 3개까지만 표시
        const todosToShow = todos.slice(0, maxTodosToShow);

        todosToShow.forEach(todo => {
            const today = new Date().toISOString().split('T')[0];
            let classes = 'calendar-todo-item';

            if (todo.completed) {
                classes += ' completed';
            } else if (todo.dueDate < today) {
                classes += ' overdue';
            } else if (todo.dueDate === today) {
                classes += ' due-today';
            }

            todosHTML += `
                <div class="${classes}" data-id="${todo.id}" title="${todo.title}">
                    ${todo.title}
                </div>
            `;
        });

        // 더 많은 할 일이 있는 경우 표시
        if (todos.length > maxTodosToShow) {
            todosHTML += `<div class="calendar-todo-more">+${todos.length - maxTodosToShow}개 더</div>`;
        }

        return todosHTML;
    }

    // 달력용 날짜 포맷 (YYYY-MM-DD)
    formatDateForCalendar(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 컨테이너에 할 일 렌더링
    renderTodos(todos) {
        this.todosContainer.innerHTML = '';

        if (todos.length === 0) {
            this.todosContainer.innerHTML = '<p>할 일이 없습니다.</p>';
            return;
        }

        todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todosContainer.appendChild(todoElement);
        });
    }

    // 템플릿에서 할 일 요소 생성
    createTodoElement(todo) {
        const todoElement = this.todoTemplate.content.cloneNode(true).querySelector('.todo-item');

        if (todo.completed) {
            todoElement.classList.add('completed');
        }

        // 카테고리 설정
        todoElement.querySelector('.todo-category').textContent = todo.category || '일반';

        // 할 일 내용 설정
        todoElement.querySelector('.todo-title').textContent = todo.title;
        todoElement.querySelector('.todo-description').textContent = todo.description;
        todoElement.querySelector('.todo-created').textContent = `생성: ${this.formatDate(todo.createdAt)}`;
        todoElement.querySelector('.todo-updated').textContent = `수정: ${this.formatDate(todo.updatedAt)}`;

        // 마감일이 있는 경우 설정
        const dueDateElement = todoElement.querySelector('.todo-due-date');
        if (todo.dueDate) {
            dueDateElement.textContent = `마감일: ${todo.dueDate}`;

            // 마감일 임박/지난 작업에 대한 시각적 표시 추가
            const today = new Date().toISOString().split('T')[0];
            if (todo.dueDate < today) {
                dueDateElement.classList.add('overdue');
            } else if (todo.dueDate === today) {
                dueDateElement.classList.add('due-today');
            }
        } else {
            dueDateElement.style.display = 'none';
        }

        // ID에 대한 데이터 속성 설정
        todoElement.dataset.id = todo.id;

        // 액션 버튼 설정
        const completeBtn = todoElement.querySelector('.btn-complete');
        const editBtn = todoElement.querySelector('.btn-edit');
        const deleteBtn = todoElement.querySelector('.btn-delete');

        if (todo.completed) {
            completeBtn.style.display = 'none';
        } else {
            completeBtn.addEventListener('click', () => this.handleCompleteTodo(todo.id));
        }

        editBtn.addEventListener('click', () => this.openEditModal(todo));
        deleteBtn.addEventListener('click', () => this.handleDeleteTodo(todo.id));

        return todoElement;
    }

    // 표시용 날짜 형식 지정
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR');
    }

    // 현재 필터 설정 및 UI 업데이트
    setFilter(filter) {
        this.currentFilter = filter;

        // 활성 버튼 업데이트
        this.allTodosBtn.classList.remove('active');
        this.incompleteTodosBtn.classList.remove('active');
        this.completedTodosBtn.classList.remove('active');

        switch (filter) {
            case 'incomplete':
                this.incompleteTodosBtn.classList.add('active');
                break;
            case 'completed':
                this.completedTodosBtn.classList.add('active');
                break;
            default:
                this.allTodosBtn.classList.add('active');
        }

        this.loadTodos();
    }

    // 새 할 일 추가 처리
    async handleAddTodo(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const dueDate = document.getElementById('dueDate').value;

        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        const todo = await this.todoService.addTodo(title, description, dueDate || null);
        if (todo) {
            this.todoForm.reset();
            this.loadTodos();
        }
    }

    // 할 일 완료 처리
    async handleCompleteTodo(id) {
        const success = await this.todoService.completeTodo(id);
        if (success) {
            this.loadTodos();
        }
    }

    // 할 일 수정 모달 열기
    openEditModal(todo) {
        document.getElementById('edit-id').value = todo.id;
        document.getElementById('edit-title').value = todo.title;
        document.getElementById('edit-description').value = todo.description;
        document.getElementById('edit-completed').checked = todo.completed;

        // 마감일이 있는 경우 설정, 없는 경우 오늘 날짜로 기본값 설정
        const dueDateField = document.getElementById('edit-dueDate');
        if (todo.dueDate) {
            dueDateField.value = todo.dueDate;
        } else {
            // 오늘 날짜를 기본값으로 설정
            dueDateField.value = new Date().toISOString().split('T')[0];
        }

        this.editModal.style.display = 'block';
    }

    // 할 일 업데이트 처리
    async handleUpdateTodo(event) {
        event.preventDefault();

        const id = document.getElementById('edit-id').value;
        const title = document.getElementById('edit-title').value.trim();
        const description = document.getElementById('edit-description').value.trim();
        const completed = document.getElementById('edit-completed').checked;
        const dueDate = document.getElementById('edit-dueDate').value;

        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        const success = await this.todoService.updateTodo(id, title, description, completed, dueDate || null);
        if (success) {
            this.editModal.style.display = 'none';
            this.loadTodos();
        }
    }

    // 할 일 삭제 처리
    async handleDeleteTodo(id) {
        if (confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
            const success = await this.todoService.deleteTodo(id);
            if (success) {
                this.loadTodos();
            }
        }
    }
}

// DOM이 로드되면 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
