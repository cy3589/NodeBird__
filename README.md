# NodeBird

### 개인프로젝트

#### 사용 언어 및 라이브러리

- Front: `NextJS` `ReactJS` `Typescript` `Redux` `Redux-Saga` `react-slick` `emotion`
- Back: `NodeJS` `mySQL` `sequelize` `passport` `bcrypt`

배포여부: O

배포링크: https://nodebird.cy3589.com  
Git: [https://github.com/cy3589/NodeBird\_\_](https://github.com/cy3589/NodeBird__)

- summary: NextJS를 기반으로 만든 트위터와 비슷한 기능을 하는 SNS 웹 서비스 입니다.

- description: NextJS를 기반으로 만든 트위터와 비슷한 기능을 하는 SNS 웹 서비스 입니다.

- Learned

  - 전역 상태를 관리하는 리덕스를 적용하여 리덕스 사용법과 흐름을 알게 되었습니다.

  - 최초 자바스크립트로 만든 프로젝트를 타입스크립트로 리팩토링 하며 타입스크립트를 왜 쓰는지 알게되었습니다

  - 백엔드도 같이 만들면서 프론트와 백엔드가 어떻게 소통하고, 데이터가 어떻게 흘러가는지 알게되었습니다.

  - NextJS의 서버사이드 동작 함수의 동작 흐름과 리덕스와의 연동법을 알게되었습니다.

- Directory
  - FE: `prepare/front`
    - components
      - 컴포넌트가 들어있는 디렉토리 입니다.  
        페이지 단위가 아닌 모든 컴포넌트가 포함되어 있습니다.
    - configs
      - 설정값이 들어있는 디렉토리 입니다.
        백엔드 요청 주소의 url이 들어있습니다.
    - hooks
      - 커스텀 훅 디렉토리 입니다.
        controlled Input이 포함된 컴포넌트의 input을 제어하는 useInput이 들어있습니다.
    - interfaces
      - 타입스크립트로 리팩토링하며 만든 타입들이 들어있는 디렉토리 입니다.
        `redux`에서 사용중인 store 정보에 관한 타입과 인터페이스가 들어있습니다.
    - pages
      - NextJS의 라우팅이 포함되는 페이지 디렉토리 입니다.
    - reducers
      - redux에서 사용한 리듀서를 모아둔 디렉토리 입니다.
    - sagas
      - `reudux-saga`에 사용되는 데이터페칭 함수가 들어있는 디렉토리 입니다.
    - store
      - redux에 사용되는 store가 들어있는 디렉토리 입니다.
        `redux-saga`를 미들웨어로 넣은 wrapper를 반환하는 함수가 들어있습니다.
    - styles
      - Global스타일과 styled컴포넌트가 들어있는 디렉토리 입니다.
  - BE: `prepare/back`
    - config
      - 설정값이 들어있는 디렉토리 입니다.
        DB연결을 위한 설정이 들어있습니다.
        BE를 개인 서버에 두고 배포하여 깃허브에 올라간 해당 설정 내용은 적용되지 않았습니다.
    - models
      - Sequelize를 통해 연결할 모델을 모아둔 디렉토리 입니다.
    - passport
      - 인증을 위한 passport 미들웨어가 들어있는 디렉토리 입니다.
    - routes
      - express의 API요청을 요청 경로에 맞게 나누어 개발하기 위해 router를 모아둔 디렉토리 입니다.
