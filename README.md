# KAKAMU-FE

---

## 1. 추가로 필요한 요소 (SNS 도메인 기준)

### 1-1. 인프라 / 백엔드 연동
| 영역 | 항목 | 비고 |
|------|------|------|
| 실시간 | WebSocket / SSE (react-native-sse) | 피드 업데이트, 알림, 채팅 |
| 미디어 | 이미지·영상 업로드, CDN | S3 + CloudFront 혹은 Cloudflare R2 |
| 푸시 알림 | FCM / APNs | expo-notifications 또는 @react-native-firebase/messaging |
| 딥링크 | Universal Link / App Link | expo-linking 또는 react-native-deep-linking |
| 인증 | OAuth2 (소셜 로그인), JWT Refresh | 카카오·애플·구글 |

### 1-2. 추가 패키지
| 범주 | 패키지 |
|------|--------|
| 미디어 | expo-image-picker, expo-av, react-native-fast-image |
| 지도·위치 | react-native-maps, expo-location |
| 카메라 | expo-camera |
| 공유 | react-native-share |
| 접근성 | @react-native-aria/* |
| 딥링크 | expo-linking |
| 푸시 | @react-native-firebase/messaging |
| 분석 | Firebase Analytics |
| 에러 추적 | @sentry/react-native |
| 성능 | react-native-performance, Flipper |
| 국제화 | i18next, react-i18next |
| 날짜 | date-fns |
| 접근성 | react-native-screens (네이티브 스크린 최적화) |

### 1-3. 설계 관점에서 필요한 추가 고려사항
- **Optimistic UI**: 좋아요·팔로우 즉시 반영 → TanStack Query `optimisticUpdates`
- **무한 스크롤 / 커서 기반 페이지네이션**: `useInfiniteQuery`
- **오프라인 지원**: `@tanstack/query-persist-client-core` + MMKV storage
- **미디어 스트리밍**: HLS/DASH 영상 피드
- **컨텐츠 모더레이션**: 신고 플로우, 관리자 대시보드 (Next.js admin 앱)
- **알고리즘 피드 vs 시간순 피드** 전환 UX
- **E2E 암호화** (DM 채팅)

### 1-4. shadcn 기반 ui 구성
- shadcn의 preset을 로드한 후 기능에 맞게 react-native-web의 컴포넌트를 활용해 react-native에서도 활용 가능하게 제작
- class-variance-authority, react-native-web, nativewind, react-native-reanimated, react-native-aria를 활용할 것
- tailwind v4를 적용
- https://ui.shadcn.com/llms.txt를 참조하여 필요한 component들을 구현할 것

---

## 2. 패키지 구성

### 2-1. 전체 디렉토리 구조

```
sns-platform/
├── apps/
│   ├── client/                  # Expo (React Native)
│   └── admin/                   # Next.js 15 (관리자 대시보드)
├── packages/
│   ├── ui/                      # 공유 컴포넌트 (RN + Web 크로스)
│   ├── api/                     # API 클라이언트 (ky + react-native-sse)
│   ├── store/                   # Zustand 스토어 (공유 가능한 로직)
│   ├── query/                   # TanStack Query 훅 모음
│   ├── schema/                  # Zod 스키마 (공유)
│   ├── config/                  # ESLint, TypeScript, Tailwind 설정
│   ├── i18n/                    # 다국어 리소스
│   └── types/                   # 도메인 타입 정의
├── tooling/
│   ├── eslint/
│   ├── typescript/
│   └── tailwind/
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### 2-2. 각 패키지 상세

#### `apps/client` — Expo (React Native)
```
client/
├── app/                         # Expo Router (파일 기반 라우팅)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── feed/
│   │   │   ├── index.tsx        # 메인 피드
│   │   │   └── [postId].tsx     # 게시물 상세
│   │   ├── explore/
│   │   ├── notifications/
│   │   ├── messages/
│   │   │   ├── index.tsx
│   │   │   └── [roomId].tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       └── [userId].tsx
│   └── _layout.tsx
├── src/
│   ├── components/              # 앱 전용 컴포넌트
│   │   ├── feed/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostCardSkeleton.tsx
│   │   │   ├── FeedList.tsx
│   │   │   └── StoryRow.tsx
│   │   ├── media/
│   │   │   ├── ImageViewer.tsx
│   │   │   └── VideoPlayer.tsx
│   │   └── shared/
│   ├── hooks/                   # 앱 전용 훅
│   ├── features/                # 도메인별 기능 모듈
│   │   ├── auth/
│   │   ├── feed/
│   │   ├── post/
│   │   ├── profile/
│   │   ├── notification/
│   │   └── chat/
│   └── lib/
│       ├── mmkv.ts              # 오프라인 스토리지
│       └── sentry.ts
├── app.config.ts
└── tailwind.config.ts
```

#### `packages/api`
```
api/
├── src/
│   ├── client.ts                # ky 인스턴스 팩토리 (RN / Web 공용)
│   ├── sse.ts                   # react-native-sse 래퍼
│   ├── endpoints/
│   │   ├── auth.ts
│   │   ├── feed.ts
│   │   ├── post.ts
│   │   ├── user.ts
│   │   ├── notification.ts
│   │   └── chat.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts  # JWT refresh 처리
│   │   └── error.interceptor.ts
│   └── types/
│       └── responses.ts
└── package.json
```

#### `packages/query`
```
query/
├── src/
│   ├── keys/                    # Query key factory
│   │   ├── feed.keys.ts
│   │   ├── post.keys.ts
│   │   └── user.keys.ts
│   ├── hooks/
│   │   ├── feed/
│   │   │   ├── useFeed.ts       # useInfiniteQuery
│   │   │   └── usePost.ts
│   │   ├── user/
│   │   │   ├── useProfile.ts
│   │   │   └── useFollow.ts     # optimistic update 포함
│   │   ├── notification/
│   │   └── chat/
│   └── providers/
│       └── QueryProvider.tsx
└── package.json
```

#### `packages/schema`
```
schema/
├── src/
│   ├── auth.schema.ts           # login, register form 검증
│   ├── post.schema.ts           # 게시물 작성 검증
│   ├── profile.schema.ts
│   ├── comment.schema.ts
│   └── common.schema.ts         # 페이지네이션, 공통 응답 타입
└── package.json
```

#### `packages/ui`
```
ui/
├── src/
│   ├── primitives/              # 플랫폼 추상 기본 컴포넌트
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   └── Text/
│   ├── composed/                # 복합 컴포넌트
│   │   ├── UserCard/
│   │   ├── PostFooter/          # 좋아요·댓글·공유
│   │   └── HashtagChip/
│   └── platform/
│       ├── native/              # RN 전용 구현
│       └── web/                 # Web 전용 구현
└── package.json
```

#### `packages/store`
```
store/
├── src/
│   ├── auth.store.ts            # 인증 상태 (토큰, 사용자 세션)
│   ├── feed.store.ts            # 피드 필터·정렬 상태
│   ├── ui.store.ts              # 모달·시트·테마
│   ├── notification.store.ts    # 미읽음 카운트, SSE 연결 상태
│   └── index.ts
└── package.json
```

---

## 3. Monorepo 활용

### 3-1. Monorepo 툴링

| 도구 | 역할 |
|------|------|
| **pnpm workspace** | 패키지 링킹, 호이스팅 전략 |
| **Turborepo** | 빌드 오케스트레이션, 원격 캐시 |
| **Changesets** | 패키지 버전 관리, 체인지로그 자동화 |

### 3-2. pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

### 3-3. turbo.json (핵심 태스크 정의)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["NODE_ENV", "NEXT_PUBLIC_*", "EXPO_PUBLIC_*"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", ".expo/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "test": {
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 3-4. 전체 Monorepo 구조

```
sns-platform/
│
├── apps/
│   ├── client/                  # Expo SDK 52+ (React Native)
│   │   ├── app/                 # Expo Router v3 (파일 기반)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   └── lib/
│   │   ├── app.config.ts
│   │   ├── tailwind.config.ts   # NativeWind 5 설정
│   │   └── package.json
│   │
│   └── admin/                   # Next.js 15 (관리자)
│       ├── app/
│       └── package.json
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── api/                     # ky 기반 API 클라이언트
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── sse.ts
│   │   │   ├── endpoints/
│   │   │   └── interceptors/
│   │   └── package.json
│   │
│   ├── query/                   # TanStack Query 훅 + key factory
│   │   ├── src/
│   │   │   ├── keys/
│   │   │   ├── hooks/
│   │   │   └── providers/
│   │   └── package.json
│   │
│   ├── store/                   # Zustand 스토어
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── schema/                  # Zod 스키마 (공유 검증 로직)
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── types/                   # 도메인 타입 정의
│   │   ├── src/
│   │   │   ├── entities/        # User, Post, Comment, Chat...
│   │   │   ├── api/             # Request/Response 타입
│   │   │   └── common.ts
│   │   └── package.json
│   │
│   ├── i18n/                    # 다국어 리소스 + 훅
│   │   ├── locales/
│   │   │   ├── ko/
│   │   │   └── en/
│   │   └── package.json
│   │
│   └── config/                  # 공유 설정
│       ├── tailwind/
│       │   └── base.ts          # Tailwind 공통 preset
│       └── package.json
│
├── tooling/
│   ├── eslint/
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── native.js
│   │   └── package.json
│   │
│   └── typescript/
│       ├── base.json
│       ├── next.json
│       ├── native.json
│       └── package.json
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                 # 루트 devDependencies (turbo, changesets)
└── .changeset/
```

---

## 4. 핵심 기술 결정 사항 (ADR 요약)

### 4-1. 라우팅
- **Mobile**: Expo Router v3 — 파일 기반, 딥링크 자동 처리, 웹 공유 가능
- **Web**: Next.js App Router — RSC, Streaming, Server Actions 활용

### 4-2. 데이터 패칭 계층 분리
```
API Layer (packages/api)
  → Query Layer (packages/query) : useInfiniteQuery, optimistic updates
    → Feature Layer (apps/*/features) : 도메인 로직
      → UI Layer (apps/*/components + packages/ui) : 렌더링
```

### 4-3. 인증 플로우
- Access Token: 메모리 (Zustand auth store)
- Refresh Token: SecureStore (mobile) / httpOnly Cookie (web)
- ky `beforeError` 훅에서 401, 403 감지 → silent refresh → 원래 요청 재시도

### 4-4. 실시간 처리 전략
| 기능 | 방식 |
|------|------|
| 피드 새 게시물 알림 | SSE (react-native-sse) |
| 좋아요·댓글 카운트 | Optimistic Update + SSE invalidation |
| DM 채팅 | WebSocket (별도 연결 관리) |
| 푸시 알림 | FCM / APNs |

### 4-5. 스타일링 전략
- **공유 토큰**: `packages/config/tailwind/base.ts`에 색상·타이포·간격 정의
- **Mobile**: NativeWind 5 (Tailwind CSS v4 기반, 네이티브 StyleSheet 컴파일)
- **Web**: Tailwind CSS v4 직접 사용
- **크로스플랫폼 컴포넌트**: `packages/ui`에서 플랫폼별 구현 분기 (`Platform.OS` 또는 파일 확장자 `.native.tsx` / `.web.tsx`)

### 4-6. 테스트 전략
| 단계 | 도구 | 대상 |
|------|------|------|
| Unit | Vitest | schema, store, utils |
| Component | Testing Library | packages/ui |
| Integration | Vitest + MSW | query hooks |
| E2E (Web) | Cypress | Next.js 핵심 플로우 |
| E2E (Mobile) | Detox | Expo 핵심 플로우 |

> Cypress는 Next.js(web, admin) 앱의 E2E에 적용합니다. React Native E2E는 Detox가 사실상 표준이므로 병행 구성을 권장합니다.

### 4-7. CI/CD 파이프라인 (GitHub Actions)
```
push → Turborepo affected 분석
  → lint + typecheck (전체)
  → unit/integration test (affected)
  → E2E (Cypress: web/admin, Detox: mobile — PR merge 시)
  → build
    → web/admin: Vercel 배포
    → mobile: EAS Build → TestFlight / Google Play Internal
```

---

## 5. 패키지 의존성 다이어그램

```
apps/mobile ──┬──→ packages/ui
              ├──→ packages/api
              ├──→ packages/query
              ├──→ packages/store
              ├──→ packages/schema
              ├──→ packages/types
              └──→ packages/i18n

apps/admin ───┬──→ packages/api
              ├──→ packages/schema
              └──→ packages/types

packages/query ──→ packages/api, packages/types
packages/api ────→ packages/types
packages/schema ─→ packages/types
packages/store ──→ packages/types
```

> 순환 의존성 방지 원칙: `packages/*`는 다른 `packages/*`를 참조할 수 있지만, `apps/*`를 절대 참조하지 않습니다.