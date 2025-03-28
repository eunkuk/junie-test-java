# 웹 기반 할 일 관리 애플리케이션

Spring Boot 백엔드와 ECMAScript 6 프론트엔드로 구현된 웹 기반 할 일 관리 애플리케이션입니다.

## 기능

- 제목과 설명이 있는 새로운 할 일 추가
- 할 일에 마감일 설정 가능
- 마감일 지난 할 일 시각적 표시
- 오늘 마감인 할 일 시각적 표시
- 할 일 카테고리 지정 (일반, 업무, 개인, 중요, 긴급)
- 모든 할 일 보기
- 미완료된 할 일 보기
- 완료된 할 일 보기
- 카테고리별 할 일 필터링
- 달력 뷰로 할 일 시각화
- 월별 할 일 달력 탐색
- 기존 할 일 업데이트
- 할 일을 완료로 표시
- 할 일 삭제

## 기술 스택

- **백엔드**: Spring Boot 3.2.3
- **프론트엔드**: HTML5, CSS3, ECMAScript 6
- **빌드 도구**: Gradle

## 프로젝트 구조

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── app/
│   │           ├── config/                     # 애플리케이션 설정 클래스
│   │           ├── exception/                  # 예외 처리 클래스
│   │           ├── todo/
│   │           │   ├── dto/                    # 데이터 전송 객체
│   │           │   ├── TodoController.java     # 할 일 관련 REST API 컨트롤러
│   │           │   └── TodoService.java        # 할 일 관련 비즈니스 로직 서비스
│   │           ├── util/                       # 유틸리티 클래스
│   │           └── TodoApp.java                # Spring Boot 메인 애플리케이션 클래스
│   └── resources/
│       └── static/
│           ├── css/
│           │   └── styles.css                  # 애플리케이션 스타일시트
│           ├── js/
│           │   └── app.js                      # ECMAScript 6 프론트엔드 로직
│           └── index.html                      # 메인 HTML 페이지
```

## 컴파일 및 실행 방법

### 사전 요구사항

- Java Development Kit (JDK) 17 이상
- Gradle 8.5 이상 (또는 포함된 Gradle Wrapper 사용)
- 웹 브라우저 (Chrome, Firefox, Edge 등)

### Gradle로 실행 (권장)

1. 프로젝트 루트 디렉토리로 이동
2. 다음 명령어로 애플리케이션 빌드 및 실행:

```bash
# Windows
gradlew.bat bootRun

# Linux/macOS
./gradlew bootRun
```

### JAR 파일로 실행

1. 프로젝트 루트 디렉토리로 이동
2. JAR 파일 빌드:

```bash
# Windows
gradlew.bat clean build

# Linux/macOS
./gradlew clean build
```

3. JAR 파일 실행:

```bash
java -jar build/libs/todo-app-0.0.1-SNAPSHOT.jar
```

## 사용법

1. 애플리케이션을 실행한 후 웹 브라우저에서 다음 URL 접속:
   ```
   http://localhost:8080
   ```

2. 웹 인터페이스를 통해 할 일 관리:
   - 새 할 일 추가: 폼에 제목, 설명, 마감일(선택사항), 카테고리를 입력하고 "추가" 버튼 클릭
   - 할 일 필터링: "모든 할 일", "미완료 할 일", "완료된 할 일" 버튼 사용
   - 카테고리별 필터링: 카테고리 드롭다운에서 원하는 카테고리 선택
   - 할 일 완료: 할 일 항목의 "완료" 버튼 클릭
   - 할 일 수정: 할 일 항목의 "수정" 버튼 클릭하여 모달 창에서 수정
   - 할 일 삭제: 할 일 항목의 "삭제" 버튼 클릭
   - 마감일 관리: 
     - 마감일이 지난 할 일은 빨간색으로 표시됨
     - 오늘 마감인 할 일은 주황색으로 표시됨
     - 할 일 수정 시 마감일 변경 가능
   - 카테고리 관리:
     - 할 일 생성 시 카테고리 지정 가능 (일반, 업무, 개인, 중요, 긴급)
     - 할 일 수정 시 카테고리 변경 가능
     - 카테고리별로 할 일 목록 필터링 가능
   - 달력 뷰:
     - "달력 보기" 버튼을 클릭하여 달력 뷰로 전환
     - 달력에서 할 일을 날짜별로 시각화
     - "이전 달"과 "다음 달" 버튼으로 월간 이동
     - 할 일 항목을 클릭하여 수정 가능
     - 오늘 날짜는 강조 표시됨
     - 완료된 할 일, 마감일 지난 할 일, 오늘 마감인 할 일은 색상으로 구분됨
     - "목록 보기" 버튼을 클릭하여 목록 뷰로 돌아가기

## REST API 엔드포인트

애플리케이션은 다음 REST API 엔드포인트를 제공합니다:

- `GET /api/todos`: 모든 할 일 조회
- `GET /api/todos/incomplete`: 미완료 할 일 조회
- `GET /api/todos/completed`: 완료된 할 일 조회
- `GET /api/todos/category/{category}`: 특정 카테고리의 할 일 조회
- `GET /api/todos/categories`: 모든 카테고리 목록 조회
- `GET /api/todos/{id}`: ID로 특정 할 일 조회
- `POST /api/todos`: 새 할 일 생성
  - 요청 본문: `{ "title": "할 일 제목", "description": "설명", "dueDate": "YYYY-MM-DD", "category": "카테고리" }`
  - `dueDate`와 `category`는 선택 사항이며, `dueDate`는 ISO 형식의 날짜(YYYY-MM-DD)여야 함
- `PUT /api/todos/{id}`: 기존 할 일 업데이트
  - 요청 본문: `{ "title": "할 일 제목", "description": "설명", "completed": true/false, "dueDate": "YYYY-MM-DD", "category": "카테고리" }`
  - 모든 필드는 선택 사항이며, 제공된 필드만 업데이트됨
- `PATCH /api/todos/{id}/complete`: 할 일을 완료로 표시
- `DELETE /api/todos/{id}`: 할 일 삭제

## 라이선스

이 프로젝트는 오픈 소스이며 [MIT 라이선스](LICENSE)에 따라 사용할 수 있습니다.
