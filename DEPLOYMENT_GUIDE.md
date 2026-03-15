# 로컬 (npm) 프로젝트 온라인 배포 가이드 (GitHub & Netlify)

이 문서는 로컬 환경에서 `npm run dev` 등을 통해 실행하던 프로젝트를 다른 사람들도 볼 수 있도록 **온라인 웹 서비스로 자동 배포**하는 과정을 설명합니다.
다른 서비스나 신규 프로젝트를 진행할 때 이 가이드를 참고하여 동일한 방식으로 손쉽게 배포할 수 있습니다.

## 1. 배포 아키텍처 (어떻게 동작하나요?)

1. **로컬 작업 (나의 컴퓨터)**: 코드를 작성하고 `npm`으로 실행하며 테스트합니다.
2. **GitHub 업로드**: 코드의 변경 사항을 GitHub에 저장합니다. (코드 백업 및 버전 관리)
3. **Netlify 배포 (운영 서버)**: GitHub에 새로운 코드가 올라오면 Netlify가 이를 감지하여 즉시 온라인에 배포합니다.

---

## 2. 사전 준비
* **GitHub 계정**: 코드를 안전하게 저장하고 관리할 저장소
* **GitHub Desktop**: 로컬 코드를 간편하게 GitHub로 올리기 위한 프로그램
* **Netlify 계정**: GitHub에 올라간 코드를 가져와서 실제 웹사이트로 만들어주는(호스팅) 서비스

---

## 3. GitHub에 프로젝트 업로드

1. **GitHub Desktop에서 로컬 프로젝트 연결**
   - 메뉴에서 `File` > `Add local repository...` 선택 후, 현재 작업 중인 프로젝트 폴더를 선택합니다.
   - 처음 연결하는 경우 폴더를 Git 저장소로 만들겠냐는 안내가 나오면 **"create a repository"** 링크를 클릭합니다.
2. **코드 커밋(Commit) 및 푸시(Publish)**
   - 좌측 하단 Summary(제목)에 작업 내용(예: "첫 배포 준비")을 적고 **`Commit to main`**을 클릭합니다.
   - 상단의 **`Publish repository`** 버튼을 누릅니다.
   - 저장소 이름을 입력하고 GitHub 서버로 소스 코드를 최초 업로드합니다.
3. **⚠️ 보안 주의사항 (`.gitignore`)**
   - `.env`나 `.env.local` 같은 API 키가 포함된 민감한 파일은 절대 GitHub에 올라가면 안 됩니다!
   - 프로젝트 최상단에 있는 `.gitignore` 파일에 `.env` 및 `.env.local`이 등록되어 있는지 꼭 확인하세요.

---

## 4. Netlify를 통한 배포 (Hosting) 및 환경 변수 설정

1. **Netlify 새 사이트 추가**
   - Netlify(netlify.com)에 로그인 후, 대시보드에서 `Add new site` > `Import an existing project`를 클릭합니다.
   - 소스 코드 제공자로 `GitHub`를 선택하고 방금 업로드한 레포지토리를 찾아 연결합니다.
2. **빌드 설정(Build settings) 확인** (React/Vite 프로젝트 기준)
   - **Base directory**: (프로젝트 최상단이라면 비워둠)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (Vite는 `dist`, Create React App은 `build` 폴더를 주로 사용합니다.)
3. **📌 환경 변수(Environment Variables) 추가 (매우 중요)**
   - 로컬의 `.env.local` 파일은 GitHub에 올리지 않았기 때문에, 배포 서버(Netlify)가 코드를 실행할 때 API 키를 알 수 없습니다.
   - 배포 설정 하단의 `Environment variables` 탭에서 로컬에서 쓰던 API 키들을 모두 입력해 주어야 합니다. 
     - *예: Key 부분에 `VITE_GEMINI_API_KEY`, Value 부분에 `본인의_API_키` 입력*
4. **배포 시작**
   - 모든 설정이 완료되면 화면 하단의 **`Deploy site` (또는 Deploy)** 버튼을 클릭합니다.
   - 성공적으로 빌드가 끝나면 초록색으로 변경되며 접속 가능한 **공개 URL**이 제공됩니다.

---

## 5. React/Vite 통신을 위한 라우팅 설정 (`netlify.toml`)

React나 Vite 같은 SPA(Single Page Application) 프로젝트는 메뉴 이동 후 새로고침 시 `404 Not Found` 에러가 발생할 수 있습니다. 
이를 방지하기 위해 프로젝트 폴더 최상단에 **`netlify.toml`** 파일을 만들고 아래 내용을 저장해 둡니다.

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  # 모든 경로의 요청을 index.html로 보내서 React/Vite가 알아서 처리하도록 합니다.
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  SECRETS_SCAN_SMART_DETECTION_ENABLED = "false"
```

위 파일이 작성되어 있으면, Netlify가 알아서 빌드 명령어와 도메인 라우팅을 세팅해 줍니다. 

## 🎉 배포 이후의 작업 방식 (간단함!)
초기 세팅이 끝났으므로, 앞으로 로컬에서 코드를 수정하고 나서는 다음 행동만 하면 됩니다.
1. 코드를 수정하고 로컬에서 확인
2. **GitHub Desktop** 프로그램에서 `Commit` 하고 **`Push origin`** 버튼 클릭
3. Netlify가 변경 코드를 **자동으로 감지하고 빌드하여 온라인 서버에 반영** (약 1~2분 소요)
