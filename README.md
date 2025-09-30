# JavaScript 디옵스케이터 (Deobfuscator)

난독화 및 패킹된 JavaScript 코드를 해제하는 웹 애플리케이션입니다.

## 🌟 기능

- ✅ **eval() 기반 난독화 해제**: eval 함수로 감싸진 난독화 코드를 해제합니다
- ✅ **Packer 해제**: Dean Edwards Packer로 패킹된 코드를 언팩합니다
- ✅ **16진수 문자열 디코딩**: `\x48\x65\x6c\x6c\x6f` 형식의 문자열을 해독합니다
- ✅ **Unicode 이스케이프 시퀀스**: `\u0048\u0065\u006c\u006c\u006f` 형식을 해독합니다
- ✅ **배열/객체 디코딩**: 난독화된 배열 접근 패턴을 단순화합니다
- ✅ **코드 정리 (Beautify)**: 결과 코드를 읽기 쉽게 포맷팅합니다

## 🚀 사용 방법

1. **웹 브라우저에서 실행**
   - `index.html` 파일을 브라우저에서 열기
   - 또는 로컬 웹 서버로 실행:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (http-server)
     npx http-server
     ```
   - 브라우저에서 `http://localhost:8000` 접속

2. **난독화된 코드 입력**
   - 입력 영역에 난독화된 JavaScript 코드를 붙여넣기
   - 또는 "샘플 로드" 버튼을 클릭하여 예제 코드 로드

3. **디옵스케이트 실행**
   - "🔓 디옵스케이트" 버튼 클릭
   - 또는 `Ctrl + Enter` (Windows/Linux) / `Cmd + Enter` (Mac) 단축키 사용

4. **결과 확인 및 다운로드**
   - 출력 영역에서 디옵스케이트된 코드 확인
   - "📋 복사" 버튼으로 클립보드에 복사
   - "💾 다운로드" 버튼으로 파일로 저장

## 📋 옵션

- **코드 정리 (Beautify)**: 디옵스케이트된 코드를 보기 좋게 포맷팅
- **eval() 해제**: eval 기반 난독화를 해제
- **Packer 해제**: Packer로 패킹된 코드를 언팩

## 🎯 지원되는 난독화 유형

### 1. eval 기반 난독화
```javascript
eval(function(p,a,c,k,e,d){...}('...',10,10,'...'.split('|'),0,{}))
```

### 2. Packer (Dean Edwards)
```javascript
eval(function(p,a,c,k,e,r){...}('...',62,167,'...'.split('|'),0,{}))
```

### 3. 16진수 인코딩
```javascript
var str = "\x48\x65\x6c\x6c\x6f\x20\x57\x6f\x72\x6c\x64";
```

### 4. Unicode 이스케이프
```javascript
var str = "\u0048\u0065\u006c\u006c\u006f";
```

### 5. 배열 난독화
```javascript
var _0x1234 = ['value1', 'value2'];
console.log(_0x1234[0]);
```

## 🔧 기술 스택

- **HTML5**: 웹 페이지 구조
- **CSS3**: 반응형 디자인 및 스타일링
- **Vanilla JavaScript**: 클라이언트 사이드 로직 (프레임워크 없음)

## 📁 파일 구조

```
deobfuscator/
├── index.html           # 메인 HTML 파일
├── style.css           # 스타일시트
├── deobfuscator.js     # 디옵스케이터 핵심 로직
├── app.js              # UI 인터랙션 로직
└── README.md           # 문서
```

## 🎨 주요 기능

### 사용자 인터페이스
- 직관적인 입력/출력 영역
- 반응형 디자인 (모바일 지원)
- 다크 모드 친화적인 색상 구성
- 실시간 알림 시스템

### 단축키
- `Ctrl/Cmd + Enter`: 디옵스케이트 실행
- `Ctrl/Cmd + K`: 입력 영역 지우기

### 편의 기능
- 샘플 코드 로드
- 결과 복사 (클립보드)
- 결과 다운로드 (파일)
- 여러 옵션 설정

## ⚠️ 주의사항

1. **보안**: 이 도구는 코드를 실행할 수 있습니다. 신뢰할 수 없는 코드를 디옵스케이트할 때는 주의하세요.
2. **제한사항**: 일부 고도로 복잡한 난독화는 완전히 해제되지 않을 수 있습니다.
3. **성능**: 매우 큰 코드 파일의 경우 처리 시간이 오래 걸릴 수 있습니다.

## 🤝 기여하기

이 프로젝트는 오픈소스입니다. 개선 사항이나 버그 리포트는 언제든지 환영합니다!

## 📜 라이선스

MIT License

## 🔗 관련 리소스

- [JavaScript 난독화란?](https://en.wikipedia.org/wiki/Obfuscation_(software))
- [JavaScript Beautifier](https://beautifier.io/)
- [Dean Edwards Packer](http://dean.edwards.name/packer/)

## 💡 예제

### 입력 (난독화된 코드)
```javascript
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('0.1("2 3!");',4,4,'console|log|Hello|World'.split('|'),0,{}))
```

### 출력 (디옵스케이트된 코드)
```javascript
console.log("Hello World!");
```

---

**Made with ❤️ for the JavaScript community**